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
    let input = document.getElementById("dweb-w3storage-key");
    const settingsKey = "ipfs.w3storage.api-token";

    input.addEventListener("sl-input", async () => {
      //   this.log(`w3.storage token: ${input.value}`);
      let setting = { name: settingsKey, value: input.value.trim() };
      await this.settings.set([setting]);
      //   this.log(`w3.storage setting ${settingsKey} updated to '${setting.value}'`);
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

  async initDid() {
    let dweb = await apiDaemon.getDwebService();
    let dids = await dweb.getDids();
    let list = document.getElementById("dweb-p2p-dids");
    dids.forEach((did) => {
      if (did.name === "superuser") {
        return;
      }
      let item = document.createElement("sl-option");
      item.setAttribute("value", did.uri);
      item.textContent = did.name;
      list.append(item);
    });
    try {
      let current = await this.settings.get("p2p.user.did");
      list.setAttribute("value", current.value);
    } catch (e) {}
    list.addEventListener("sl-change", async () => {
      await this.settings.set([{ name: "p2p.user.did", value: list.value }]);
    });
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

    await this.initDid();

    this.ready = true;
  }
}

const dwebPanel = new DwebPanel();
