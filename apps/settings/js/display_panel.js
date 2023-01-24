// Display panel management module.

class DisplayPanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("display-panel");
    this.ready = false;
    this.panel.addEventListener("panel-ready", this);
    this.homescreen = null;
  }

  log(msg) {
    console.log(`DisplayPanel: ${msg}`);
  }

  error(msg) {
    console.error(`DisplayPanel: ${msg}`);
  }

  async handleEvent(event) {
    if (event.type === "panel-ready") {
      this.init();
    } else if (event.type === "sl-change") {
      this.updateChoice(event.target);
    } else if (event.type === "sl-select") {
      console.log(`nutria.theme ${event.target.getAttribute("id")}`);
      let kind = event.target.getAttribute("id");

      if (kind == "homescreens") {
        if (this.homescreen === event.detail.item) {
          this.homescreen.checked = true;
          return;
        }
        // Uncheck the "old" menu item.
        this.homescreen?.removeAttribute("checked");
        this.homescreen = event.detail.item;
        // Set the new settings value.
        let setting = {
          name: "homescreen.manifestUrl",
          value: this.homescreen.app.manifestUrl.href,
        };
        await this.settings.set([setting]);
      } else if (kind == "themes") {
        if (this.theme === event.detail.item) {
          this.theme.checked = true;
          return;
        }
        // Uncheck the "old" menu item.
        this.theme?.removeAttribute("checked");
        this.theme = event.detail.item;
        // Set the new settings value.
        console.log(`nutria.theme: will switch to ${event.detail.item.dataset.theme}`);
        let setting = {
          name: "nutria.theme",
          value: event.detail.item.dataset.theme,
        };
        await this.settings.set([setting]);
      }
    }
  }

  async updateChoice(item) {
    this.log(`dark mode = ${item.checked}`);
    let settings = await apiDaemon.getSettings();
    await settings.set([
      {
        name: "ui.prefers.color-scheme",
        value: item.checked ? "dark" : "light",
      },
    ]);
  }

  async init() {
    if (this.ready) {
      return;
    }

    // The ui.prefers.color-scheme is set to "dark" when prefering a dark theme, any
    // other value select a light theme.
    this.settings = await apiDaemon.getSettings();
    let isDarkMode = false;
    try {
      let result = await this.settings.get("ui.prefers.color-scheme");
      isDarkMode = result.value === "dark";
    } catch (e) {}

    let modeSwitch = this.panel.querySelector("sl-switch");
    modeSwitch.checked = isDarkMode;
    modeSwitch.addEventListener("sl-change", this);

    // Get the manifest url of the current homescreen from the setting.
    let port = location.port != 80 ? `:${location.port}` : "";
    let homescreenUrl = `http://homescreen.localhost${port}/manifest.webmanifest`;
    try {
      let result = await this.settings.get("homescreen.manifestUrl");
      homescreenUrl = result.value.replace("$PORT", port);
    } catch (e) {}

    // Get the manifest url of the current theme from the setting.
    let themeUrl;
    try {
      let result = await this.settings.get("nutria.theme");
      themeUrl = `http://${result.value}.localhost${port}/manifest.webmanifest`;
    } catch (e) {}

    // Get the list of homescreen and theme apps and populate the menus.
    let homescreens = document.getElementById("homescreens");
    let themes = document.getElementById("themes");

    let appsManager = await apiDaemon.getAppsManager();
    let apps = await appsManager.getAll();
    for (let app of apps) {
      // Fetch the manifest to check if the app role is "homescreen"
      let response = await fetch(app.manifestUrl);
      let manifest = await response.json();
      if (manifest.b2g_features?.role === "homescreen") {
        let item = document.createElement("sl-menu-item");
        item.setAttribute("type", "checkbox");
        item.textContent = manifest.description || manifest.name;
        item.app = app;
        if (homescreenUrl === app.manifestUrl.href) {
          item.setAttribute("checked", "true");
          this.homescreen = item;
        }
        homescreens.append(item);
      } else if (manifest.b2g_features?.role === "theme") {
        let item = document.createElement("sl-menu-item");
        item.setAttribute("type", "checkbox");
        item.textContent = manifest.description || manifest.name;
        item.dataset.theme = app.manifestUrl.host.split(".")[0];
        if (themeUrl === app.manifestUrl.href) {
          item.setAttribute("checked", "true");
          this.theme = item;
        }
        themes.append(item);
      }
    }
    homescreens.addEventListener("sl-select", this);
    themes.addEventListener("sl-select", this);

    this.ready = true;
  }
}

const displayPanel = new DisplayPanel();
