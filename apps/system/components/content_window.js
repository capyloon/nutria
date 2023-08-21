// Manages a window loading some web content

// Duration of the display of navigation shortcut, in ms.
const kNavigationDisplayDuration = 1500;
// Duration of the app swipe lock when the page is being scrolled, in ms.
const kSwipeLockDuration = 500;

// Helper class to manager process priorities transitions.
class ProcessManager {
  constructor() {
    this.service = window.apiDaemon.getProcManager();
  }

  setForeground(pid) {
    if (pid == -1) {
      return;
    }
    console.log(`ProcessManager: setForeground ${pid}`);
    this.service.then((procmanager) => {
      let lib = window.apiDaemon.getLibraryFor("ProcManager");
      procmanager
        .begin("systemapp")
        .then(() => procmanager.add(pid, lib.GroupType.FOREGROUND))
        .then(() => procmanager.commit())
        .catch((error) => {
          console.error(
            `ProcessManager: Failed to switch ${pid} to foreground: ${error}`
          );
        });
    });
  }

  setBackground(pid, tryToKeep = false) {
    if (pid == -1) {
      return;
    }
    console.log(`ProcessManager: setBackground ${pid} keep=${tryToKeep}`);
    this.service.then((procmanager) => {
      let lib = window.apiDaemon.getLibraryFor("ProcManager");
      let backgroundType = tryToKeep
        ? lib.GroupType.TRY_TO_KEEP
        : lib.GroupType.BACKGROUND;
      procmanager
        .begin("systemapp")
        .then(() => procmanager.add(pid, backgroundType))
        .then(() => procmanager.commit())
        .catch((error) => {
          console.error(
            `ProcessManager: Failed to switch ${pid} to background: ${error}`
          );
        });
    });
  }

  remove(pid) {
    if (pid == -1) {
      return;
    }
    console.log(`ProcessManager: remove ${pid}`);
    this.service.then((procmanager) => {
      procmanager
        .begin("systemapp")
        .then(() => procmanager.remove(pid))
        .then(() => procmanager.commit())
        .catch((error) => {
          console.error(`ProcessManager: Failed to remove ${pid}: ${error}`);
        });
    });
  }

  moveToForeground(newFg, oldFg, tryToKeep) {
    this.service.then((procmanager) => {
      let lib = window.apiDaemon.getLibraryFor("ProcManager");
      let backgroundType = tryToKeep
        ? lib.GroupType.TRY_TO_KEEP
        : lib.GroupType.BACKGROUND;
      procmanager
        .begin("systemapp")
        .then(() => procmanager.add(newFg, lib.GroupType.FOREGROUND))
        .then(() => procmanager.add(oldFg, backgroundType))
        .then(() => procmanager.commit())
        .catch((error) => {
          console.error(
            `Failed to switch foreground / background app: ${error}`
          );
        });
    });
  }

  whenKilled(killedPid, newFg) {
    this.service.then((procmanager) => {
      let lib = window.lib_procmanager;
      procmanager
        .begin("systemapp")
        .then(() => procmanager.add(newFg, lib.GroupType.FOREGROUND))
        .then(() => procmanager.remove(killedPid))
        .then(() => procmanager.commit())
        .catch((error) => {
          console.error(`Failed to kill app: ${error}`);
        });
    });
  }
}

// Class helper to manage the permission request panel.
// TODO: Move to a self contained component.
//
// Example of geolocation request from Google Maps:
// {
//   requestAction:"prompt",
//   permissions: {
//     geolocation: {
//       action: "prompt",
//       options:[]
//     }
//   },
//   requestId: "permission-prompt-{79d5952e-6174-4475-8f5a-7fbd577241c3}",
//   origin:"https://www.google.com"
//  }

// Example of webrtc permission prompt from whereby.com:
// {
//   "requestAction": "prompt",
//   "permissions": {
//     "audio-capture": { "action": "prompt", "options": ["default"] },
//     "video-capture": { "action": "prompt", "options": ["front", "back"] }
//   },
//   "requestId": "permission-prompt-{88c6cb76-f250-4747-ad1b-8a06b906286a}",
//   "origin": "https://whereby.com"
// }
class PermissionsHelper {
  constructor(drawer, dispatcher) {
    this.drawer = drawer;
    this.dispatcher = dispatcher;
    this.list = drawer.querySelector(".items");
    this.origin = drawer.querySelector(".origin");
    this.btnAllow = drawer.querySelector("#permission-allow");
    this.btnBlock = drawer.querySelector("#permission-block");
    this.rememberMe = drawer.querySelector("#permission-remember");
    this.btnAllow.addEventListener("click", this);
    this.btnBlock.addEventListener("click", this);
    this.current = null;
  }

  dispatchResult(detail) {
    this.dispatcher.dispatchEvent(
      new CustomEvent(this.current.requestId, { detail })
    );
    this.cancel();
  }

  handleEvent(event) {
    if (!this.current) {
      console.error(`No current permission request!`);
      return;
    }

    let remember = this.rememberMe.checked;

    if (event.target === this.btnBlock) {
      let detail = {
        origin: this.current.origin,
        granted: false,
        remember,
        choices: {},
      };
      this.dispatchResult(detail);
    } else if (event.target === this.btnAllow) {
      let choices = {};
      for (let permName in this.current.permissions) {
        let permission = this.current.permissions[permName];
        if (permission.options.length > 0) {
          let selector = this.drawer.querySelector(
            `sl-select[perm=${permName}]`
          );
          choices[permName] = permission.options[selector.value];
        }
      }
      let detail = {
        origin: this.current.origin,
        granted: true,
        remember,
        choices,
      };
      // console.log(`Will dispatch ${JSON.stringify(detail)}`);
      this.dispatchResult(detail);
    }
  }

  iconFor(permName) {
    // Use the same icons as the status icons from status_icons.js
    let icons = {
      geolocation: "map-pin",
      "audio-capture": "mic",
      "video-capture": "video",
    };
    return icons[permName] || "help-circle";
  }

  prompt(data) {
    this.current = data;
    this.list.innerHTML = "";
    let origin = new URL(data.origin);
    this.origin.textContent = origin.hostname;

    for (let name in data.permissions) {
      let permission = data.permissions[name];

      let item = document.createElement("div");
      let icon = document.createElement("sl-icon");
      icon.setAttribute("name", this.iconFor(name));
      item.append(icon);
      if (permission.options.length == 0) {
        // When there are no options, just display an icon an the permission name.
        let text = document.createElement("span");
        text.setAttribute("data-l10n-id", `permissions-name-${name}`);
        item.append(text);
      } else {
        // Otherwise, use a dropdown selector.
        let dropdown = document.createElement("sl-select");
        dropdown.setAttribute("perm", name);
        dropdown.hoist = true;
        permission.options.forEach((option, index) => {
          let opt = document.createElement("sl-option");
          opt.value = `${index}`;
          opt.textContent = option;
          dropdown.append(opt);
        });
        dropdown.value = "0";
        item.append(dropdown);
      }
      this.list.append(item);
    }

    this.drawer.show();
  }

  cancel() {
    this.current = null;
    this.drawer.hide();
  }
}

class PromptHelper {
  constructor(container, detail) {
    this.drawer = container.querySelector(".modal-prompt");
    this.btnCancel = container.querySelector("#modal-prompt-btn-cancel");
    this.btnOk = container.querySelector("#modal-prompt-btn-ok");
    this.input = container.querySelector("#modal-prompt-input");

    this.input.value = "";
    container.querySelector("#modal-prompt-title").textContent = detail.title;
    container.querySelector("#modal-prompt-text").textContent = detail.text;

    // console.log(`detail=${JSON.stringify(detail)}`);

    // Show the relevant UI items based on the prompt type.
    if (detail.promptType === "alert" || detail.promptType === "alertCheck") {
      this.input.classList.add("hidden");
      this.btnCancel.classList.add("hidden");
    } else if (
      detail.promptType === "confirm" ||
      detail.promptType === "confirmCheck"
    ) {
      this.input.classList.add("hidden");
      this.btnCancel.classList.remove("hidden");
    } else {
      if (detail.value !== undefined) {
        this.input.value = detail.value;
      }
      this.input.classList.remove("hidden");
      this.btnCancel.classList.remove("hidden");
      this.input.focus();
    }

    this.drawer.addEventListener("sl-request-close", this);
    this.btnCancel.addEventListener("click", this);
    this.btnOk.addEventListener("click", this);

    this.drawer.show();
  }

  handleEvent(event) {
    if (!this.deferred) {
      return;
    }

    if (event.type === "sl-request-close" || event.target === this.btnCancel) {
      this.deferred({ ok: false });
    } else if (event.target === this.btnOk) {
      this.deferred({
        ok: true,
        value: this.input.value,
        // TODO: add checked support
      });
    }

    if (event.type !== "sl-request-close") {
      this.drawer.hide();
    }
  }

  done() {
    return new Promise((resolve) => {
      this.deferred = resolve;
    });
  }

  reset() {
    this.deferred = null;
    this.drawer.removeEventListener("sl-request-close", this);
    this.btnCancel.removeEventListener("click", this);
    this.btnOk.removeEventListener("click", this);
  }
}

window.processManager = new ProcessManager();

const kSiteInfoEvents = [
  "zoom-in",
  "zoom-out",
  "nav-back",
  "nav-forward",
  "nav-reload",
  "change-ua",
  "toggle-reader-mode",
];

class ContentWindow extends HTMLElement {
  constructor() {
    super();

    // Initial state used to sync the UI state with this web-view state.
    this.state = {
      url: "",
      title: "",
      secure: "insecure",
      icon: "",
      manifestUrl: null,
      iconSize: 0,
      canGoBack: false,
      canGoForward: false,
      isHomescreen: false,
      bringAttention: false,
    };

    // No configuration available yet.
    this.config = null;

    // By default, a new content window is not activated.
    this.activated = false;

    // Track the keyboard state, to re-open it if needed when switching back
    // to a frame with a focused element.
    this.keyboardOpen = false;

    this.screenshot = null;
  }

  addSiteInfoListeners() {
    let siteInfo = document.querySelector("site-info");
    kSiteInfoEvents.forEach((event) => siteInfo.addEventListener(event, this));
  }

  removeSiteInfoListeners() {
    let siteInfo = document.querySelector("site-info");
    kSiteInfoEvents.forEach((event) =>
      siteInfo.removeEventListener(event, this)
    );
  }

  setConfig(config) {
    this.config = config;
    this.state.id = config.id;
    this.state.isHomescreen = config.isHomescreen;
    this.state.fromLockscreen = config.fromLockscreen;
    this.state.whenClosed = config.whenClosed;
    this.state.display = config.details?.display;
    if (!config.isHomescreen) {
      this.classList.add("not-homescreen");
    }
  }

  disableContentBlocking(shouldReload = true) {
    try {
      modules.ContentBlockingAllowList.add(this.webView.linkedBrowser);
      if (shouldReload) {
        this.webView.reload();
      }
    } catch (e) {
      console.log(`XXX oopss ${e}`);
    }
  }

  enableContentBlocking(shouldReload = true) {
    try {
      modules.ContentBlockingAllowList.remove(this.webView.linkedBrowser);
      if (shouldReload) {
        this.webView.reload();
      }
    } catch (e) {
      console.log(`XXX oopss ${e}`);
    }
  }

  // Handles various events from the content-window UI and
  // from the site-info panel.
  async handleEvent(event) {
    switch (event.type) {
      case "zoom-in":
        this.zoomIn();
        break;
      case "zoom-out":
        this.zoomOut();
        break;
      case "nav-back":
        this.webView.goBack();
        break;
      case "nav-forward":
        this.webView.goForward();
        break;
      case "nav-reload":
        this.reload();
        break;
      case "toggle-reader-mode":
        this.webView.toggleReaderMode();
        break;
      case "change-ua":
        let url = this.webView.currentURI;
        await window.uaStore.setUaFor(url, event.detail);
        this.maybeSetUA(url);
        this.reload();
        break;
    }
  }

  maybeSetUA(url) {
    // Sets the custom UA if needed.
    let ua = window.uaStore.getUaFor(url);
    if (ua) {
      this.webView.linkedBrowser.browsingContext.customUserAgent =
        embedder.uaHelper.get(ua);
      this.state.ua = ua;
    } else {
      this.state.ua = null;
    }
  }

  connectedCallback() {
    if (!this.config) {
      console.error(
        "ContentWindow::setConfig() needs to be called before connectedCallback()"
      );
      return;
    }

    let src = this.config.startUrl || "about:blank";
    let transparent = this.config.isHomescreen ? "transparent=true" : "";

    let remoteType = "web";
    if (this.config.isPrivilegedExtension) {
      remoteType = "extension";
    }

    let browsingContextGroupIdAttr = "";
    if (this.config.browsingContextGroupId) {
      browsingContextGroupIdAttr = `browsingContextGroupId="${this.config.browsingContextGroupId}"`;
    }

    this.state.privatebrowsing = !!this.config.details?.privatebrowsing;
    let privateBrowsingAttr = "";
    if (this.state.privatebrowsing) {
      privateBrowsingAttr = `privatebrowsing="true"`;
    }

    let container = document.createElement("div");
    container.classList.add("container");
    container.innerHTML = `
      <link rel="stylesheet" href="components/content_window.css">
      <web-view remote="${this.config.remote}" remoteType="${remoteType}" ${privateBrowsingAttr} ${browsingContextGroupIdAttr} ${transparent}></web-view>
      <div class="loader running">
        <sl-icon name="loader"></sl-icon>
        <img class="hidden"/>
        <div class="title hidden"></div>
      </div>
      <div class="content-crash hidden">
        <sl-alert variant="danger" open>
          <sl-icon slot="icon" name="skull"></sl-icon>
          <div class="message" data-l10n-id="content-crashed"></div>
          <sl-button variant="primary" class="reload-button" data-l10n-id="content-reload"></sl-button>
        </sl-alert>
      </div>
      <div class="select-ui hidden"><select-ui></select-ui></div>
      <div class="navigation hidden">
        <sl-icon id="scroll-top" name="chevron-up"></sl-icon>
        <sl-icon id="scroll-bottom" name="chevron-down"></sl-icon>
      </div>
      <div class="overscroll hidden">
        <sl-icon name="refresh-cw"></sl-icon>
      </div>
      <div class="inline-activity hidden">
        <sl-button variant="primary" circle><sl-icon name="x"></sl-icon></sl-button>
      </div>
      <sl-drawer contained class="modal-drawer permissions" placement="bottom">
        <span slot="label" data-l10n-id="permissions-title">Choose what you want</span>
        <header class="origin"></header>
        <div class="items">
        </div>
        <sl-switch id="permission-remember" data-l10n-id="permissions-remember"></sl-switch>
        <div slot="footer">
          <sl-button id="permission-allow" variant="success" data-l10n-id="permissions-allow"></sl-button>
          <sl-button id="permission-block" variant="danger" data-l10n-id="permissions-block"></sl-button>
        </div>
      </sl-drawer>
      <sl-drawer contained class="modal-drawer modal-prompt" placement="bottom">
        <span slot="label" id="modal-prompt-title"></span>
        <header id="modal-prompt-text"></header>
        <sl-input id="modal-prompt-input"></sl-input>
        <div slot="footer">
          <sl-button id="modal-prompt-btn-ok" variant="success" data-l10n-id="button-ok"></sl-button>
          <sl-button id="modal-prompt-btn-cancel" variant="danger" data-l10n-id="button-cancel"></sl-button>
        </div>
      </sl-drawer>
      `;

    this.container = container;
    this.appendChild(container);
    this.webView = this.querySelector("web-view");
    this.webView.openWindowInfo = this.config.openWindowInfo || null;
    this.webView.src = src;
    this.maybeSetUA(src);

    this.loader = this.querySelector(".loader");
    this.permissions = new PermissionsHelper(
      this.querySelector(".permissions"),
      this.webView
    );
    this.contentCrash = this.querySelector(".content-crash");
    this.selectUiContainer = this.querySelector(".select-ui");
    this.inlineActivity = this.querySelector(".inline-activity");
    this.inlineActivity.querySelector("sl-button").onclick =
      this.closeInlineActivity.bind(this);

    this.querySelector("#scroll-top").onclick = this.scrollToTop.bind(this);
    this.querySelector("#scroll-bottom").onclick =
      this.scrollToBottom.bind(this);
    this.navigation = this.querySelector(".navigation");
    this.navigationTimer = null;
    this.swipeLockTimer = null;

    this.pid = this.webView.processid;

    this.gotTheme = false;

    this.webViewHandler = this.handleBrowserEvent.bind(this);

    this.overscrollHandler = this.handleOverscrollEvent.bind(this);
    this.overscrollContainer = this.querySelector(".overscroll");

    if (this.config.details) {
      let { backgroundColor, icon, title } = this.config.details;
      if (backgroundColor) {
        this.loader.style.backgroundColor = backgroundColor;
      }
      if (this.state.privatebrowsing) {
        this.loader.style.backgroundColor = null;
        this.loader.classList.add("privatebrowsing");
      } else {
        this.loader.classList.remove("privatebrowsing");
      }
      if (icon) {
        this.loader.classList.remove("running");
        this.loader.querySelector("sl-icon").classList.add("hidden");
        let img = this.loader.querySelector("img");
        img.classList.remove("hidden");
        img.src = icon;
      }
      if (title) {
        let text = this.loader.querySelector(".title");
        text.classList.remove("hidden");
        text.textContent = title;
        if (backgroundColor) {
          text.style.color = backgroundColor;
        }
      }

      this.state.search = this.config.details.search;
      this.state.display = this.config.details.display;
    }

    // If loading about:blank, no need for a loader.
    if (src === "about:blank") {
      this.loader.classList.remove("running");
      this.loader.classList.add("hidden");
      this.state.secure = "secure";
    }

    // Attaching all event listeners.
    this.webViewEvents = [
      "close",
      "contextmenu",
      "documentfirstpaint",
      "error",
      "iconchange",
      "loadstart",
      "loadend",
      "locationchange",
      "manifestchange",
      "metachange",
      "opensearch",
      "processready",
      "promptpermission",
      "readermodestate",
      "recordingstatus",
      "scroll",
      "securitychange",
      "showmodalprompt",
      "titlechange",
      "visibilitychange",
    ];

    this.recordAudio = false;
    this.recordVideo = false;

    this.initWebView();
    embedder.delayPreallocatedProcess();

    this.openKeyboard = () => {
      if (this.activated) {
        // Only change the size of the current window.
        this.classList.add("keyboard-open");
        this.keyboardOpen = true;
      } else {
        console.error(
          `Trying to open the keyboard on non-active frame ${this.webView.currentURI}`
        );
      }
    };

    this.closeKeyboard = () => {
      this.classList.remove("keyboard-open");
      this.keyboardOpen = false;
    };

    this.navigateTo = (_name, { url, display, search }) => {
      this.state.search = search;
      this.state.display = display;
      this.webView.src = url;
    };

    actionsDispatcher.addListener("ime-focus-changed", (_name, data) => {
      if (this.activated) {
        this.keyboardData = data;
      }
    });

    // Unmute sound for the content channel.
    this.webView.allowedAudioChannels.forEach(async (channel) => {
      if (channel.name === "content") {
        await channel.setVolume(1);
        await channel.setMuted(false);
      }
    });

    // Initial audio state. isPlayingAudio is updated by the media controller
    // and audioMuted reflect the changes triggered by toggleMutedState().
    this.isPlayingAudio = false;
    this.audioMuted = false;
  }

  toggleMutedState() {
    this.audioMuted = !this.audioMuted;
    if (this.audioMuted) {
      this.webView.linkedBrowser.mute(false);
    } else {
      this.webView.linkedBrowser.unmute();
    }
    // Update the frame list to sync up the "playing audio" icon.
    window.wm.updateFrameList();
    return this.audioMuted;
  }

  initWebView() {
    this.webViewEvents.forEach((eventName) => {
      this.webView.addEventListener(eventName, this.webViewHandler);
    });

    // Preserve layers even for inactive docShells
    this.webView.linkedBrowser.preserveLayers(true);

    this.mediaController = this.webView.mediaController;
    [
      "activated",
      "deactivated",
      "metadatachange",
      "playbackstatechange",
      "positionstatechange",
      "supportedkeyschange",
    ].forEach((name) => {
      this.mediaController.addEventListener(name, async (event) => {
        // Special case when deactivating, since there is no need to
        // get metadata etc.
        if (event.type === "deactivated") {
          actionsDispatcher.dispatch("media-controller-change", {
            event: event.type,
            controller: this.mediaController,
          });

          this.isPlayingAudio = false;
          // Update the frame list to sync up the "playing audio" icon.
          window.wm.updateFrameList();
          return;
        }

        let meta = this.mediaController.getMetadata();
        if (this.ogImage) {
          meta.ogImage = this.ogImage;
        }
        meta.backgroundColor = this.state.backgroundColor;
        meta.icon = this.state.icon;

        actionsDispatcher.dispatch("media-controller-change", {
          event: event.type,
          controller: this.mediaController,
          meta,
        });

        this.isPlayingAudio = this.mediaController.isPlaying;
        // Update the frame list to sync up the "playing audio" icon.
        window.wm.updateFrameList();

        // For now, prevent media playing in Tiles from being indexed.
        if (this.state.url.startsWith("tile://")) {
          return;
        }

        // console.log(
        //   `MediaController: ${event.type}, state=${
        //     this.mediaController.playbackState
        //   } title=${this.mediaController.getMetadata().title}`
        // );

        // When the media starts playing or when the metadata changes and
        // the media is playing, update a Media resource in the content index.
        if (
          (event.type === "metadatachange" ||
            event.type === "playbackstatechange") &&
          this.mediaController.playbackState === "playing" &&
          !this.state.privatebrowsing
        ) {
          await contentManager.createOrUpdateMediaEntry(
            this.state.url,
            this.state.icon,
            meta
          );
        }
      });
    });

    // Overscroll management.
    if (!this.config.isHomescreen) {
      ["overscroll-start", "overscroll-end"].forEach((eventName) => {
        embedder.addEventListener(eventName, this.overscrollHandler);
      });
      this.overscrollTimer = null;
    }
  }

  uninitWebView() {
    this.webViewEvents.forEach((eventName) => {
      this.webView.removeEventListener(eventName, this.webViewHandler);
    });

    if (!this.config.isHomescreen) {
      ["overscroll-start", "overscroll-end"].forEach((eventName) => {
        embedder.removeEventListener(eventName, this.overscrollHandler);
      });
      if (this.overscrollTimer) {
        window.clearTimeout(this.overscrollTimer);
      }
    }
  }

  addInlineActivity(contentWindow) {
    this.inlineActivity.append(contentWindow);
    this.inlineActivity.classList.remove("hidden");
    contentWindow.config.opener = this;
  }

  closeInlineActivity() {
    this.inlineActivity.classList.add("hidden");
    let activityWindow = this.inlineActivity.querySelector("content-window");
    activityWindow.cleanup();
    activityWindow.remove();
    this.activate();
  }

  hasInlineActivity() {
    return !this.inlineActivity.classList.contains("hidden");
  }

  getInlineActivity() {
    return this.inlineActivity.firstElementChild;
  }

  handleOverscrollEvent(event) {
    if (!this.activated) {
      return;
    }

    // console.log(`Overscroll event: ${event.type} on ${this.config.startUrl}`);
    if (event.type === "overscroll-start") {
      this.overscrollContainer.classList.remove("hidden");
      this.overscrollContainer.classList.remove("will-reload");
      this.overscrollReloadNeeded = false;
      // Start the overscroll timer.
      if (this.overscrollTimer) {
        window.clearTimeout(this.overscrollTimer);
      }
      this.overscrollTimer = window.setTimeout(() => {
        this.overscrollReloadNeeded = true;
        this.overscrollContainer.classList.add("will-reload");
      }, 1500);
    } else {
      this.overscrollContainer.classList.add("hidden");
      this.overscrollContainer.classList.remove("will-reload");
      if (this.overscrollTimer) {
        window.clearTimeout(this.overscrollTimer);
      }
      if (this.overscrollReloadNeeded) {
        this.reload();
      }
    }
  }

  // Replaces the current <web-view> by a fresh new one, in
  // case of a crash.
  recreate() {
    this.uninitWebView();
    let webView = document.createElement("web-view");
    webView.setAttribute("remote", "true");
    if (this.config.isHomescreen) {
      webView.setAttribute("transparent", "true");
    }
    webView.setAttribute("src", this.config.startUrl);
    this.webView.replaceWith(webView);
    this.webView = webView;
    this.webView.openWindowInfo = this.config.openWindowInfo || null;

    this.initWebView();
  }

  cleanup() {
    this.webView.cleanup();

    // We won't get a recordingstatus change, so we need to update
    // the status icon based on the current state.
    let status = document.getElementById("status-icons");
    if (this.recordAudio) {
      status.stopAudio();
    }
    if (this.recordVideo) {
      status.stopVideo();
    }
  }

  disconnectedCallback() {
    processManager.remove(this.pid);

    this.uninitWebView();
    this.removeSiteInfoListeners();
  }

  scrollToTop() {
    this.webView?.scrollToTop();
  }

  scrollToBottom() {
    this.webView?.scrollToBottom();
  }

  zoomIn() {
    if (!this.activated) {
      return;
    }
    let currentZoom = this.webView.fullZoom;
    let newZoom = Math.round(currentZoom * 11) / 10;
    this.webView.fullZoom = newZoom;
    this.dispatchStateUpdate();
  }

  zoomOut() {
    if (!this.activated) {
      return;
    }
    let currentZoom = this.webView.fullZoom;
    let newZoom = Math.round((10 * currentZoom) / 1.1) / 10;
    this.webView.fullZoom = newZoom;
    this.dispatchStateUpdate();
  }

  zoomReset() {
    if (!this.activated) {
      return;
    }
    this.webView.fullZoom = 1.0;
    this.dispatchStateUpdate();
  }

  focus() {
    this.webView.focus();
  }

  activate() {
    // If an inline activity is opened, delegate activation to it.
    if (this.hasInlineActivity()) {
      this.getInlineActivity().activate();
      return;
    }

    if (this.activated) {
      return;
    }

    // let path = new Error();
    // console.log(`ZZZ activate ${this.config.startUrl} ${path.stack}`);

    // Always activate immediately, and cancel deactivation timer
    // if there is one running.
    if (this.deactivateTimer) {
      window.clearTimeout(this.deactivateTimer);
      this.deactivateTimer = null;
    }

    this.activated = true;
    this.addSiteInfoListeners();

    this.webView.active = true;
    this.focus();
    processManager.setForeground(this.pid);

    this.dispatchStateUpdate();

    actionsDispatcher.addListener("keyboard-opening", this.openKeyboard);
    actionsDispatcher.addListener("keyboard-closing", this.closeKeyboard);
    actionsDispatcher.addListener("navigate-to", this.navigateTo);

    if (this.keyboardOpen) {
      actionsDispatcher.dispatch("ime-focus-changed", this.keyboardData);
    }

    // Reset navigation timers and state.
    this.navigation.classList.add("hidden");
    if (this.navigationTimer) {
      window.clearTimeout(this.navigationTimer);
    }

    if (this.swipeLockTimer) {
      window.clearTimeout(this.swipeLockTimer);
    }
  }

  deactivate() {
    // If an inline activity is opened, delegate activation to it.
    if (this.hasInlineActivity()) {
      this.getInlineActivity().deactivate();
      return;
    }

    if (!this.activated) {
      return;
    }

    // let path = new Error();
    // console.log(`ZZZ deactivate ${this.config.startUrl} ${path.stack}`);

    this.activated = false;
    this.removeSiteInfoListeners();

    actionsDispatcher.removeListener("keyboard-opening", this.openKeyboard);
    actionsDispatcher.removeListener("keyboard-closing", this.closeKeyboard);
    actionsDispatcher.removeListener("navigate-to", this.navigateTo);

    // Delay deactivation by 3s to prevent rapid switches.
    // if a timer is already running, we don't restart it.
    if (this.deactivateTimer) {
      return;
    }

    this.deactivateTimer = window.setTimeout(
      () => {
        this.deactivateTimer = null;
        this.webView.active = false;
        processManager.setBackground(this.pid, this.config.isHomescreen);
      },
      this.config.isHomescreen ? 3000 : 0
    );
  }

  dispatchStateUpdate(forced = false) {
    if (!this.activated && !forced) {
      return;
    }

    this.state.zoom = this.webView.fullZoom;
    this.state.splitScreen = this.classList.contains("split");
    actionsDispatcher.dispatch("update-page-state", this.state);
  }

  async updateUi(placesUpdateNeeded) {
    if (!this.activated) {
      return;
    }

    this.dispatchStateUpdate();

    if (this.config.isHomescreen || this.state.url === "") {
      return;
    }

    if (placesUpdateNeeded && !this.state.privatebrowsing) {
      await contentManager.createOrUpdatePlacesEntry(
        this.state.url,
        this.state.title,
        this.state.icon
      );
    }
  }

  goTo(url) {
    this.webView.src = url;
  }

  goBack() {
    this.webView.goBack();
  }

  goForward() {
    this.webView.goForward();
  }

  reload(forced = false) {
    this.webView.reload(forced);
  }

  themeColorChanged(color) {
    // console.log(`ContentWindow: themecolorchanged is ${color}`);
    let x = document.createElement("div");
    document.body.appendChild(x);
    try {
      x.style = `color: ${color} !important`;
      this.gotTheme = true;
      this.state.backgroundColor = window.getComputedStyle(x).color;
      this.dispatchStateUpdate();
    } catch (e) {}
    x.remove();
  }

  hideLoader() {
    this.loader.classList.remove("running");
    this.loader.classList.add("hidden");
    if (this.config.isHomescreen) {
      actionsDispatcher.dispatch("homescreen-ready");
    }
    this.updateScreenshot();
  }

  async manageModalPrompt(detail) {
    let promptHelper = new PromptHelper(this, detail);
    let result = await promptHelper.done();
    detail.unblock(result);
    promptHelper.reset();
    promptHelper = null;
  }

  async handleBrowserEvent(event) {
    let detail = event.detail;
    let uiUpdateNeeded = false;
    let placesUpdateNeeded = false;

    let eventType = event.type;

    switch (eventType) {
      case "documentfirstpaint":
        this.hideLoader();
        break;
      case "titlechange":
        this.state.title = detail.title;
        uiUpdateNeeded = true;
        placesUpdateNeeded = true;
        break;
      case "securitychange":
        this.state.secure = detail.state;
        uiUpdateNeeded = true;
        break;
      case "scroll":
        if (this.navigationTimer) {
          window.clearTimeout(this.navigationTimer);
        }

        if (this.swipeLockTimer) {
          window.clearTimeout(this.swipeLockTimer);
        } else {
          // Lock app switch when we scroll.
          window.wm.lockSwipe();
        }

        this.swipeLockTimer = window.setTimeout(() => {
          // Unlock app switch when we are done scrolling.
          window.wm.unlockSwipe();
          this.swipeLockTimer = null;
        }, kSwipeLockDuration);

        // Force the navigation pane to show up and cancel
        // running animations if any.
        this.navigationAnimation?.cancel();
        this.navigation.classList.remove("hidden");

        this.navigationTimer = window.setTimeout(() => {
          // Scrolling stabilized, time to take a screenshot.
          this.updateScreenshot();
          this.navigationAnimation = this.navigation.animate(
            [
              { opacity: 1, transform: "scale(1.0)" },
              { opacity: 0, transform: "scale(0.8)" },
            ],
            800
          );
          this.navigationAnimation.finished.then(() => {
            this.navigation.classList.add("hidden");
          });
          this.navigationTimer = null;
        }, kNavigationDisplayDuration);

        break;
      case "locationchange":
        this.ogImage = null;

        if (this.config.isHomescreen) {
          // Side channel to communicate with the homescreen...
          let url = new URL(detail.url);
          let hash = url.hash;
          if (hash === "#lock") {
            window.wm.lockSwipe();
          } else if (hash === "#unlock") {
            window.wm.unlockSwipe();
          }
        }

        this.maybeSetUA(detail.url);

        // console.log(`locationchange ${this.state.url} -> ${detail.url}`);
        // We don't reset the icon url until we get a new one.
        this.state.iconSize = 0;
        this.state.canGoBack = detail.canGoBack;
        this.state.canGoForward = detail.canGoForward;

        // Only reset the theme status when this is a location change with a different origin + path,
        // not when it's changed eg. by replaceState()
        try {
          let oldUrl = new URL(this.state.url);
          let newUrl = new URL(detail.url);
          if (
            `${oldUrl.origin}${oldUrl.pathname}` !==
            `${newUrl.origin}${newUrl.pathname}`
          ) {
            this.gotTheme = false;
          }
        } catch (e) {
          console.error(`locationchange: ${e}`);
        }

        this.state.url = detail.url;
        uiUpdateNeeded = true;
        placesUpdateNeeded = true;
        break;
      case "visibilitychange":
        uiUpdateNeeded = true;
        break;
      case "metachange":
        if (detail.name == "theme-color") {
          this.themeColorChanged(detail.content);
        }
        if (detail.name == "og:image") {
          this.ogImage = detail.content;
        }
        break;
      case "loadend":
        if (!this.gotTheme) {
          this.webView
            .getBackgroundColor()
            .then(async (color) => {
              // Check again if we didn't race with a theme-color meta change.
              if (!this.gotTheme) {
                this.state.backgroundColor = color;
                await this.updateUi(true);
              }
            })
            .catch(async (error) => {
              console.error(`getBackground failed: ${error}`);
              await this.updateUi(true);
            });
        }
        // Workaround the lack of documentfirstpaint event in some situations
        // when loading moz-extension:// documents.
        if (
          !this.loader.classList.contains("hidden") &&
          (this.state.url.startsWith("moz-extension://") ||
            this.state.url.startsWith("about:"))
        ) {
          this.hideLoader();
        }

        // Script injection.
        let url = this.webView.currentURI;
        if (url !== "about:blank") {
          let origin = new URL(url).origin;
          if (canInjectIn(origin)) {
            try {
              let script = await injectedScriptLoader(origin);
              await this.webView.executeScript(script);
            } catch (e) {
              console.error(`Failed to inject script in ${origin} : ${e}`);
            }
          }
        }
        break;
      case "iconchange":
        await this.iconchanged(detail);
        break;
      case "processready":
        this.pid = detail.processid;
        break;
      case "manifestchange":
        if (!this.state.bringAttention) {
          this.state.bringAttention = this.state.manifestUrl !== detail.href;
        }
        this.state.manifestUrl = detail.href;
        uiUpdateNeeded = true;
        break;
      case "contextmenu":
        if (detail && typeof detail == "object" && !this.config.isHomescreen) {
          console.log(`Got ContextMenu event detail=${JSON.stringify(detail)}`);
          detail.pageUrl = this.state.url;
          let menu = document.body.querySelector("context-menu");
          menu.open(detail, this);
        }
        break;
      case "close":
        if (this.state.fromLockscreen && this.state.whenClosed) {
          await this.state.whenClosed();
        }
        if (this.config.isInlineActivity) {
          this.config.opener.closeInlineActivity();
        } else {
          window.wm.closeFrame(
            this.getAttribute("id"),
            this.config.previousFrame
          );
        }
        break;
      case "error":
        console.error(
          `YYY WebView error: type=${detail.type} reason=${detail.reason} [${this.state.url}]`
        );
        // If the homescreen crashed, wait a bit and reload it.
        if (detail.type === "fatal" && this.config.isHomescreen) {
          window.setTimeout(() => {
            this.recreate();
          }, 3000);
        } else if (detail.type === "fatal") {
          // Content crash, display the dialog that allows reloading.
          this.contentCrash.classList.remove("hidden");
          this.contentCrash.querySelector(".reload-button").addEventListener(
            "click",
            () => {
              // Reloading the crashed content.
              this.loader.classList.add("running");
              this.loader.classList.remove("hidden");
              this.contentCrash.classList.add("hidden");
              this.recreate();
            },
            { once: true }
          );
        } else if (detail.type === "offline") {
          this.loader.classList.remove("running");
          this.loader.classList.add("hidden");
        }
        break;
      case "promptpermission":
        if (detail.requestAction == "prompt") {
          this.permissions.prompt(detail);
        } else {
          this.permissions.cancel();
        }
        break;
      case "showmodalprompt":
        this.manageModalPrompt(detail);
        break;
      case "readermodestate":
        this.state.readerMode = detail;
        uiUpdateNeeded = true;
        break;
      case "opensearch":
        this.maybeAddOpenSearch(detail.href);
        break;
      case "recordingstatus":
        // detail is {"audio":<bool>, "video":<bool>}
        let status = document.getElementById("status-icons");

        if (detail.audio !== this.recordAudio) {
          if (detail.audio) {
            status.startAudio();
          } else {
            status.stopAudio();
          }
        }

        if (detail.video !== this.recordVideo) {
          if (detail.video) {
            status.startVideo();
          } else {
            status.stopVideo();
          }
        }
        this.recordAudio = detail.audio;
        this.recordVideo = detail.video;
        break;
      case "loadstart":
        // Reset state when loading a new document.
        this.state.icon = null;
        this.state.title = this.config.details?.title;
        this.state.manifestUrl = null;
        this.state.secure = "insecure";
        uiUpdateNeeded = true;
        break;
      default:
        console.error(
          `${event.type} ============ for ${
            this.webView.currentURI || "about:blank"
          } : ${JSON.stringify(detail)}`
        );
        break;
    }

    if (uiUpdateNeeded || placesUpdateNeeded) {
      await this.updateUi(placesUpdateNeeded);
      if (
        !this.state.privatebrowsing &&
        !this.config.isHomescreen &&
        eventType === "locationchange"
      ) {
        await contentManager.visitPlace(this.state.url);
      }
    }
  }

  // Register an opensearch provider if it's not known yet.
  async maybeAddOpenSearch(url) {
    if (!this.openSearchManager && !this.state.privatebrowsing) {
      this.openSearchManager = contentManager.getOpenSearchManager();
      await this.openSearchManager.init();
    }

    if (!this.openSearchManager.hasEngine(url)) {
      await this.openSearchManager.addFromUrl(
        url,
        false,
        null,
        this.state.icon
      );
    }
  }

  // Update the url of the icon, trying to use the "best" one.
  async iconchanged(data) {
    let max_size = this.state.iconSize;
    let rel = data.rel || "icon";
    let found = false;

    rel.split(" ").forEach((rel) => {
      let size = 0;
      if (rel == "icon" || rel == "shortcut") {
        size = 32;
      }

      if (rel == "apple-touch-icon" || rel == "apple-touch-icon-precomposed") {
        // Default size according to https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
        size = 57;
      }

      // If there is a `sizes` property, trust it.
      if (data.sizes === "any") {
        // Scalable icon, can't beat that!
        this.state.icon = data.href;
        this.state.iconSize = 1000000;
        found = true;
        return;
      }

      if (data.sizes) {
        data.sizes
          .toLowerCase()
          .split(" ")
          .forEach((item) => {
            let width = item.split("x")[0];
            if (width > size) {
              size = width;
              this.state.icon = data.href;
            }
          });
      }

      if (size > max_size) {
        max_size = size;
        found = true;
        this.state.icon = data.href;
        this.state.iconSize = size;
      }
    });

    // Replace Gecko's hardcoded icon by our brand logo.
    if (this.state.icon == "chrome://branding/content/icon32.png") {
      this.state.icon = window.config.brandLogo;
    }

    // We have a new icon, update the UI state.
    if (found) {
      // Used by about:processes to display the tab icon.
      // This needs to be a base64 url to be loaded in the about: page.
      let favicon = new Image();
      favicon.onload = () => {
        let canvas = new OffscreenCanvas(favicon.width, favicon.height);
        let context = canvas.getContext("2d");
        context.drawImage(favicon, 0, 0);

        canvas.convertToBlob().then((blob) => {
          let reader = new FileReader();
          reader.onloadend = () => {
            let url = reader.result;
            this.webView.linkedBrowser.setAttribute("image", url);
          };
          reader.readAsDataURL(blob);
        });
      };
      favicon.src = this.state.icon;

      await this.updateUi(true);
    }
  }

  updateScreenshot() {
    if (this.config.isHomescreen) {
      // No need to take screenshots of the homescreen since it doesn't
      // appear in the carousel view.
      return Promise.resolve(new Blob());
    }

    return new Promise((resolve) => {
      let start = Date.now();
      this.webView
        .getScreenshot(window.innerWidth, window.innerHeight, "image/jpeg")
        .then((blob) => {
          console.log(`Got screenshot: ${blob} in ${Date.now() - start}ms`);
          this.screenshot = blob;
          resolve(blob);
        });
    });
  }

  // Show the <select> UI as a tab-modal component.
  async showSelectUI(data) {
    // console.log(`ContentWindow: <select> ${JSON.stringify(data)}`);
    let ui = this.selectUiContainer.firstElementChild;
    ui.onclose = () => {
      ui.reset();
      this.selectUiContainer.classList.add("hidden");
    };
    ui.setData(data);
    this.selectUiContainer.classList.remove("hidden");
  }

  savePage() {
    this.webView.savePage();
  }

  async saveAsPDF() {
    let { filename, filePath, promise } = await this.webView.saveAsPDF();

    let title = await window.utils.l10n("save-as-pdf-title");
    let body = await window.utils.l10n("save-as-pdf-processing", {
      filename,
    });
    let tag = `notif-save-pdf-${filename}`;
    let _notif = new Notification(title, {
      body,
      tag,
      data: { progress: -1 },
    });

    promise
      .then(async () => {
        actionsDispatcher.dispatch("import-download", filePath);
        let body = await window.utils.l10n("save-as-pdf-done", { filename });
        let _notif = new Notification(title, { body, tag });
        window.toaster.show(body);
      })
      .catch(async (e) => {
        console.error(`Saving to PDF failed: ${e}`);
        let body = await window.utils.l10n("save-as-pdf-error", { filename });
        let _notif = new Notification(title, { body, tag });
        window.toaster.show(body, "danger");
      });
  }
}

customElements.define("content-window", ContentWindow);
