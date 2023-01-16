// Represents a <site-info> dialog.

class SiteInfo extends HTMLElement {
  constructor() {
    super();

    this.tosdrData = null;

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    <link rel="stylesheet" href="components/site_info.css">
    <div class="container">
      <h4 id="url-box">
        <img class="favicon">
        <div>
          <div class="title"></div>
          <div class="url"></div>
        </div>
      </h4>
      <sl-divider></sl-divider>
      <div class="utils search">
        <sl-dropdown placement="top-start" hoist>
          <sl-button slot="trigger" caret></sl-button>
          <sl-menu>
          </sl-menu>
        </sl-dropdown>
        <span class="flex-fill"></span>
      </div>
      <div class="utils">
        <sl-button variant="neutral" size="small" class="add-home hidden">
          <img src="resources/pwalogo.svg" height="12px">
          <span data-l10n-id="site-info-add-home"></span>
        </sl-button>
        <sl-button variant="neutral" size="small" class="split-screen" data-l10n-id="site-info-split-screen"></sl-button>
        <sl-icon name="file-text" class="reader-mode hidden"></sl-icon>
        <span class="flex-fill"></span>
      </div>
      <div class="utils">
        <img class="tosdr-img"/>
        <span class="flex-fill"></span>
      </div>
      <div class="utils">
        <sl-select hoist size="small" class="ua-chooser">
          <span slot="label" data-l10n-id="site-info-choose-ua"></span>
          <sl-option value="b2g" data-l10n-id="site-info-b2g-ua"></sl-option>
          <sl-option value="android" data-l10n-id="site-info-android-ua"></sl-option>
          <sl-option value="desktop" data-l10n-id="site-info-desktop-ua"></sl-option>
        </sl-select>
        <span class="flex-fill"></span>
      </div>
      <div class="utils">
        <sl-icon class="nav-reload" name="refresh-cw"></sl-icon>
        <sl-icon class="nav-back" name="chevron-left"></sl-icon>
        <sl-icon class="nav-forward" name="chevron-right"></sl-icon>
        <span class="flex-fill"></span>
        <sl-icon class="zoom-out" name="zoom-out"></sl-icon>
        <span class="zoom-level">100%</span>
        <sl-icon class="zoom-in" name="zoom-in"></sl-icon>
      </div>
    </div>
    `;

    let l10nReady = document.l10n.translateFragment(shadow);

    this.tosdrImg = shadow.querySelector(".tosdr-img");

    this.addEventListener("click", (event) => {
      // Prevent clicks to reach the backdrop and close the panel.
      event.stopPropagation();
    });

    shadow.querySelector("#url-box").onclick = (event) => {
      this.close();
      actionsDispatcher.dispatch("open-url-editor", this.state.url);
    };

    let uaChooser = shadow.querySelector(".ua-chooser");

    l10nReady.then(() => {
      uaChooser.value = "b2g";
      uaChooser.addEventListener("sl-change", (event) => {
        // TODO: persist the UA changes.
        this.dispatchEvent(
          new CustomEvent("change-ua", { detail: event.target.value })
        );
      });
    });

    this.readerMode = shadow.querySelector("sl-icon.reader-mode");
    this.zoomLevel = shadow.querySelector(".zoom-level");

    this.searchSection = shadow.querySelector(".search");
    this.searchEngines = null;

    this.stateUpdater = this.updateState.bind(this);
    this.drawer = this.parentElement;
  }

  close() {
    actionsDispatcher.removeListener("update-page-state", this.stateUpdater);

    this.dispatchEvent(new CustomEvent("close"));
    this.drawer.hide();
  }

  async updateTosdr() {
    this.tosdrImg.classList.add("hidden");
    let lang = navigator.language.split("-")[0];
    if (this.tosdrData == null) {
      try {
        let url = `http://shared.localhost:${window.config.port}/resources/tosdr_org.json`;
        let data = await fetch(url);
        this.tosdrData = await data.json();
      } catch (e) {
        console.error(`Failed to read tosdr_org.json: ${e}`);
        this.tosdrImg.src = "https://shields.tosdr.org/${lang}_0.svg";
        return;
      }
    }

    let url = new URL(this.state.url);
    let domain = url.hostname;

    // For now, consider all local packaged apps as safe.
    if (domain.endsWith(".localhost")) {
      return;
    }

    let item = this.tosdrData[domain];
    if (!item) {
      // Look for a less specific subdomain.
      // For instance www.lemonde.fr is not in tosdr but lemonde.fr is.
      let parts = domain.split(".");
      do {
        parts.splice(0, 1);
        item = this.tosdrData[parts.join(".")];
      } while (!item && parts.length >= 2);
    }

    this.tosdrImg.classList.remove("hidden");
    this.tosdrImg.src = `https://shields.tosdr.org/${lang}_${
      item ? item.id : 0
    }.svg`;

    if (item) {
      this.tosdrImg.onclick = () => {
        this.close();
        window.wm.openFrame(`https://tosdr.org/${lang}/service/${item.id}`, {
          activate: true,
        });
      };
    } else {
      this.tosdrImg.onclick = null;
    }
  }

  async initSearchEngines() {
    if (this.searchEnginesReady) {
      return;
    }

    let menu = this.searchSection.querySelector("sl-menu");

    menu.addEventListener("sl-select", (event) => {
      let resource = event.detail.item.value;
      let desc = resource.variant("default").OpenSearchDescription;

      let urls = desc.Url;
      if (!Array.isArray(urls)) {
        urls = [urls];
      }
      let found = urls.find((item) => item._attributes.type == "text/html");
      if (!found) {
        return;
      }
      let template = found._attributes.template;
      let encoded = encodeURIComponent(this.state.search).replace(
        /[!'()*]/g,
        function (c) {
          return "%" + c.charCodeAt(0).toString(16);
        }
      );
      let url = template.replace("{searchTerms}", encoded);
      actionsDispatcher.dispatch("navigate-to", {
        url,
        search: this.state.search,
      });
      contentManager.visitPlace(url, true);
      this.close();
    });

    let openSearch = contentManager.getOpenSearchManager((items) => {
      menu.innerHTML = "";

      for (let item of items) {
        let json = item.variant("default").OpenSearchDescription;
        let menuItem = document.createElement("sl-menu-item");
        menuItem.value = item;
        menuItem.innerHTML = `<div class="name"></div>
        <img src="${item.variantUrl("icon")}" slot="prefix"/>`;

        menuItem.querySelector(".name").textContent =
          json.LongName?._text || json.ShortName?._text;

        menu.append(menuItem);
      }
    });
    await openSearch.init();
    this.searchEnginesReady = true;
  }

  async showSearchEngines() {
    let text = this.searchSection.querySelector("sl-button");

    let msg = await window.utils.l10n("site-info-search", {
      query: window.utils.truncateSearch(this.state.search),
    });
    text.textContent = msg;

    if (!this.searchEngines) {
      this.initSearchEngines();
    }

    this.searchSection.classList.remove("hidden");
  }

  async hideSearchEngines() {
    this.searchSection.classList.add("hidden");
  }

  updateState(_name, state) {
    // console.log(`SiteInfo::updateState() ${JSON.stringify(state)}`);
    this.state = state;

    if (state.search) {
      this.showSearchEngines();
    } else {
      this.hideSearchEngines();
    }

    // If this is an about:reader url, get the original uri.
    if (state.url.startsWith("about:reader?url=")) {
      let url = new URL(state.url);
      this.state.url = url.searchParams.get("url");
    }

    // Update the UI.
    this.zoomLevel.textContent = `${(this.state.zoom * 100).toFixed(0)}%`;
    this.shadowRoot.querySelector(".title").textContent = this.state.title;
    this.shadowRoot.querySelector(".url").textContent = this.state.url;
    this.shadowRoot.querySelector(".favicon").src =
      this.state.icon || window.config.brandLogo;

    let goForward = this.shadowRoot.querySelector(".nav-forward");
    if (this.state.canGoForward) {
      goForward.classList.remove("disabled");
    } else {
      goForward.classList.add("disabled");
    }

    let goBack = this.shadowRoot.querySelector(".nav-back");
    if (this.state.canGoBack) {
      goBack.classList.remove("disabled");
    } else {
      goBack.classList.add("disabled");
    }

    // Update ReaderMode state.
    let readerMode = state.readerMode;
    if (readerMode) {
      if (readerMode.isArticle || readerMode.isReaderMode) {
        this.readerMode.classList.remove("hidden");
      } else {
        this.readerMode.classList.add("hidden");
      }

      if (readerMode.isReaderMode) {
        this.readerMode.classList.add("active");
      } else {
        this.readerMode.classList.remove("active");
      }
    }

    let splitScreen = this.shadowRoot.querySelector("sl-button.split-screen");
    if (state.splitScreen || embedder.sessionType === "mobile") {
      splitScreen.classList.add("hidden");
    } else {
      splitScreen.classList.remove("hidden");
    }

    this.updateTosdr();
  }

  open() {
    if (!this.state) {
      return;
    }

    actionsDispatcher.addListener("update-page-state", this.stateUpdater);

    ["nav-back", "nav-forward", "nav-reload", "zoom-in", "zoom-out"].forEach(
      (name) => {
        this.shadowRoot.querySelector(`.${name}`).onclick = (event) => {
          event.stopPropagation();
          event.preventDefault();
          this.dispatchEvent(new Event(name));
        };
      }
    );

    this.shadowRoot.querySelector("sl-button.split-screen").onclick = () => {
      this.close();
      actionsDispatcher.dispatch("frame-split-screen");
    };

    let button = this.shadowRoot.querySelector("sl-button.add-home");
    button.classList.remove("hidden");
    let pwaLogo = this.shadowRoot.querySelector("sl-button.add-home img");
    if (this.state.manifestUrl && this.state.manifestUrl !== "") {
      pwaLogo.classList.remove("hidden");
    } else {
      pwaLogo.classList.add("hidden");
    }
    button.onclick = async (event) => {
      event.stopPropagation();
      this.addToHome();
      this.close();
    };

    this.readerMode.onclick = () => {
      this.dispatchEvent(new Event("toggle-reader-mode"));
      this.close();
    };

    this.drawer.show();
  }

  async addToHome() {
    let activityData = null;

    if (this.state.manifestUrl && this.state.manifestUrl !== "") {
      let service = await window.apiDaemon.getAppsManager();
      let app;
      try {
        // Check if the app is installed. getApp() expects the cached url, so instead
        // we need to get all apps and check their update url...
        let apps = await service.getAll();
        app = apps.find((app) => {
          return app.updateUrl == this.state.manifestUrl;
        });
      } catch (e) {}
      if (app) {
        // The app is already installed, we won't re-install it but only
        // add it to the homescreen.
        activityData = { app };
      } else {
        // Install the new app.
        try {
          let appObject = await service.installPwa(this.state.manifestUrl);
          let msg = await window.utils.l10n("success-add-to-home");
          window.toaster.show(msg, "success");
          console.log(
            `SiteInfo: PWA installation success for this.state.manifestUrl: ${appObject}`
          );
        } catch (e) {
          let msg = await window.utils.l10n("error-add-to-home");
          window.toaster.show(msg, "danger");
          console.error(
            `SiteInfo: Failed to install app: ${JSON.stringify(e)}`
          );
        }
        // All done when installing a new app.
        return;
      }
    } else {
      activityData = {
        siteInfo: this.state,
      };
    }

    console.log(
      `SiteInfo: about to call add-to-home activity for ${JSON.stringify(
        activityData
      )}`
    );
    let activity = new WebActivity("add-to-home", activityData);
    let start = Date.now();
    activity.start().then(
      async (result) => {
        console.log(
          `SiteInfo: activity result in ${
            Date.now() - start
          }ms is ${JSON.stringify(result)}`
        );
        let msg = await window.utils.l10n("success-add-to-home");
        window.toaster.show(msg, "success");
      },
      async (error) => {
        console.log(`SiteInfo: activity error is ${error}`);
        let msg = await window.utils.l10n("error-add-to-home");
        window.toaster.show(`${msg}: ${error}`, "danger");
      }
    );
  }

  setState(state) {
    // console.log(`SiteInfo::setState() ${JSON.stringify(state)}`);
    this.updateState(null, state);
  }
}

customElements.define("site-info", SiteInfo);
