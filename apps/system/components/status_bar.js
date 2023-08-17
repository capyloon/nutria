// <system-statusbar> custom element.

class SwipeDetector extends EventTarget {
  constructor(elem) {
    super();

    elem.addEventListener("pointerdown", this);
    elem.addEventListener("pointerup", this);

    this.startX = undefined;
    this.startY = undefined;
    this.startedAt = undefined;

    let box = elem.getBoundingClientRect();

    // Half the height of the box -> swipe detected in Y axis.
    this.yTolerance = Math.round(box.height / 2) || 0;

    // 0.5cm -> swipe detected in X axis.
    let cm = (box.width * window.devicePixelRatio) / (96.0 * 2.56);
    this.xTolerance = Math.round((box.width * 0.5) / cm) || 0;

    this.log(`xTolerance=${this.xTolerance} yTolerance=${this.yTolerance}`);
  }

  log(msg) {
    console.log(`SwipeDetector: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "pointerdown") {
      this.startedAt = Date.now();
      this.startX = event.clientX;
      this.startY = event.clientY;
    } else if (event.type === "pointerup") {
      let elapsed = Date.now() - this.startedAt;
      let dx = event.clientX - this.startX;
      let dy = event.clientY - this.startY;

      // this.log(`dx=${dx} dy=${dy} elapsed=${elapsed}`);

      if (elapsed > 500) {
        return;
      }

      const xTolerance = this.xTolerance;
      const yTolerance = this.yTolerance;

      if (dx < xTolerance && dx > -xTolerance && dy < -yTolerance) {
        // this.log("Swiped Up");
        this.dispatchEvent(new CustomEvent("swipe-up"));
      }
      if (dx < xTolerance && dx > -xTolerance && dy > yTolerance) {
        // this.log("Swiped Down");
        this.dispatchEvent(new CustomEvent("swipe-down"));
      }
      if (dy < yTolerance && dy > -yTolerance && dx < -xTolerance) {
        // this.log("Swiped Left");
        this.dispatchEvent(new CustomEvent("swipe-left"));
      }
      if (dy < yTolerance && dy > -yTolerance && dx > xTolerance) {
        // this.log("Swiped Right");
        this.dispatchEvent(new CustomEvent("swipe-right"));
      }
    }
  }
}

class StatusBar extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });

    this.shadow.innerHTML = `
    <link rel="stylesheet" href="components/status_bar.css">
      <div class="container homescreen session-${embedder.sessionType}">
        <div class="left">
          <sl-icon class="static battery-icon homescreen-icon" name="battery-charging"></sl-icon>
          <img class="favicon" />
          <span class="left-text">Current page title that could be way too long to fit so we need to clip it some way.</span>
        </div>
        <div class="center">
          <sl-icon name="layout-grid" class="quicklaunch homescreen-icon"></sl-icon>
        </div>
        <div class="right">
          <sl-icon name="chevron-left" class="go-back content-icon"></sl-icon>
          <div class="frame-list homescreen-icon content-icon"></div>
          <sl-icon name="columns" class="homescreen-icon"></sl-icon>
          <sl-icon name="home" class="content-icon"></sl-icon>
          <sl-badge pill variant="neutral">
             <sl-icon name="more-vertical" class="homescreen-icon content-icon"></sl-icon>
          </sl-badge>
        </div>
      </div>
    </div>`;

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
    let homeElem = this.getElem(`sl-icon[name="home"]`);
    hapticFeedback.register(homeElem);

    homeElem.oncontextmenu = this.homeContextMenu = () => {
      this.triggerCarousel();
    };

    homeElem.onclick = this.homeClick = () => {
      if (this.isCarouselOpen) {
        actionsDispatcher.dispatch("close-carousel");
      }
      actionsDispatcher.dispatch("go-home");
    };

    let gridElem = this.getElem(`sl-icon[name="columns"]`);
    hapticFeedback.register(gridElem);
    gridElem.onclick = () => {
      actionsDispatcher.dispatch("open-carousel");
    };

    let goBackElem = this.getElem(`.go-back`);
    hapticFeedback.register(goBackElem);
    goBackElem.onclick = () => {
      this.state.canGoBack && actionsDispatcher.dispatch("go-back");
    };

    let moreElem = this.getElem(`sl-badge`);
    hapticFeedback.register(moreElem);
    moreElem.addEventListener("click", () => {
      actionsDispatcher.dispatch("open-quick-settings");
    });

    let infoElem = this.getElem(`.favicon`);
    hapticFeedback.register(infoElem);
    infoElem.onclick = () => {
      let siteInfo = document.body.querySelector("site-info");
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
    quickLaunchElem.onpointerdown = async () => {
      if (this.isCarouselOpen) {
        actionsDispatcher.dispatch("close-carousel");
      }
      document.getElementById("apps-list").toggle();
    };

    let leftText = this.getElem(`.left-text`);
    leftText.onclick = () => {
      if (!this.state.isHomescreen) {
        actionsDispatcher.dispatch("open-url-editor", this.state.url);
      }
    };

    this.setupSwipeDetector();

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
      if (this.state.isHomescreen) {
        this.updateClock();
        this.clockTimer.resume();
      }
    });

    if (embedder.sessionType !== "mobile") {
      actionsDispatcher.addListener(
        "update-frame-list",
        this.updateFrameList.bind(this)
      );
      this.getElem(`.frame-list`).onclick = (event) => {
        let localName = event.target.localName;
        let target = event.target;
        switch (localName) {
          case "img":
            target = target.parentElement;
          case "div":
            let id = target.getAttribute("id").split("-")[1];
            if (this.isCarouselOpen) {
              actionsDispatcher.dispatch("close-carousel");
            }
            window.wm.switchToFrame(id);
            break;
          case "sl-icon":
            // Toggle the muted state of the frame.
            let frameId = target.parentElement.getAttribute("id").split("-")[1];
            window.wm.toggleMutedState(frameId);
            break;
          default:
            console.log(`Unexpected frame-list target: ${localName}`);
        }
      };
    }
  }

  setupSwipeDetector() {
    const swipeDetector = new SwipeDetector(this);
    swipeDetector.addEventListener("swipe-up", () => {
      this.triggerCarousel();
    });
    swipeDetector.addEventListener("swipe-left", () => {
      this.state.canGoBack && actionsDispatcher.dispatch("go-back");
    });
    swipeDetector.addEventListener("swipe-right", () => {
      this.state.canGoForward && actionsDispatcher.dispatch("go-forward");
    });
  }

  triggerCarousel() {
    if (this.isCarouselOpen) {
      return;
    }

    // Update state as if we were on the homescreen to ensure
    // we will display the correct icons.
    let state = Object.create(this.state);
    state.isHomescreen = true;
    this.updateState("", state);
    actionsDispatcher.dispatch("open-carousel");
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
      let icon = frame.icon || window.config.brandLogo;
      let iconClass = frame.id == this.currentActive ? "active" : "";
      if (frame.isPlayingAudio) {
        iconClass += " audio";
      }
      content += `<div class="${iconClass}" id="shortcut-${frame.id}">
                    <img class="favicon" src="${icon}" title="${frame.title}" alt="${frame.title}"/>`;
      if (frame.isPlayingAudio) {
        content += `<sl-icon name="${
          frame.audioMuted ? "volume-x" : "volume-1"
        }" class="content-icon homescreen-icon"></sl-icon>`;
      }
      content += "</div>";
    });
    frames.innerHTML = content;
  }

  openCarousel() {
    this.isCarouselOpen = true;
    this.getElem(".container").classList.add("carousel");
    this.getElem(`sl-icon[name="home"]`).classList.add("carousel");
    this.getElem(`sl-icon[name="columns"]`).classList.add("hidden");
    this.updateBackgroundColor("transparent", true);
    document.getElementById("status-top").classList.add("carousel");
  }

  closeCarousel() {
    this.isCarouselOpen = false;
    this.getElem(".container").classList.remove("carousel");
    this.getElem(`sl-icon[name="home"]`).classList.remove("carousel");
    this.getElem(`sl-icon[name="columns"]`).classList.remove("hidden");
    document.getElementById("status-top").classList.remove("carousel");
  }

  updateNotifications(_name, count) {
    let moreElem = this.getElem(`sl-badge`);
    if (count !== 0) {
      moreElem.variant = "primary";
    } else {
      moreElem.variant = "neutral";
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

  updateDisplayState(state) {
    let display = state.display || "browser";
    let statustop = document.getElementById("status-top");
    if (display === "fullscreen") {
      this.classList.add("fullscreen");
      statustop.classList.add("fullscreen");
    } else {
      this.classList.remove("fullscreen");
      statustop.classList.remove("fullscreen");
    }
  }

  updateHomescreenState(state) {
    this.updateDisplayState(state);
    let left = this.getElem(".left-text");
    left.classList.remove("insecure");
    this.updateClock(true);
  }

  updateContentState(state) {
    this.updateDisplayState(state);
    let left = this.getElem(".left-text");
    left.textContent = state.title || state.url;

    let isSecure = state.secure == "secure";
    if (state.url) {
      let url = new URL(state.url);
      isSecure =
        isSecure ||
        url.protocol == "about:" ||
        url.protocol == "ipfs:" ||
        url.protocol == "ipns:" ||
        url.protocol == "tile:" ||
        url.protocol == "chrome:" ||
        url.protocol == "moz-extension:" ||
        url.hostname.endsWith(".localhost");
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
    let moreElem = this.getElem(`sl-badge`);
    let homeElem = this.getElem(`sl-icon[name="home"]`);
    if (state.fromLockscreen && homeElem.oncontextmenu) {
      moreElem.classList.add("hidden");

      homeElem.oncontextmenu = null;
      homeElem.onclick = async () => {
        if (state.whenClosed) {
          await state.whenClosed();
        }
        window.wm.closeFrame();
      };

      // Observes the next frame being closed: it's either the FTU or
      // an app launched from the lockscreen.
      // In both cases we can now reset the UI to show the "more" icon.
      window.wm.addEventListener(
        "frameclosed",
        async () => {
          homeElem.onclick = this.homeClick;
          homeElem.oncontextmenu = this.homeContextMenu;
          moreElem.classList.remove("hidden");
        },
        { once: true }
      );
    } else if (!state.fromLockscreen) {
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

  updateBackgroundColor(backgroundColor, enterCarousel = false) {
    // Manage the backgroundColor, if any
    this.classList.remove("transparent");

    if (this.state.privatebrowsing) {
      this.style.backgroundColor = null;
      if (enterCarousel) {
        this.classList.remove("privatebrowsing");
        this.setTopStatusBarBackground(null);
        this.classList.add("transparent");
      } else {
        this.classList.add("privatebrowsing");
      }
      return;
    } else {
      this.classList.remove("privatebrowsing");
    }

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
        this.state.highLuminance = true;
      } else {
        this.classList.remove("high-luminance");
        this.state.highLuminance = false;
      }
    } else {
      // No background color available:
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

    let favicon = this.getElem(`.favicon`);
    favicon.src = state.isHomescreen
      ? ""
      : state.icon || window.config.brandLogo;

    if (state.privatebrowsing) {
      favicon.src = "resources/privatebrowsing.svg";
    }

    // if (state.bringAttention) {
    //   this.getElem(`sl-icon[name="info"]`).classList.add("attention");
    // } else {
    //   this.getElem(`sl-icon[name="info"]`).classList.remove("attention");
    // }

    this.state = state;

    // Update the frame list state.
    if (embedder.sessionType !== "mobile") {
      if (this.currentActive !== state.id) {
        let selector = this.currentActive
          ? `#shortcut-${this.currentActive}`
          : `.frame-list div.active`;
        let currentActive = this.shadowRoot.querySelector(selector);
        if (currentActive) {
          currentActive.classList.remove("active");
        }
      }
      let frameListElem = this.shadowRoot.querySelector(
        `#shortcut-${state.id} img`
      );
      if (frameListElem) {
        frameListElem.src = state.icon || window.config.brandLogo;
        frameListElem.setAttribute("alt", state.title);
        frameListElem.setAttribute("title", state.title);
        frameListElem.parentElement.classList.add("active");
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
