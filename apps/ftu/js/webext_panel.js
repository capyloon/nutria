// Web Extensions panel management module.

// TODO: use a setting
const COLLECTION_URL =
  "https://addons.mozilla.org/api/v5/accounts/account/6202664/collections/Capyloon-Recommended/?with_addons";

// Encapsulates lifecycle and state management of an addon.
class Addon {
  // The addon parameter is an individual 'addon' from the full list.
  constructor(addon, button) {
    this.addon = addon;
    this.button = button;

    this.button.addEventListener("click", this);
    this.canInstall = true;
    this.updateState();
  }

  log(msg) {
    console.log(`Addon: ${msg}`);
  }

  async updateState() {
    this.log(`Setting state for addon ${this.addon.guid}`);
    let icon = this.button.querySelector("sl-icon");
    let obj = null;
    try {
      obj = await navigator.mozAddonManager.getAddonByID(this.addon.guid);
    } catch (e) {}
    if (obj) {
      icon.setAttribute("name", "trash-2");
      this.canInstall = false;
      this.button.parentElement.checked = true;
    } else {
      icon.setAttribute("name", "plus");
      this.canInstall = true;
      this.button.parentElement.checked = false;
    }
    this.button.loading = false;
  }

  async install() {
    const addonManager = navigator.mozAddonManager;
    let file = this.addon.current_version.file;
    let addonInstall = await addonManager.createInstall({
      url: file.url,
      hash: file.hash,
    });
    addonManager.addEventListener("onInstalled", this);
    this.button.loading = true;
    addonInstall.install();
  }

  async remove() {
    const addonManager = navigator.mozAddonManager;
    let installed = await addonManager.getAddonByID(this.addon.guid);
    addonManager.addEventListener("onUninstalled", this);
    this.button.loading = true;
    installed.uninstall();
  }

  handleEvent(event) {
    let eType = event.type;
    if (eType == "click") {
      if (this.canInstall) {
        this.install();
      } else {
        this.remove();
      }
    } else {
      let addonId = event.id;
      if (addonId != this.addon.guid) {
        // The event target another addon.
        return;
      }
      this.log(`Addon Event: ${eType} for ${addonId}`);
      if (["onInstalled", "onUninstalled"].includes(eType)) {
        navigator.mozAddonManager.removeEventListener(eType, this);
        this.updateState();
      } else {
        this.log(`Unexpected event: ${eType}`);
      }
    }
  }
}

class WebextPanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("webext-panel");
    this.panel.addEventListener("panel-ready", this, { once: true });
    this.addonActions = new Map(); // map addon id -> button to update state based on events.
  }

  log(msg) {
    console.log(`WebextPanel: ${msg}`);
  }

  error(msg) {
    console.error(`WebextPanel: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "panel-ready") {
      this.init();
    } else {
      this.error(`Unexpected event: ${event.type}`);
    }
  }

  async createExtList() {
    try {
      let response = await fetch(COLLECTION_URL);
      let json = await response.json();
      let addons = json.addons;
      this.log(`Found ${addons.length} addons`);
      addons.forEach((item) => {
        let addon = item.addon;
        let locale = addon.default_locale;
        let menuItem = document.createElement("sl-menu-item");

        menuItem.innerHTML = `<div class="name"></div>
        <div class="desc">${addon.description[locale].substring(0, 80)}</div>
        <img src="${addon.icon_url}" slot="prefix"/>
        <sl-button slot="suffix" circle><sl-icon></sl-icon></sl-button>`;

        menuItem.querySelector(".name").textContent = addon.name[locale];

        menuItem.data = new Addon(addon, menuItem.querySelector("sl-button"));
        this.menu.append(menuItem);
      });
    } catch (e) {
      this.error(`Failed to fetch extension list: ${e}`);
    }
  }

  setupAlertBox() {
    // Show or hide the alert box depending on the online state.
    window.addEventListener("online", () => {
      this.alert.hide();
      this.menu.querySelectorAll("sl-menu-item sl-button").forEach((item) => {
        item.disabled = false;
      });
    });

    window.addEventListener("offline", () => {
      this.alert.show();
      this.menu.querySelectorAll("sl-menu-item sl-button").forEach((item) => {
        item.disabled = true;
      });
    });

    if (!navigator.onLine) {
      this.alert.show();
      this.menu.querySelectorAll("sl-menu-item sl-button").forEach((item) => {
        item.disabled = true;
      });
    }
  }

  async init() {
    this.log(`init ready=${this.ready}`);

    this.alert = this.panel.querySelector("sl-alert");
    this.okBtn = this.panel.querySelector(".panel-ok");
    this.menu = this.panel.querySelector("sl-menu");

    if (navigator.onLine) {
      this.createExtList();
    } else {
      // Wait for the first "online" event to fetch the list.
      window.addEventListener(
        "online",
        () => {
          this.createExtList();
        },
        { once: true }
      );
    }

    this.setupAlertBox();
  }
}

const searchPanel = new WebextPanel();
