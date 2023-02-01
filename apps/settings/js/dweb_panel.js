// Dweb panel management module.

class DwebPanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("dweb-panel");
    this.ready = false;
    this.panel.addEventListener("panel-ready", this);
  }

  log(msg) {
    console.log(`DwebPanel: ${msg}`);
  }

  error(msg) {
    console.error(`DwebPanel: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "panel-ready") {
      this.init();
    }
  }

  async manageEstuary() {
    let input = document.getElementById("dweb-estuary-key");
    const settingsKey = "ipfs.estuary.api-token";

    input.addEventListener("sl-input", async () => {
      //   this.log(`Estuary token: ${input.value}`);
      let setting = { name: settingsKey, value: input.value.trim() };
      await this.settings.set([setting]);
      //   this.log(`Estuary setting ${settingsKey} updated to '${setting.value}'`);
    });

    try {
      let setting = await this.settings.get(settingsKey);
      input.value = setting.value;
    } catch (e) {}
  }

  async addSwitchBinding(id, name, handler) {
    let binding = new SwitchAndSetting(
      document.getElementById(`dweb-p2p-${id}-switch`),
      name
    );
    binding.addEventListener("change", handler.bind(this));
    await binding.init();
  }

  // Disable the "local only" switch when the discovery is globally disabled.
  p2pDiscovery(event) {
    let enabled = event.detail.value;
    this.log(`p2pDiscovery -> ${enabled}`);

    let remoteSwitch = document.getElementById("dweb-p2p-remote-switch");
    remoteSwitch.disabled = !enabled;
  }

  async init() {
    if (this.ready) {
      return;
    }

    this.settings = await apiDaemon.getSettings();
    await this.manageEstuary();

    await this.addSwitchBinding(
      "discovery",
      "p2p.discovery.enabled",
      this.p2pDiscovery
    );

    await this.addSwitchBinding("remote", "p2p.discovery.local-only", () => {});

    this.ready = true;
  }
}

const dwebPanel = new DwebPanel();
