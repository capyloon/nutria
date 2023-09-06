// The wake up screen displays basic information when tilting the device:
// - current time.
// - number of unread notifications.
// - battery level.

class WakeUpScreen extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    <link rel="stylesheet" href="components/wakeup_screen.css">
    <div class="flex-half-fill"></div>
    <div>
      <div class="time"></div>
      <div class="date"></div>
    </div>
    <div class="notifications none"></div>
    <div class="flex-fill"></div>
    <div class="power">
      <sl-icon name="battery" class="battery-icon"></sl-icon>
      <div class="battery-level"></div>
    </div>
    `;

    this.time = shadow.querySelector(".time");
    this.date = shadow.querySelector(".date");

    this.clockTimer = new MinuteTimer();
    this.clockTimer.addEventListener("tick", () => {
      this.updateTimeAndDate();
    });
    this.clockTimer.suspend();

    this._open = false;

    // Uncomment for testing on desktop with 'W' key shortcut:
    //
    // keyManager.registerShortPressAction("W", "wakeup");
    // actionsDispatcher.addListener("wakeup-short-press", () => {
    //   this.open();
    // });
  }

  open() {
    if (this._open) {
      this.close();
      return;
    }
    let shadow = this.shadowRoot;
    window.batteryHelper.addListener(
      "wakeupscreen",
      shadow.querySelector(".battery-icon"),
      shadow.querySelector(".battery-level")
    );
    this.updateTimeAndDate();
    this.clockTimer.resume();

    this.classList.add("open");
    this._open = true;

    this.updateNotifications();
  }

  updateNotifications() {
    let notifications = document
      .querySelector("quick-settings")
      .getNotifications();
    let node = this.shadowRoot.querySelector(".notifications");
    node.innerHTML = ``;

    if (notifications.length == 0) {
      node.classList.add("none");
      return;
    }

    // Get all the unique notification icons.
    let icons = new Set();

    notifications.forEach((notification) => {
      let iconPart = `<img class="icon" src="${notification.icon}" />`;
      if (notification.icon.startsWith("system-icon:")) {
        iconPart = `<sl-icon name=${
          notification.icon.split(":")[1]
        } ></sl-icon>`;
      }
      icons.add(iconPart);
    });

    icons.forEach((icon) => {
      node.innerHTML += icon;
    });
    node.classList.remove("none");
  }

  close() {
    this.classList.remove("open");
    this.clockTimer.suspend();
    window.batteryHelper.removeListener("wakeupscreen");
    this._open = false;
  }

  // TODO: share with lock_screen.js
  updateTimeAndDate() {
    // Manually apply offset to UTC since we have no guarantee that
    // anything else but `UTC` will work in DateTimeFormat.
    let now = Date.now() - new Date().getTimezoneOffset() * 60 * 1000;

    if (!this.timeFormat) {
      this.timeFormat = new Intl.DateTimeFormat("default", {
        hour: "numeric",
        minute: "numeric",
        timeZone: "UTC",
        hour12: false,
      });
    }
    this.time.textContent = this.timeFormat.format(now);

    if (!this.dateFormat) {
      this.dateFormat = new Intl.DateTimeFormat("default", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    }
    this.date.textContent = this.dateFormat.format(now);
  }
}

customElements.define("wakeup-screen", WakeUpScreen);
