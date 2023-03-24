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

  // If a <li> node for that manifest url is found, remove it and
  // update the container state.
  maybeRemove(container, manifestUrl) {
    let items = container.querySelectorAll("li");
    items.forEach((item) => {
      if (item.dataset.manifestUrl == manifestUrl) {
        item.remove();
        if (!container.firstElementChild) {
          container.parentElement.classList.add("hidden");
        }
        return true;
      }
    });
    return false;
  }

  // Add an app or tile node, and update the visibility of its parent
  // container if required.
  async addApp(app, updateVisibility) {
    let summary = await window.appsManager.getSummary(app);
    let li = document.createElement("li");
    li.dataset.manifestUrl = summary.app;
    li.append(new AppItem(summary));
    if (summary.updateUrl.protocol === "tile:") {
      this.tilesMenu.append(li);
      updateVisibility &&
        this.tilesMenu.parentElement.classList.remove("hidden");
    } else {
      this.appsMenu.append(li);
      updateVisibility &&
        this.appsMenu.parentElement.classList.remove("hidden");
    }
  }

  handleEvent(event) {
    if (event.type === "app-uninstalled") {
      console.log(`ZZZZZZ ${event.type} ${event.detail}`);
      if (!this.maybeRemove(this.appsMenu, event.detail)) {
        this.maybeRemove(this.tilesMenu, event.detail);
      }
    } else if (event.type === "app-installed") {
      this.addApp(event.detail, true);
    } else if (event.type === "panel-ready") {
      this.init();
    } else {
      this.error(`Unexpected event: ${event.type}`);
    }
  }

  async createAppList() {
    this.tilesMenu.parentElement.classList.add("hidden");
    this.appsMenu.parentElement.classList.add("hidden");

    try {
      let apps = await window.appsManager.getAll();
      for (let app of apps) {
        await this.addApp(app);
      }
      [this.tilesMenu, this.appsMenu].forEach((container) => {
        container.firstElementChild &&
          container.parentElement.classList.remove("hidden");
      });
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
