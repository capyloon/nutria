// Represents a <site-info> dialog.

class SiteInfo extends HTMLElement {
  constructor() {
    super();

    this.tosdrData = null;

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    <link rel="stylesheet" href="components/site_info.css">
    <link rel="stylesheet" href="http://shared.localhost:${window.config.port}/style/elements.css"/>
    <h4 id="url-box">
      <img class="favicon">
      <div>
        <div class="title"></div>
        <div class="url"></div>
      </div>
    </h4>
    
    <div class="utils">
      <button class="add-home hidden slim" data-l10n-id="site-info-add-home"></button>
      <button class="split-screen slim" data-l10n-id="site-info-split-screen"></button>
      <lucide-icon kind="file-text" class="reader-mode hidden slim"></lucide-icon>
      <span class="flex-fill"></span>
    </div>
    <div class="utils">
      <img class="tosdr-img"/>
      <span class="flex-fill"></span>
    </div>
    <div class="utils ua-chooser">
      <span data-l10n-id="site-info-choose-ua"></span>
      <!-- TODO: Fix styling to use <label> instead of <span> -->
      <input type="radio" id="ua-1" name="ua-chooser" value="b2g" checked>
      <span for="ua-1" data-l10n-id="site-info-b2g-ua"></span>

      <input type="radio" id="ua-2" name="ua-chooser" value="android">
      <span for="ua-2" data-l10n-id="site-info-android-ua"></span>

      <input type="radio" id="ua-3" name="ua-chooser" value="desktop">
      <span for="ua-3" data-l10n-id="site-info-desktop-ua"></span>

      <span class="flex-fill"></span>
    </div>
    <div class="utils">
      <lucide-icon class="nav-reload" kind="refresh-cw"></lucide-icon>
      <lucide-icon class="nav-back" kind="chevron-left"></lucide-icon>
      <lucide-icon class="nav-forward" kind="chevron-right"></lucide-icon>
      <span class="flex-fill"></span>
      <lucide-icon class="zoom-out" kind="zoom-out"></lucide-icon>
      <span class="zoom-level">100%</span>
      <lucide-icon class="zoom-in" kind="zoom-in"></lucide-icon>
    </div>
    `;

    document.l10n.translateFragment(shadow);

    this.tosdrImg = shadow.querySelector(".tosdr-img");

    this.addEventListener("click", (event) => {
      // Prevent clicks to reach the backdrop and close the panel.
      // TODO: should likely be the default and managed by the backdrop itself?
      event.stopPropagation();
    });

    shadow.querySelector("#url-box").onclick = (event) => {
      this.close();
      actionsDispatcher.dispatch("open-url-editor", this.state.url);
    };

    let uaChooser = shadow.querySelector(".ua-chooser");
    uaChooser.onchange = (event) => {
      console.log(`Switching UA to ${event.target.value}`);
      this.dispatchEvent(
        new CustomEvent("change-ua", { detail: event.target.value })
      );
    };

    this.readerMode = shadow.querySelector("lucide-icon.reader-mode");
    this.zoomLevel = shadow.querySelector(".zoom-level");

    this.stateUpdater = this.updateState.bind(this);
  }

  close() {
    actionsDispatcher.removeListener("update-page-state", this.stateUpdater);

    this.dispatchEvent(new CustomEvent("close"));
    backdropManager.hide("site-info");
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

  updateState(_name, state) {
    // console.log(`SiteInfo::updateState() ${JSON.stringify(state)}`);
    this.state = state;

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
      this.state.iconUrl || window.config.brandLogo;

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

    this.shadowRoot.querySelector("button.split-screen").hidden =
      state.splitScreen || embedder.sessionType === "mobile";

    this.updateTosdr();
  }

  open() {
    // Check the context menu data to decide which sections to show.
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

    this.shadowRoot.querySelector("button.split-screen").onclick = () => {
      this.close();
      actionsDispatcher.dispatch("frame-split-screen");
    };

    let button = this.shadowRoot.querySelector("button.add-home");
    button.classList.remove("hidden");
    button.onclick = async (event) => {
      event.stopPropagation();
      this.addToHome();
      this.close();
    };

    this.readerMode.onclick = () => {
      this.dispatchEvent(new Event("toggle-reader-mode"));
      this.close();
    };

    backdropManager.show("site-info", true);
  }

  async addToHome() {
    let activityData = null;

    if (this.state.manifestUrl !== "") {
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
          window.toaster.show(msg);
          console.log(
            `SiteInfo: PWA installation success for this.state.manifestUrl: ${appObject}`
          );
        } catch (e) {
          let msg = await window.utils.l10n("error-add-to-home");
          window.toaster.show(msg, "error");
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
        window.toaster.show(msg);
      },
      async (error) => {
        console.log(`SiteInfo: activity error is ${error}`);
        let msg = await window.utils.l10n("error-add-to-home");
        window.toaster.show(`${msg}: ${error}`, "error");
      }
    );
  }

  setState(state) {
    // console.log(`SiteInfo::setState() ${JSON.stringify(state)}`);
    this.updateState(null, state);
  }
}

customElements.define("site-info", SiteInfo);
