// Privacy panel management module.

class PrivacyPanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("privacy-panel");
    this.ready = false;
    this.panel.addEventListener("panel-ready", this);
  }

  log(msg) {
    console.log(`PrivacyPanel: ${msg}`);
  }

  error(msg) {
    console.error(`PrivacyPanel: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "panel-ready") {
      this.init();
    }
  }

  updateGeoloc(event) {
    this.log(`updateGeoloc -> ${event.detail.value}`);
    let icon = document.getElementById("privacy-geolocation-icon");
    icon.name = event.detail.value ? "locate" : "locate-off";
  }

  updateTor(event) {
    this.log(`updateTor -> ${event.detail.value}`);
    let icon = document.getElementById("privacy-tor-icon");
    icon.src = `http://shared.localhost:${location.port}/resources/tor.ico`;
    if (event.detail.value) {
      icon.classList.remove("disabled");
    } else {
      icon.classList.add("disabled");
    }
  }

  updateTp(event) {
    this.log(`updateTp -> ${event.detail.value}`);
    let icon = document.getElementById("privacy-tp-icon");
    icon.name = event.detail.value ? "shield" : "shield-off";
  }

  updateGpc(event) {
    this.log(`updateGpc -> ${event.detail.value}`);
    let icon = document.getElementById("privacy-gpc-icon");
    icon.name = event.detail.value ? "shield" : "shield-off";
  }

  async addSwitchBinding(id, name, handler) {
    let binding = new SwitchAndSetting(
      document.getElementById(`privacy-${id}-switch`),
      name
    );
    binding.addEventListener("change", handler.bind(this));
    await binding.init();
  }

  async init() {
    if (this.ready) {
      return;
    }

    await this.addSwitchBinding(
      "geolocation",
      "geolocation.enabled",
      this.updateGeoloc
    );
    await this.addSwitchBinding("tor", "tor.enabled", this.updateTor);
    await this.addSwitchBinding(
      "tp",
      "privacy.trackingprotection.enabled",
      this.updateTp
    );
    await this.addSwitchBinding(
      "gpc",
      "privacy.globalprivacycontrol.enabled",
      this.updateGpc
    );

    this.ready = true;
  }
}

const privacyPanel = new PrivacyPanel();
