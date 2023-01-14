// Language panel management module.

class LanguagePanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("language-panel");
    this.ready = false;
    this.currentChoice = null;
    this.panel.addEventListener("panel-ready", this);
  }

  log(msg) {
    console.log(`LanguagePanel: ${msg}`);
  }

  error(msg) {
    console.error(`LanguagePanel: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "panel-ready") {
      this.init();
    } else if (event.type === "sl-select") {
      this.updateChoice(event.detail.item);
    } else {
      this.error(`Unexpected event: ${event.type}`);
    }
  }

  async updateChoice(item) {
    if (this.currentChoice) {
      this.currentChoice.checked = false;
    }
    this.currentChoice = item;
    this.currentChoice.checked = true;
    let settings = await apiDaemon.getSettings();
    await settings.set([{ name: "language.current", value: item.value }]);
  }

  async init() {
    if (this.ready) {
      return;
    }
    try {
      let settings = await apiDaemon.getSettings();
      let currentLanguage = navigator.language;
      try {
        let result = await settings.get("language.current");
        currentLanguage = result.value;
      } catch (e) {}

      let response = await fetch(
        `http://shared.localhost:${location.port}/resources/languages.json`
      );
      let list = await response.json();
      let menu = this.panel.querySelector("sl-menu");
      menu.addEventListener("sl-select", this);
      for (let lang in list) {
        let item = document.createElement("sl-menu-item");
        item.setAttribute("type", "checkbox");
        item.textContent = list[lang];
        menu.append(item);
        item.value = lang;
        if (lang === currentLanguage) {
          item.checked = true;
          this.currentChoice = item;
        }
      }
      this.log(`Current language is ${currentLanguage}`);
    } catch (e) {
      this.error(`failed to set current language: ${JSON.stringify(e)}`);
    }

    this.ready = true;
  }
}

const languagePanel = new LanguagePanel();
