// Power menu actions.

const kDefaultIdleTimeoutSec = 30;

class ScreenManager {
  constructor() {
    actionsDispatcher.addListener("set-screen-on", () => {
      document.body.classList.remove("screen-off");
    });

    actionsDispatcher.addListener("set-screen-off", () => {
      document.body.classList.add("screen-off");
      window.lockscreen.lock();
    });
  }
}

class PowerManagerService {
  constructor() {
    this._ready = Promise.reject();

    actionsDispatcher.addListener("set-screen-on", () => {
      this.turnOn();
    });

    actionsDispatcher.addListener("set-screen-off", () => {
      this.turnOff();
    });

    actionsDispatcher.addListener("action-shutdown", () => {
      this.shutDown();
    });

    actionsDispatcher.addListener("action-reboot", () => {
      this.reboot();
    });

    this.init();
  }

  init() {
    this._ready = new Promise((resolve, reject) => {
      window.apiDaemon.getPowerManager().then(
        (service) => {
          this.service = service;
          resolve();
        },
        (error) => {
          console.error(`Failed to get PowerManager service: ${error}`);
          reject(error);
        }
      );
    });

    // Listen to battery charging status change events to turn on the screen.
    if (!navigator.getBattery) {
      console.error("navigator.getBattery is not implemented!");
      return;
    }

    // Setup the battery listeners.
    navigator.getBattery().then(
      (battery) => {
        // Set initial state.
        this.isCharging = battery.charging;
        battery.addEventListener("chargingchange", () => {
          this.isCharging = battery.charging;
          actionsDispatcher.dispatch(
            "plugged-status-changed",
            battery.charging
          );
        });
      },
      () => {
        // No battery information available, keep the icon hidden.
        console.error("No battery information available.");
      }
    );
  }

  ready() {
    return this._ready;
  }

  turnOn() {
    this.ready().then(async () => {
      console.log(
        `==== PowerManagerService::turnOn brightness=${this._currentBrighness}`
      );
      let screenControlInfo = {
        state: 0, // ScreenState.ON
        brightness: this._currentBrighness || 100,
        external: false,
      };
      await this.service.controlScreen(screenControlInfo);
      console.log(`==== PowerManagerService::turnOn done`);
    });
  }

  turnOff() {
    this.ready().then(async () => {
      this._currentBrighness = await this.service.screenBrightness;
      console.log(
        `==== PowerManagerService::turnOff brightness=${this._currentBrighness}`
      );
      let screenControlInfo = {
        state: 1, // ScreenState.OFF
        brightness: 0,
        external: false,
      };
      await this.service.controlScreen(screenControlInfo);
      console.log(`==== PowerManagerService::turnOff done`);

      // Wake up on any key on desktop.
      if (embedder.sessionType !== "mobile") {
        embedder.addSystemEventListener(
          "keydown",
          function keyWakeUp() {
            actionsDispatcher.dispatch("set-screen-on");
            embedder.removeSystemEventListener("keydown", keyWakeUp, true);
          },
          true
        );
      }
    });
  }

  showLogo(mode, timeout) {
    let logo = document.getElementById("logo");
    if (!logo) {
      return Promise.resolve();
    } else {
      logo.classList.add(mode);
      logo.classList.remove("hidden");
      return new Promise((resolve) => {
        window.setTimeout(resolve, timeout);
      });
    }
  }

  shutDown() {
    this.ready().then(async () => {
      await this.showLogo("shutdown", 2000);
      this.service.powerOff();
    });
  }

  reboot() {
    this.ready().then(async () => {
      await this.showLogo("reboot", 2000);
      this.service.reboot();
    });
  }

  set brightness(value) {
    if (this.service) {
      this.service.screenBrightness = value;
    }
  }

  get brightness() {
    return this.service ? this.service.screenBrightness : 0;
  }
}

class PowerManagement {
  constructor() {
    this.screenManager = new ScreenManager();
    this.service = new PowerManagerService();
    this.powerOn = true;
    this.service.turnOn();
    this.inPowerMenu = false;
    this.powerMenu = document.body.querySelector("reboot-menu");

    // Short press turns on/off the screen.
    actionsDispatcher.addListener("power-short-press", () => {
      // If we are in the power menu, close it.
      if (this.powerMenu.isOpen) {
        this.powerMenu.close();
      }

      this.powerOn = !this.powerOn;
      actionsDispatcher.dispatch(
        this.powerOn ? "set-screen-on" : "set-screen-off"
      );
      // TODO: add embedding support to throttle the system app when the screen is off.
    });

    // Long press open the power menu.
    actionsDispatcher.addListener("power-long-press", () => {
      this.powerMenu.open();
    });

    // Forces the screen to turn on, when plugging or unplugging the device.
    actionsDispatcher.addListener("plugged-status-changed", () => {
      if (!this.powerOn) {
        this.powerOn = true;
        actionsDispatcher.dispatch("set-screen-on");
      }
    });

    // Automatically turn off the screen when idle for too long.
    // TODO: configure with a setting.
    embedder.userIdle.addObserver((topic, duration) => {
      console.log(
        `PowerManagement: Idle state change to ${topic} for ${duration}s`
      );

      if (topic !== "idle") {
        this.powerOn = true;
        actionsDispatcher.dispatch("set-screen-on");
        return;
      }

      if (!this.powerOn) {
        return;
      }

      // TODO: use a setting to control this behavior.
      // Don't turn off the screen if the device is plugged in and is not a
      // full screen session.
      if (this.service.isCharging && embedder.sessionType !== "session") {
        console.log(`PowerManagement: don't turn off the screen of a plugged in device.`);
        return;
      }

      this.powerOn = false;
      actionsDispatcher.dispatch("set-screen-off");
    }, kDefaultIdleTimeoutSec);
  }

  get powerService() {
    return this.service;
  }
}

window.powerManager = new PowerManagement();
