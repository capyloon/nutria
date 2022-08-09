// Components used for the apps list view.
class AppsList extends LitElement {
  constructor() {
    super();

    this.apps = [];
    this.appsNodes = [];

    window.appsManager.getAll().then(async (apps) => {
      this.apps = apps;
      await this.buildAppsNodes();
    });
    window.appsManager.addEventListener("app-installed", this);
    window.appsManager.addEventListener("app-uninstalled", this);

    this.contextMenuOpen = false;
    this.contextMenuHandler = this.captureContextMenuEvent.bind(this);
  }

  static get properties() {
    return {
      appsNodes: { state: true },
    };
  }

  open() {
    this.classList.add("open");
    window["actions-panel"].classList.add("hide");
    window["search-panel"].classList.add("hide");
    this.focus();
  }

  close() {
    this.closeContextMenu();
    this.classList.remove("open");
    window["actions-panel"].classList.remove("hide");
    window["search-panel"].classList.remove("hide");
  }

  toggle() {
    if (this.classList.contains("open")) {
      this.close();
    } else {
      this.open();
    }
  }

  async handleEvent(event) {
    switch (event.type) {
      case "open-bookmark":
        this.close();
        break;
      case "contextmenu":
        // console.log(`AppsList: contextmenu ${event.target?.localName}`);
        event.preventDefault();
        this.openContextMenu(event, event.target.data);
        break;
      case "app-installed":
      case "app-uninstalled":
        await this.buildAppsNodes();
        break;
    }
  }

  async buildAppsNodes() {
    let appsNodes = [];
    for (let app of this.apps) {
      let summary = await window.appsManager.getSummary(app);
      if (
        !summary.role ||
        !["system", "homescreen", "input"].includes(summary.role)
      ) {
        let node = new ActionBookmark(summary);
        node.app = app;
        node.addEventListener("contextmenu", this);
        node.addEventListener("open-bookmark", this);
        appsNodes.push(node);
      }
    }
    this.appsNodes = appsNodes;
  }

  captureContextMenuEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.closeContextMenu();
  }

  openContextMenu(event, data) {
    let menu = this.shadowRoot.querySelector(".menu");
    menu.querySelector("h4").textContent = data.title;
    menu.classList.remove("hidden");

    // Position the context menu over the target icon.
    let targetRect = event.target.getBoundingClientRect();
    let menuRect = menu.getBoundingClientRect();
    let thisRect = this.getBoundingClientRect();

    let left =
      targetRect.x - thisRect.x + targetRect.width / 2 - menuRect.width / 2;
    let top = targetRect.y - thisRect.y + targetRect.height / 2;
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;

    menu.app = event.target.app;

    // console.log(menu.app);

    if (!menu.app.removable) {
      menu.querySelector("#uninstall-option").classList.add("hidden");
    } else {
      menu.querySelector("#uninstall-option").classList.remove("hidden");
    }

    let actionsWall = document.querySelector("actions-wall");
    if (actionsWall.store.getActionByManifestUrl(menu.app.manifestUrl)) {
      menu.querySelector("#add-to-home-option").classList.add("hidden");
    } else {
      menu.querySelector("#add-to-home-option").classList.remove("hidden");
    }

    // Intercept pointerdown on the main container.
    let container = this.shadowRoot.querySelector(".container");
    container.addEventListener("click", this.contextMenuHandler, {
      capture: true,
    });

    this.contextMenuOpen = true;
  }

  closeContextMenu() {
    if (!this.contextMenuOpen) {
      return;
    }

    let container = this.shadowRoot.querySelector(".container");
    container.removeEventListener("click", this.contextMenuHandler, {
      capture: true,
    });

    let menu = this.shadowRoot.querySelector(".menu");
    menu.classList.add("hidden");
    this.contextMenuOpen = false;
  }

  async addToHome() {
    if (!this.contextMenuOpen) {
      return;
    }

    let actionsWall = document.querySelector("actions-wall");
    let menu = this.shadowRoot.querySelector(".menu");
    await actionsWall.addAppAction(menu.app);

    this.closeContextMenu();
  }

  async uninstall() {
    if (!this.contextMenuOpen) {
      return;
    }

    let menu = this.shadowRoot.querySelector(".menu");
    await window.appsManager.uninstall(menu.app.manifestUrl);

    this.closeContextMenu();
  }

  updated() {
    document.l10n.translateFragment(this.shadowRoot);
  }

  render() {
    // console.log(`AppsList: ${this.apps.length} apps`);

    return html`<link rel="stylesheet" href="components/apps_list.css" />
      <div class="container">${this.appsNodes}</div>
      <div class="menu hidden">
        <h4>My app</h4>
        <ul>
          <li @click="${this.addToHome}" id="add-to-home-option">
            <sl-icon name="home"></sl-icon>
            <span data-l10n-id="apps-list-add-home"></span>
          </li>
          <li @click="${this.uninstall}" id="uninstall-option">
            <sl-icon name="trash-2"></sl-icon>
            <span data-l10n-id="apps-list-uninstall"></span>
          </li>
        </ul>
      </div>`;
  }
}

customElements.define("apps-list", AppsList);
