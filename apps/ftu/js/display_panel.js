// Display panel management module.

class DisplayPanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("display-panel");
    this.ready = false;
    this.panel.addEventListener("sl-after-show", this);
  }

  log(msg) {
    console.log(`DisplayPanel: ${msg}`);
  }

  error(msg) {
    console.error(`DisplayPanel: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "sl-after-show") {
      this.init();
    } else if (event.type === "sl-change") {
      this.updateChoice(event.target);
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
    if (item.checked) {
      await gDepGraph.waitForDeps("shoelace-dark-theme");
      document.documentElement.classList.add("sl-theme-dark");
    } else {
      document.documentElement.classList.remove("sl-theme-dark");
    }
  }

  async init() {
    if (this.ready) {
      return;
    }

    // The ui.prefers.color-scheme is set to "dark" when prefering a dark theme, any
    // other value select a light theme.
    let settings = await apiDaemon.getSettings();
    let isDarkMode = false;
    try {
      let result = await settings.get("ui.prefers.color-scheme");
      isDarkMode = result.value === "dark";
    } catch (e) {}

    let modeSwitch = this.panel.querySelector("sl-switch");
    modeSwitch.checked = isDarkMode;
    modeSwitch.addEventListener("sl-change", this);

    this.ready = true;
  }
}

const displayPanel = new DisplayPanel();
