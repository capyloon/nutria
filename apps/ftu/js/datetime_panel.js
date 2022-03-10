// Display panel management module.

class DatetimePanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("datetime-panel");
    this.ready = false;
    this.panel.addEventListener("panel-ready", this);
  }

  log(msg) {
    console.log(`DateTimePanel: ${msg}`);
  }

  error(msg) {
    console.error(`DateTimePanel: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "panel-ready") {
      this.init();
    }
  }

  updateClock(event) {
    this.log(`updateClock -> ${event.detail.value}`);
    let details = document.getElementById("datetime-clock-details");
    if (event.detail.value) {
      details.classList.add("hidden");
    } else {
      details.classList.remove("hidden");
    }
  }

  updateTimezone(event) {
    this.log(`updateTimezone -> ${event.detail.value}`);
    if (!event.detail.value && !this.timezonesLoaded) {
      this.loadTimezones();
    }

    let details = document.getElementById("datetime-timezone-details");
    if (event.detail.value) {
      details.classList.add("hidden");
    } else {
      details.classList.remove("hidden");
    }
  }

  selectTimezone(event) {
    this.log(`timezone selected: ${event.detail.item.timezone}`);
    if (this.timezoneSelected) {
      this.timezoneSelected.checked = false;
    }
    this.timezoneSelected = event.detail.item;
    this.timezoneSelected.checked = true;
    this.setTimeZone();
  }

  async ensureTimeService() {
    if (!this.timeService) {
      this.timeService = await apiDaemon.getTimeService();
    }
    return this.timeService;
  }

  getSuccessClockToast() {
    if (!this.successClockToast) {
      this.successClockToast = document.getElementById(
        "datetime-clock-success"
      );
    }
    return this.successClockToast;
  }

  getErrorClockToast() {
    if (!this.errorClockToast) {
      this.errorClockToast = document.getElementById("datetime-clock-error");
    }
    return this.errorClockToast;
  }

  getSuccessTimezoneToast() {
    if (!this.successTimezoneToast) {
      this.successTimezoneToast = document.getElementById(
        "datetime-timezone-success"
      );
    }
    return this.successTimezoneToast;
  }

  getErrorTimezoneToast() {
    if (!this.errorTimezoneToast) {
      this.errorTimezoneToast = document.getElementById(
        "datetime-timezone-error"
      );
    }
    return this.errorTimezoneToast;
  }

  async setTimeZone() {
    if (!this.timezoneSelected) {
      return;
    }
    let timezone = this.timezoneSelected.timezone;
    try {
      let service = await this.ensureTimeService();
      await service.setTimezone(timezone);
      this.log(`Timezone set to ${timezone}`);
      let alert = this.getSuccessTimezoneToast();
      alert.querySelector("#datetime-timezone-value").textContent =
        timezone.replace(/_/g, " ");
      alert.toast();
    } catch (e) {
      this.error(`setTimeZone to ${timezone} failed: ${e}`);
      let alert = this.getErrorTimezoneToast();
      alert.toast();
    }
  }

  async loadTimezones() {
    let url = `http://shared.localhost:${location.port}/resources/tz.json`;
    let response = await fetch(url);
    let json = await response.json();

    let container = document.getElementById("datetime-timezone-details");
    for (let region in json) {
      this.log(region);
      let list = document.createElement("sl-details");
      list.setAttribute("summary", region);

      let menu = document.createElement("sl-menu");
      menu.addEventListener("sl-select", this.selectTimezone.bind(this));
      list.append(menu);

      let cities = json[region];
      cities.forEach((city) => {
        let item = document.createElement("sl-menu-item");
        let offset = city.offset.split(","); // [utcOffset, dstOffset]
        item.textContent =
          (city["name"] || city.city.replace(/_/g, " ")) + " " + offset[0];
        item.timezone = city.id || `${region}/${city.city}`;
        menu.append(item);
      });

      container.append(list);
    }

    this.timezonesLoaded = true;
  }

  async init() {
    if (this.ready) {
      return;
    }

    let clockSwitch = new SwitchAndSetting(
      document.getElementById("datetime-clock-switch"),
      "time.clock.automatic-update.enabled"
    );
    clockSwitch.addEventListener("change", this.updateClock.bind(this));
    await clockSwitch.init();

    let timezoneSwitch = new SwitchAndSetting(
      document.getElementById("datetime-timezone-switch"),
      "time.timezone.automatic-update.enabled"
    );
    timezoneSwitch.addEventListener("change", this.updateTimezone.bind(this));
    await timezoneSwitch.init();

    let input = document.getElementById("datetime-clock-input");
    let clockButton = document.getElementById("datetime-clock-set");
    clockButton.addEventListener("click", async () => {
      this.log(`clock value is ${input.value}`);
      this.log(`asDate: ${input.valueAsDate}`);
      let service = await this.ensureTimeService();
      try {
        await service.set(input.valueAsDate);
        let alert = this.getSuccessClockToast();
        alert.toast();
      } catch (e) {
        this.error(`Failed to set time: ${e}`);
        let alert = this.getErrorClockToast();
        alert.toast();
      }
    });

    let currentTime = document.getElementById("datetime-clock-current");
    currentTime.textContent = new Date().toLocaleString();
    window.setInterval(() => {
      currentTime.textContent = new Date().toLocaleString();
    }, 5000);

    this.ready = true;
  }
}

const datetimePanel = new DatetimePanel();
