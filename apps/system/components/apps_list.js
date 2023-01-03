// Components used for the apps list view.
// The <action-bookmark> custom element.

// Similar component to the homescreen's ActionBookmark.
class AppIcon extends HTMLElement {
  constructor(data) {
    super();
    this.init(data);
  }

  // data = { icon, title, url }
  init(data) {
    this.data = data;
    this.icon =
      typeof data.icon == "string" ||
      Object.getPrototypeOf(data.icon) === URL.prototype
        ? data.icon
        : URL.createObjectURL(data.icon);
  }

  connectedCallback() {
    let data = this.data;
    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <link rel="stylesheet" href="components/app_icon.css">
      <img src="${this.icon}" alt="${data.title}"></img>
      <span>${data.title}</span>
      `;

    this.onclick = () => {
      this.dispatchEvent(new CustomEvent("open-bookmark", { bubbles: true }));
      let details = {
        title: data.title,
        icon: this.icon,
        backgroundColor: data.backgroundColor,
      };

      window.wm.openFrame(data.url, {
        activate: true,
        details,
      });
    };
  }

  disconnectedCallback() {
    if (this.icon.startsWith("blob")) {
      URL.revokeObjectURL(this.icon);
    }
  }
}

customElements.define("app-icon", AppIcon);

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
    // Hide the homescreen.
    window.wm.homescreenFrame().style.opacity = 0;
    this.focus();
    embedder.addSystemEventListener("keypress", this, true);
  }

  close() {
    embedder.removeSystemEventListener("keypress", this, true);
    this.closeContextMenu();
    this.classList.remove("open");
    // Show the homescreen.
    window.wm.homescreenFrame().style.opacity = 1;
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
      case "keypress":
        if (event.key === "Escape") {
          this.close();
        }
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
        let node = new AppIcon(summary);
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
    menu.classList.add("hidden");

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

    let showContextMenu = false;
    this.contextMenuOpen = false;

    if (!menu.app.removable) {
      menu.querySelector("#uninstall-option").classList.add("hidden");
    } else {
      menu.querySelector("#uninstall-option").classList.remove("hidden");
      showContextMenu = true;
    }

    window.XacHomescreen.isAppInHomescreen(menu.app.manifestUrl.href).then(
      (result) => {
        if (result) {
          menu.querySelector("#add-to-home-option").classList.add("hidden");
        } else {
          menu.querySelector("#add-to-home-option").classList.remove("hidden");
          showContextMenu = true;
        }

        if (showContextMenu) {
          menu.classList.remove("hidden");

          // Intercept pointerdown on the main container.
          let container = this.shadowRoot.querySelector(".container");
          container.addEventListener("click", this.contextMenuHandler, {
            capture: true,
          });

          this.contextMenuOpen = true;
        }
      }
    );
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

    let menu = this.shadowRoot.querySelector(".menu");
    let activity = new WebActivity("add-to-home", { app: menu.app });
    await activity.start();

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
