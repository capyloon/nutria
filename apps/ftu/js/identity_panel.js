// Identity panel management module.

class IdentityPanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("identity-panel");
    this.ready = false;
    this.panel.addEventListener("panel-ready", this);
    this.enabled = 0;
  }

  log(msg) {
    console.log(`IdentityPanel: ${msg}`);
  }

  error(msg) {
    console.error(`IdentityPanel: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "panel-ready") {
      this.init();
    } else if (event.type === "click") {
      this.addDid();
    } else {
      this.error(`Unexpected event: ${event.type}`);
    }
  }

  async updateChoice(item) {
    this.log(`updateChoice ${item.value}`);
  }

  async addDid() {
    this.alert.hide();
    let input = this.panel.querySelector("sl-input");
    let name = input.value.trim();
    if (name.length === 0) {
      input.value = "";
      return;
    }

    try {
      let did = await this.dweb.createDid(name);
      // this.log(`DID created: ${JSON.stringify(did)}`);
      input.value = "";
    } catch (e) {
      this.alert.show();
    }
  }

  async updateList() {
    let list = await this.dweb.getDids();
    this.log(`Found ${list.length} DIDs`);

    this.menu.innerHTML = "";

    list = list.filter((did) => did.name !== "superuser");

    if (list.length === 0) {
      this.menu.innerHTML = `<sl-menu-item data-l10n-id="identity-empty" disabled></sl-menu-item>`;
      return;
    }

    // Sort the list by name.
    list.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    list.forEach((did) => {
      let menuItem = document.createElement("sl-menu-item");
      menuItem.innerHTML = `<div class="name"></div><div class="desc"></div>
        <sl-button slot="suffix" circle><sl-icon name="trash-2"></sl-icon></sl-button>`;

      menuItem.querySelector(".name").textContent = did.name;
      menuItem.querySelector(".desc").textContent = did.uri;
      menuItem.querySelector("sl-button").onclick = async () => {
        await this.dweb.removeDid(did.uri);
      };
      this.menu.append(menuItem);
    });
  }

  async manageDeviceName() {
    this.settings = await apiDaemon.getSettings();
    let input = document.getElementById("identity-device-desc");
    const settingsKey = "device.name";

    input.addEventListener("sl-input", async () => {
      let setting = { name: settingsKey, value: input.value.trim() };
      await this.settings.set([setting]);
    });

    try {
      let setting = await this.settings.get(settingsKey);
      input.value = setting.value;
    } catch (e) {}
  }

  async init() {
    this.log(`init ready=${this.ready}`);
    if (this.ready) {
      return;
    }

    this.alert = this.panel.querySelector("sl-alert");
    this.menu = this.panel.querySelector("sl-menu");

    let addButton = this.panel.querySelector("sl-button");
    addButton.addEventListener("click", this);

    this.dweb = await apiDaemon.getDwebService();

    [this.dweb.DIDCREATED_EVENT, this.dweb.DIDREMOVED_EVENT].forEach(
      (event) => {
        this.dweb.addEventListener(event, () => {
          this.updateList();
        });
      }
    );

    await this.manageDeviceName();
    await this.updateList();

    this.ready = true;
  }
}

const identityPanel = new IdentityPanel();
