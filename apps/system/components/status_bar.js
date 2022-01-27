// <system-statusbar> custom element.

class StatusBar extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.innerHTML = `
          <link rel="stylesheet" href="components/status_bar.css">
            <div class="container homescreen">
              <div class="left">
                <lucide-icon class="static battery-icon homescreen-icon" kind="battery-charging"></lucide-icon>
                <img class="favicon" />
                <span class="left-text">Current page title that could be way too long to fit so we need to clip it some way.</span>
              </div>
              <div class="center">
                <lucide-icon kind="layout-grid" class="quicklaunch homescreen-icon"></lucide-icon>
              </div>
              <div class="right">
                <div class="frame-list homescreen-icon content-icon"></div>
                <lucide-icon kind="columns" class="homescreen-icon"></lucide-icon>
                <lucide-icon kind="chevron-left" class="go-back content-icon"></lucide-icon>
                <lucide-icon kind="home" class="content-icon"></lucide-icon>
                <lucide-icon kind="more-vertical" class="more homescreen-icon content-icon"></lucide-icon>
              </div>
            </div>
          </div>
          `;

    // Start with the homescreen section active
    this.isHomescreen = true;

    // Object used to memoize access to dom elements.
    this.elems = {};

    this.isCarouselOpen = false;

    // Initialize the clock and update it when needed.
    this.updateClock();
    this.clockTimer = new MinuteTimer();
    this.clockTimer.addEventListener("tick", () => {
      this.updateClock();
    });

    if (!navigator.getBattery) {
      console.error("navigator.getBattery is not implemented!");
      return;
    }

    window.batteryHelper.addListener(
      "statusbar",
      this.getElem(".battery-icon")
    );

    // Attach event listeners to icons.
    let homeElem = this.getElem(`lucide-icon[kind="home"]`);
    hapticFeedback.register(homeElem);

    homeElem.oncontextmenu = this.homeContextMenu = () => {
      if (this.isCarouselOpen) {
        return;
      }

      // Update state as if we were on the homescreen to ensure
      // we will display the correct icons.
      let state = Object.create(this.state);
      state.isHomescreen = true;
      this.updateState("", state);
      actionsDispatcher.dispatch("open-carousel");
    };

    homeElem.onclick = this.homeClick = () => {
      if (this.isCarouselOpen) {
        actionsDispatcher.dispatch("close-carousel");
      }
      actionsDispatcher.dispatch("go-home");
    };

    let gridElem = this.getElem(`lucide-icon[kind="columns"]`);
    hapticFeedback.register(gridElem);
    gridElem.onclick = () => {
      actionsDispatcher.dispatch("open-carousel");
    };

    let goBackElem = this.getElem(`.go-back`);
    hapticFeedback.register(goBackElem);
    goBackElem.onclick = () => {
      this.state.canGoBack && actionsDispatcher.dispatch("go-back");
    };

    let moreElem = this.getElem(`lucide-icon[kind="more-vertical"]`);
    hapticFeedback.register(moreElem);
    moreElem.onclick = () => {
      actionsDispatcher.dispatch("open-quick-settings");
    };

    let infoElem = this.getElem(`.favicon`);
    hapticFeedback.register(infoElem);
    infoElem.onclick = () => {
      let siteInfo = window.backdrop.querySelector("site-info");
      console.log(`ZZZ Will open site info ${siteInfo}`);
      siteInfo.setState(this.state);
      siteInfo.addEventListener(
        "close",
        () => {
          this.state.bringAttention = false;
          this.updateState("", this.state);
        },
        { once: true }
      );
      siteInfo.open();
    };

    let quickLaunchElem = this.getElem(`.quicklaunch`);
    hapticFeedback.register(quickLaunchElem);
    quickLaunchElem.onpointerdown = () => {
      let activity = new WebActivity("toggle-app-list", {});
      activity.start().catch((e) => {
        console.error(e);
      });
    };

    let leftText = this.getElem(`.left-text`);
    leftText.onclick = () => {
      if (!this.state.isHomescreen) {
        actionsDispatcher.dispatch("open-url-editor", this.state.url);
      }
    };

    actionsDispatcher.addListener(
      "update-page-state",
      this.updateState.bind(this)
    );

    actionsDispatcher.addListener(
      "open-carousel",
      this.openCarousel.bind(this)
    );

    actionsDispatcher.addListener(
      "close-carousel",
      this.closeCarousel.bind(this)
    );

    actionsDispatcher.addListener(
      "notifications-count",
      this.updateNotifications.bind(this)
    );

    actionsDispatcher.addListener("lockscreen-locked", () => {
      this.clockTimer.suspend();
    });

    actionsDispatcher.addListener("lockscreen-unlocked", () => {
      this.updateClock();
      this.clockTimer.resume();
    });

    if (embedder.sessionType !== "mobile") {
      actionsDispatcher.addListener(
        "update-frame-list",
        this.updateFrameList.bind(this)
      );
      this.getElem(`.frame-list`).onclick = (event) => {
        let id = event.target.getAttribute("id").split("-")[1];
        if (this.isCarouselOpen) {
          actionsDispatcher.dispatch("close-carousel");
        }
        window.wm.switchToFrame(id);
      };
    }
  }

  updateClock(force = false) {
    let now = this.displayLocalTime();
    if (force || now !== this.lastClock) {
      this.getElem(".left-text").textContent = now;
      this.lastClock = now;
    }
  }

  updateFrameList(_name, list) {
    if (embedder.sessionType === "mobile") {
      return;
    }
    let frames = this.getElem(`.frame-list`);
    let content = "";
    list.forEach((frame) => {
      let iconUrl = frame.iconUrl || "resources/logo-b2g.webp";
      let iconClass = frame.id == this.currentActive ? `class="active"` : "";
      content += `<img class="favicon" src="${iconUrl}" ${iconClass} title="${frame.title}" alt="${frame.title}" id="shortcut-${frame.id}"/>`;
    });
    frames.innerHTML = content;
  }

  openCarousel() {
    this.isCarouselOpen = true;
    this.getElem(".container").classList.add("carousel");
    this.getElem(`lucide-icon[kind="home"]`).classList.add("carousel");
    this.getElem(`lucide-icon[kind="columns"]`).classList.add("hidden");
    this.updateBackgroundColor("transparent");
  }

  closeCarousel() {
    this.isCarouselOpen = false;
    this.getElem(".container").classList.remove("carousel");
    this.getElem(`lucide-icon[kind="home"]`).classList.remove("carousel");
    this.getElem(`lucide-icon[kind="columns"]`).classList.remove("hidden");
  }

  updateNotifications(_name, count) {
    let moreElem = this.getElem(`lucide-icon[kind="more-vertical"]`);
    if (count !== 0) {
      moreElem.classList.add("available-notifications");
    } else {
      moreElem.classList.remove("available-notifications");
    }
  }

  getElem(selector) {
    if (!this.elems[selector]) {
      this.elems[selector] = this.shadow.querySelector(selector);
    }
    return this.elems[selector];
  }

  // Returns the local time properly formatted.
  displayLocalTime() {
    // Manually apply offset to UTC since we have no guarantee that
    // anything else but `UTC` will work in DateTimeFormat.
    let now = Date.now() - new Date().getTimezoneOffset() * 60 * 1000;

    if (!this.timeFormat) {
      let options = {
        hour: "numeric",
        minute: "numeric",
        timeZone: "UTC",
        hour12: false,
      };
      this.timeFormat = new Intl.DateTimeFormat("default", options);
    }
    return this.timeFormat.format(now);
  }

  updateHomescreenState(state) {
    let left = this.getElem(".left-text");
    left.classList.remove("insecure");
    this.updateClock(true);
  }

  updateContentState(state) {
    let left = this.getElem(".left-text");
    left.textContent = state.title || state.url;

    let isSecure = state.secure == "secure";
    if (state.url) {
      let url = new URL(state.url);
      isSecure =
        isSecure ||
        url.protocol == "ipfs:" ||
        url.protocol == "ipns:" ||
        url.protocol == "chrome:" ||
        url.protocol == "moz-extension:" ||
        url.hostname.endsWith(".localhost");

      // about:blank is always secure.
      isSecure = isSecure || state.url === "about:blank";
    }

    // Reader mode is secure
    if (state.readerMode?.isReaderMode) {
      isSecure = true;
    }

    if (isSecure) {
      left.classList.remove("insecure");
    } else {
      left.classList.add("insecure");
    }

    let goBack = this.getElem(".go-back");
    if (state.canGoBack) {
      goBack.classList.remove("disabled");
    } else {
      goBack.classList.add("disabled");
    }

    // If the app was opened from the lock screen, prevent access
    // to the quick settings.
    // Hitting "Home" closes the app instead of going to the home screen.
    let moreElem = this.getElem(`lucide-icon[kind="more-vertical"]`);
    if (state.fromLockscreen) {
      moreElem.classList.add("hidden");

      let homeElem = this.getElem(`lucide-icon[kind="home"]`);
      homeElem.oncontextmenu = null;
      homeElem.onclick = async () => {
        if (state.whenClosed) {
          await state.whenClosed();
          moreElem.classList.remove("hidden");
        }
        window.wm.closeFrame();
        homeElem.onclick = this.homeClick;
        homeElem.oncontextmenu = this.homeContextMenu;
      };
    } else {
      moreElem.classList.remove("hidden");
    }
  }

  setTopStatusBarBackground(color) {
    // Set the background of the "top" status bar needed when there is
    // a camera sensor.
    if (window.config.topStatusBar) {
      document.getElementById("status-top").style.backgroundColor = color;
    }
  }

  updateBackgroundColor(backgroundColor) {
    // Manage the backgroundColor, if any
    this.classList.remove("transparent");
    if (backgroundColor) {
      let color = backgroundColor;
      if (color == "transparent") {
        // When transparent, keep the default backgroundColor defined by
        // the theme.
        this.style.backgroundColor = null;
        this.setTopStatusBarBackground(null);
        this.classList.add("transparent");
        return;
      }
      this.style.backgroundColor = color;
      this.setTopStatusBarBackground(color);

      // Calculate the luminance of the background color to decide if we
      // should use a dark or light text color.
      let rgba = color
        .match(/rgba?\((.*)\)/)[1]
        .split(",")
        .map(Number);
      let luminance =
        (0.299 * rgba[0] + 0.587 * rgba[1] + 0.114 * rgba[2]) / 255;
      console.log(
        `Found background for ${color}: luminance=${luminance} red=${rgba[0]} green=${rgba[1]} blue=${rgba[2]}`
      );

      // rgba detected transparent.
      if (rgba[3] == 0) {
        this.style.backgroundColor = null;
        this.classList.add("transparent");
        return;
      }

      // Set a class accordingly so that the theme can choose which colors to use.
      if (luminance > 0.5) {
        this.classList.add("high-luminance");
      } else {
        this.classList.remove("high-luminance");
      }
    } else {
      console.error("No backgroundcolor available!");
      // Apply the same treatement as transparent background colors.
      this.style.backgroundColor = null;
      this.style.backgroundColor = null;
      this.classList.add("transparent");
    }
  }

  updateState(_name, state) {
    // We switched from homescreen <-> content, reorder the sections
    // so they get events properly.
    if (this.isHomescreen !== state.isHomescreen) {
      this.isHomescreen = state.isHomescreen;
      if (state.isHomescreen) {
        this.clockTimer.resume();
        this.updateClock();
      } else {
        this.clockTimer.suspend();
      }

      this.getElem(".container").classList.toggle("homescreen");
      this.getElem(".container").classList.toggle("content");
    }

    this.getElem(`.favicon`).src = state.isHomescreen
      ? ""
      : state.iconUrl || "resources/logo-b2g.webp";

    // if (state.bringAttention) {
    //   this.getElem(`lucide-icon[kind="info"]`).classList.add("attention");
    // } else {
    //   this.getElem(`lucide-icon[kind="info"]`).classList.remove("attention");
    // }

    this.state = state;

    // Update the frame list state.
    if (embedder.sessionType !== "mobile") {
      if (this.currentActive !== state.id) {
        let selector = this.currentActiveId
          ? `#shortcut-${this.currentActiveId}`
          : `.frame-list img.active`;
        let currentActive = this.shadowRoot.querySelector(selector);
        if (currentActive) {
          currentActive.classList.remove("active");
        }
      }
      let frameListElem = this.shadowRoot.querySelector(
        `#shortcut-${state.id}`
      );
      if (frameListElem) {
        frameListElem.src = state.iconUrl || "resources/logo-b2g.webp";
        frameListElem.setAttribute("alt", state.title);
        frameListElem.setAttribute("title", state.title);
        frameListElem.classList.add("active");
      }
      this.currentActive = state.id;
    }

    // Toggle visibility accordingly.
    if (state.isHomescreen) {
      this.updateHomescreenState(state);
    } else {
      this.updateContentState(state);
    }

    this.updateBackgroundColor(state.backgroundColor);
  }
}

customElements.define("status-bar", StatusBar);
