// Web Extensions panel management module.

class AppItem extends HTMLElement {
  constructor(app) {
    super();
    this.app = app;
    this.icon =
      typeof app.icon == "string" ||
      Object.getPrototypeOf(app.icon) === URL.prototype
        ? app.icon
        : URL.createObjectURL(app.icon);
  }

  connectedCallback() {
    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <link rel="stylesheet" href="style/app_item.css">
      <img class="icon"/>
      <div class="namedesc">
        <div class="name"></div>
        <div class="desc"></div>
      </div>
      <sl-button slot="suffix" circle><sl-icon name="trash-2" ></sl-icon></sl-button>
    `;

    shadow.querySelector("img").src = this.icon;
    shadow.querySelector(".name").textContent = this.app.title;
    shadow.querySelector(".desc").textContent = this.app.description;

    document.l10n.translateFragment(shadow);

    let button = shadow.querySelector("sl-button");
    if (this.app.removable) {
      button.onclick = async () => {
        await window.appsManager.uninstall(this.app.app);
      };
    } else {
      button.remove();
    }
  }

  disconnectedCallback() {
    if (this.icon.startsWith("blob")) {
      URL.revokeObjectURL(this.icon);
    }
  }
}

customElements.define("app-item", AppItem);

class AppsPanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("apps-panel");
    this.panel.addEventListener("panel-ready", this, { once: true });

    window.appsManager.addEventListener("app-installed", this);
    window.appsManager.addEventListener("app-uninstalled", this);
  }

  log(msg) {
    console.log(`AppsPanel: ${msg}`);
  }

  error(msg) {
    console.error(`AppsPanel: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "app-installed" || event.type === "app-uninstalled") {
      // Simplistic implementation: recreate the whole list.
      this.createAppList(true);
    } else if (event.type === "panel-ready") {
      this.init();
    } else {
      this.error(`Unexpected event: ${event.type}`);
    }
  }

  async createAppList(clearFirst = false) {
    if (clearFirst) {
      this.appsMenu.innerHTML = "";
      this.tilesMenu.innerHTML = "";
    }
    try {
      let apps = await window.appsManager.getAll();
      let hasApps = false;
      let hasTiles = false;
      for (let app of apps) {
        let summary = await window.appsManager.getSummary(app);
        let li = document.createElement("li");
        li.append(new AppItem(summary));
        if (summary.updateUrl.protocol === "tile:") {
          this.tilesMenu.append(li);
          hasTiles = true;
        } else {
          this.appsMenu.append(li);
          hasApps = true;
        }
      }

      if (hasTiles) {
        this.tilesMenu.parentElement.classList.remove("hidden");
      } else {
        this.tilesMenu.parentElement.classList.add("hidden");
      }

      if (hasApps) {
        this.appsMenu.parentElement.classList.remove("hidden");
      } else {
        this.appsMenu.parentElement.classList.add("hidden");
      }
    } catch (e) {
      this.error(`Failed to fetch app list: ${e}`);
    }
  }

  async init() {
    this.log(`init`);
    if (this.ready) {
      return;
    }

    this.ready = true;

    this.appsMenu = this.panel.querySelector(".apps-section ul");
    this.tilesMenu = this.panel.querySelector(".tiles-section ul");

    this.createAppList();
  }
}

const appsPanel = new AppsPanel();
