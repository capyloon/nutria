// Web Extensions panel management module.

class WebExtension extends HTMLElement {
  constructor(addon) {
    super();
    this.addon = addon;
  }

  connectedCallback() {
    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <link rel="stylesheet" href="style/web_extension.css">
      <sl-switch></sl-switch>
      <img class="icon"/>
      <div class="namedesc">
        <div class="name"></div>
        <div class="desc"></div>
      </div>
      <sl-button slot="suffix" circle><sl-icon name="trash-2" ></sl-icon></sl-button>
    `;

    shadow.querySelector("img").src = URL.createObjectURL(this.addon.icon);
    shadow.querySelector(".name").textContent = this.addon.name;
    shadow.querySelector(".desc").textContent = this.addon.description;

    document.l10n.translateFragment(shadow);
    this.checkbox = shadow.querySelector("sl-switch");

    this.checkbox.addEventListener("sl-change", async () => {
      // log(`calling ${this.addon.id}.setEnabled(${this.checkbox.checked})`);
      await this.addon.setEnabled(this.checkbox.checked);

      // Refresh our state.
      this.addon = await navigator.mozAddonManager.getAddonByID(this.addon.id);
      this.updateUI();
    });

    shadow.querySelector("sl-button").onclick = async () => {
      await this.addon.uninstall();
    };

    this.updateUI();
  }

  handleEvent() {
    // Simplistic implementation: create the list from scratch when
    // an addon is installed or uninstalled.

  }

  updateUI() {
    console.log(`updateUI enabled=${this.addon.isEnabled}`);
    this.checkbox.checked = this.addon.isEnabled;
  }
}

customElements.define("web-extension", WebExtension);

class WebextPanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("webext-panel");
    this.panel.addEventListener("panel-ready", this, { once: true });
    this.addonActions = new Map(); // map addon id -> button to update state based on events.

    const addonManager = navigator.mozAddonManager;
    addonManager.addEventListener("onInstalled", this);
    addonManager.addEventListener("onUninstalled", this);
  }

  log(msg) {
    console.log(`WebextPanel: ${msg}`);
  }

  error(msg) {
    console.error(`WebextPanel: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "onInstalled" || event.type === "onUninstalled") {
      // Simplistic implementation: recreate the whole list.
      this.createExtList(true);
    }
    else if (event.type === "panel-ready") {
      this.init();
    } else {
      this.error(`Unexpected event: ${event.type}`);
    }
  }

  async createExtList(clearFirst = false) {
    if (clearFirst) {
      this.menu.innerHTML = "";
    }
    try {
      let addons = await navigator.mozAddonManager.getAllAddons();
      addons
        .filter((addon) => addon.type == "extension")
        .forEach((addon) => {
          let item = document.createElement("li");
          item.append(new WebExtension(addon));
          this.menu.append(item);
        });
    } catch (e) {
      this.error(`Failed to fetch extension list: ${e}`);
    }
  }

  async init() {
    this.log(`init ready=${this.ready}`);

    this.menu = this.panel.querySelector("ul");
    this.createExtList();
  }
}

const webextPanel = new WebextPanel();
