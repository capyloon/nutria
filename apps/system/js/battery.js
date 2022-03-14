// A battery helper class.
// It will update a battery icon and text level,
// without dealing with details of styling.
// Used by the status bar and the lockscreen.

export class BatteryHelper {
  constructor() {
    this.listeners = new Map();

    if (!navigator.getBattery) {
      console.error("navigator.getBattery is not implemented!");
      return;
    }

    // Setup the battery listeners.
    navigator.getBattery().then(
      (battery) => {
        this.battery = battery;
        // Display the initial state.
        this.updateBatteryInfo();

        // Listen for charging and level changes.
        battery.addEventListener("levelchange", () => {
          this.updateBatteryInfo();
        });
        battery.addEventListener("chargingchange", () => {
          this.updateBatteryInfo();
        });
      },
      () => {
        // No battery information available, keep the icon hidden.
        console.error("No battery information available.");
      }
    );
  }

  addListener(name, icon, level = null) {
    this.listeners.set(name, { icon, level });
    this.updateBatteryDisplay(icon, level);
  }

  removeListener(name) {
    this.listeners.delete(name);
  }

  updateBatteryInfo() {
    console.log(
      `Battery info: ${this.battery.charging ? "charging" : "discharging"} ${
        this.battery.level * 100
      }%`
    );

    // If we are below 3% and not charging, shutdown.
    if (!this.battery.charging && this.battery.level <= 0.03) {
      actionsDispatcher.dispatch("action-shutdown");
    }

    this.listeners.forEach((listener) => {
      this.updateBatteryDisplay(listener.icon, listener.level);
    });
  }

  updateBatteryDisplay(icon = null, level = null) {
    if (!icon) {
      return;
    }

    if (level) {
      level.textContent = `${Math.round(this.battery.level * 100)}%`;
    }

    if (this.battery.level < 0.3) {
      icon.classList.add("low-battery");
    } else {
      icon.classList.remove("low-battery");
    }

    if (this.battery.charging) {
      icon.setAttribute("name", "battery-charging");
      return;
    }

    let kind;
    if (this.battery.level < 0.25) {
      kind = "battery";
    } else if (this.battery.level < 0.5) {
      kind = "battery-low";
    } else if (this.battery.level < 0.75) {
      kind = "battery-medium";
    } else {
      kind = "battery-full";
    }

    icon.setAttribute("name", kind);
  }
}
