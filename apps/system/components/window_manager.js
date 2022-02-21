// <window-manager> custom element: a simple window manager.

// Manages key binding state for the window manager.
const kCarouselModifier = embedder.sessionType == "session" ? "Alt" : "Control";

class WindowManagerKeys {
  constructor(wm) {
    this.wm = wm;
    this.isCarouselOpen = false;

    this.isModifierDown = false;
    this.isShiftDown = false;
    this.isCtrlDown = false;
    this.isAltDown = false;
    this.index = -1;

    embedder.addSystemEventListener("keydown", this, true);
    embedder.addSystemEventListener("keyup", this, true);
  }

  changeCarouselState(open) {
    this.isCarouselOpen = open;
  }

  switchToCurrentFrame() {
    if (!this.isCarouselOpen) {
      return;
    }

    let id = document
      .querySelector(`#carousel-screenshot-${this.index}`)
      .getAttribute("frame");
    actionsDispatcher.dispatch("close-carousel");
    this.wm.switchToFrame(id);
  }

  handleEvent(event) {
    // console.log(
    //   `WindowManagerKeys Got ${event.type} event ${event.key} (open=${this.isCarouselOpen})`
    // );

    if (event.key === kCarouselModifier) {
      this.isModifierDown = event.type === "keydown";

      // Switch to current frame when releasing the [modifier] key.
      if (!this.isModifierDown) {
        this.switchToCurrentFrame();
      }
    }

    if (event.key === "Shift") {
      this.isShiftDown = event.type === "keydown";
    }

    if (event.key === "Alt") {
      this.isAltDown = event.type === "keydown";
    }

    if (event.key === "Control") {
      this.isCtrlDown = event.type === "keydown";
    }

    let frameCount = Object.keys(this.wm.frames).length - 1;

    // [Alt] + [1..8] switch to the given frame if it exists.
    // [Alt] + [9] switches to the last frame.
    if (
      event.type === "keydown" &&
      this.isAltDown &&
      "123456789".includes(event.key)
    ) {
      let children = this.wm.windows.childNodes;
      if (event.key === "9") {
        this.wm.switchToFrame(children[frameCount].getAttribute("id"));
      } else {
        let n = event.key | 0;
        if (n <= frameCount) {
          // Frame 0 is the homescreen but we skip it.
          this.wm.switchToFrame(children[n].getAttribute("id"));
        }
      }
    }

    // [modifier] + [Tab] allows switching to the next frame, or to the
    // previous one if [Shift] is pressed.
    if (event.type === "keydown" && event.key === "Tab") {
      let change = this.isShiftDown ? -1 : 1;

      if (!this.isCarouselOpen && this.isModifierDown) {
        actionsDispatcher.dispatch("open-carousel");
        this.index = 0;
        // Find the index of the currently selected frame.
        const selectedFrame = document.querySelector(
          "window-manager div.selected"
        );
        if (selectedFrame) {
          // The id attribute is carousel-screenshot-${this.index}
          this.index = selectedFrame.getAttribute("id").split("-")[2] | 0;
        }
      } else if (this.isCarouselOpen && this.isModifierDown) {
        this.index = this.index + change;
        if (this.index < 0) {
          this.index = frameCount - 1;
        }
        if (this.index >= frameCount) {
          this.index = 0;
        }
        document
          .querySelector(`#carousel-screenshot-${this.index}`)
          .scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "center",
          });
      }
    }

    // Close the carousel with [Escape]
    if (
      event.type === "keyup" &&
      event.key === "Escape" &&
      this.isCarouselOpen
    ) {
      actionsDispatcher.dispatch("close-carousel");
    }

    // Switch to the current frame with [Enter]
    if (event.type === "keyup" && event.key === "Enter") {
      this.switchToCurrentFrame();
    }

    // Switch to the homescreen frame with [Home]
    if (event.type === "keyup" && event.key === "Home") {
      this.wm.goHome();
    }

    // Open the url editor with [Ctrl] + [l]
    if (this.isCtrlDown && event.type === "keydown" && event.key === "l") {
      let frame = wm.currentFrame();
      if (!frame?.config.isHomescreen) {
        actionsDispatcher.dispatch("open-url-editor", frame.state.url);
      }
    }

    // Open the homescreen "new tab" editor with [Ctrl] + [t]
    // We need to switch to the homescreen first.
    if (
      this.isCtrlDown &&
      event.type === "keydown" &&
      event.key === "t" &&
      !window.lockscreen.isOpen()
    ) {
      this.wm.goHome();
      let activity = new WebActivity("new-tab", {});
      activity.start().then(() => console.log(`new-tab done`));
    }

    // Close the current tab with [Ctrl] + [w]
    if (
      this.isCtrlDown &&
      event.type === "keydown" &&
      event.key === "w" &&
      !this.isCarouselOpen
    ) {
      this.wm.closeFrame();
    }

    // Reload the current tab with [Ctrl] + [r]
    // Zoom in the current tab with [Ctrl] + [+]
    // Zoom out the current tab with [Ctrl] + [-]
    // Reset zoom for the current tab with [Ctrl] + [0]
    if (this.isCtrlDown && event.type === "keydown" && !this.isCarouselOpen) {
      if (event.key === "r") {
        this.wm.reloadCurrentFrame();
      } else if (event.key === "+") {
        this.wm.zoomInCurrentFrame();
      } else if (event.key === "-") {
        this.wm.zoomOutCurrentFrame();
      } else if (event.key === "0") {
        this.wm.zoomResetCurrentFrame();
      }
    }
  }
}

class WindowManager extends HTMLElement {
  constructor() {
    super();
    this.keys = new WindowManagerKeys(this);
    this.log(`constructor`);
  }

  log(msg) {
    console.log(`WindowManager: ${msg}`);
  }

  error(msg) {
    console.error(`WindowManager: ${msg}`);
  }

  connectedCallback() {
    // FIXME: We can't use the shadow DOM here because that makes loading <web-view> fail.
    // let shadow = this.attachShadow({ mode: "open" });

    // The window manager contains 2 elements decked on top of each other:
    // - the swipable content windows.
    // - the carousel view.
    this.container = document.createElement("div");
    this.container.classList.add("main");
    this.container.innerHTML = `<link rel="stylesheet" href="components/window_manager.css">
    <div class="windows"></div>
    <div class="carousel hidden">
      <div class="empty"></div>
      <div class="empty"></div>
    </div>
    `;
    this.appendChild(this.container);

    this.windows = this.querySelector(".windows");
    this.carousel = this.querySelector(".carousel");

    let options = {
      root: this.windows,
      rootMargin: "0px",
      threshold: [0, 0.75, 1],
    };

    let intersectionCallback = (entries, observer) => {
      let foundExpected = false;

      entries.forEach((entry) => {
        // this.log(
        //   `Intersection: isIntersecting=${
        //     entry.isIntersecting
        //   } target=${entry.target.getAttribute("id")} ratio=${
        //     entry.intersectionRatio
        //   }`
        // );

        // Change the active status of the webview based on its visibility in
        // the container.
        entry.target.active = entry.isIntersecting;
        let frameId = entry.target.getAttribute("id");
        let frame = this.frames[frameId];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
          // This is the "really" active frame, use it as a source of UI state.
          if (this.expectedActiveFrame && this.expectedActiveFrame == frameId) {
            foundExpected = true;
          }
          frame.activate();
          this.activeFrame = frameId;
        } else if (frame) {
          // The frame may have been removed if we just closed it.
          frame.deactivate();
        }
      });

      if (foundExpected) {
        let frame = this.frames[this.activeFrame];
        frame.deactivate();
        this.activeFrame = this.expectedActiveFrame;
        frame = this.frames[this.activeFrame];
        frame.activate();
        this.expectedActiveFrame = null;
      }
    };

    this.intersectionObserver = new IntersectionObserver(
      intersectionCallback,
      options
    );

    this.frames = {};
    this.frameId = 0;
    this.activeFrame = null;
    this.startedAt = {};
    this.isCarouselOpen = false;

    actionsDispatcher.addListener("go-back", this.goBack.bind(this));
    actionsDispatcher.addListener("go-home", this.goHome.bind(this));
    actionsDispatcher.addListener(
      "open-carousel",
      this.openCarousel.bind(this)
    );
    actionsDispatcher.addListener(
      "close-carousel",
      this.closeCarousel.bind(this)
    );
    actionsDispatcher.addListener("set-screen-off", () => {
      this.sleep();
    });
    // actionsDispatcher.addListener("set-screen-on", () => {
    //   this.wakeUp();
    // });
    actionsDispatcher.addListener("lockscreen-locked", () => {
      this.sleep();
    });
    actionsDispatcher.addListener("lockscreen-unlocked", () => {
      this.wakeUp();
    });
    actionsDispatcher.addListener("frame-split-screen", () => {
      this.splitScreen();
    });

    // This event is sent when calling WindowClient.focus() from a Service Worker.
    window.addEventListener("framefocusrequested", (event) => {
      // event.target is the xul:browser
      this.switchToWebView(event.target.parentElement);
    });
  }

  reloadCurrentFrame() {
    this.activeFrame && this.frames[this.activeFrame].reload();
  }

  zoomInCurrentFrame() {
    this.activeFrame && this.frames[this.activeFrame].zoomIn();
  }

  zoomOutCurrentFrame() {
    this.activeFrame && this.frames[this.activeFrame].zoomOut();
  }

  zoomResetCurrentFrame() {
    this.activeFrame && this.frames[this.activeFrame].zoomReset();
  }

  splitScreen() {
    if (!this.activeFrame) {
      return;
    }
    let frame = this.frames[this.activeFrame];
    // Don't split the homescreen and already splitted content windows.
    if (frame.config.isHomescreen || frame.classList.contains("split")) {
      return;
    }

    // Split the requesting frame.
    frame.classList.add("split");
    frame.classList.add("split-left");
    frame.addEventListener("pointerdown", this, { capture: true });
    frame.deactivate();

    // Open a new frame and configure it to split mode.
    this.openFrame(`about:blank`, {
      activate: true,
      split: true,
      insertAfter: frame,
    });
    this.frames[this.activeFrame].classList.add("split-right");

    actionsDispatcher.dispatch("open-url-editor", null);
  }

  sleep() {
    this.activeFrame && this.frames[this.activeFrame].deactivate();
  }

  wakeUp() {
    if (this.activeFrame) {
      let frame = this.frames[this.activeFrame];
      frame.activate();
    }
  }

  // Show the <select> UI in the active frame context.
  showSelectUI(data) {
    if (this.activeFrame) {
      this.frames[this.activeFrame].showSelectUI(data);
    }
  }

  // Open a new url with a given configuration.
  // Recognized configuration properties:
  // isHomescreen (bool) : the homescreen gets a transparent background and can't be closed.
  // isCaptivePortal (bool) : this frame will be used for wifi captive portal login only.
  // activate (bool) : if true, selects this frame as the active one.
  // details: { title, icon, backgroundColor } : metadata usable for the splash screen.
  //
  // Returns the <web-view> in which the content is loaded.
  openFrame(url = "about:blank", config = {}) {
    this.log(`openFrame ${url}`);

    let startId = this.startedAt[url];
    if (startId && this.frames[startId]) {
      if (this.isCarouselOpen) {
        actionsDispatcher.dispatch("close-carousel");
      }
      this.switchToFrame(startId);
      return this.frames[startId].webView;
    }

    let attrId = `frame${this.frameId}`;
    this.frameId += 1;

    config.previousFrame = this.activeFrame;

    // Create a new ContentWindow, and add it to the set of frames.
    let contentWindow = document.createElement("content-window");
    contentWindow.setAttribute("id", attrId);

    config.startUrl = url;

    if (config.isHomescreen) {
      this.homescreenId = attrId;
      config.disableContentBlocking = true;
    }

    if (config.isCaptivePortal) {
      this.captivePortalId = attrId;
    }

    this.intersectionObserver.observe(contentWindow);
    config.id = attrId;
    contentWindow.setConfig(config);

    if (config?.insertAfter?.nextElementSibling) {
      this.windows.insertBefore(
        contentWindow,
        config.insertAfter.nextElementSibling
      );
    } else {
      this.windows.appendChild(contentWindow);
    }

    this.frames[attrId] = contentWindow;
    contentWindow.goTo(url);

    if (config.activate) {
      if (this.isCarouselOpen) {
        actionsDispatcher.dispatch("close-carousel");
      }
      this.switchToFrame(attrId);
    }

    this.startedAt[url] = attrId;

    if (config.split) {
      contentWindow.classList.add("split");
      contentWindow.addEventListener("pointerdown", this, { capture: true });
    }

    this.updateFrameList();

    return contentWindow.webView;
  }

  handleEvent(event) {
    let contentWindow = event.target;
    while (contentWindow && contentWindow.localName !== "content-window") {
      contentWindow = contentWindow.parentNode;
    }

    if (!contentWindow?.classList.contains("split")) {
      return;
    }

    let nextActive = contentWindow.getAttribute("id");
    if (nextActive === this.activeFrame) {
      return;
    }

    // Activate the frame that received the pointerdown event.
    this.frames[this.activeFrame].deactivate();
    this.activeFrame = nextActive;
    this.frames[this.activeFrame].activate();
    this.switchToFrame(attrId);
  }

  currentFrame() {
    return this.activeFrame ? this.frames[this.activeFrame] : null;
  }

  goBack() {
    this.activeFrame && this.frames[this.activeFrame].goBack();
  }

  goForward() {
    this.activeFrame && this.frames[this.activeFrame].goForward();
  }

  closeFrame(id = "<current>", goTo = null) {
    let frame = null;
    if (id === "<current>") {
      id = this.activeFrame;
      frame = this.frames[this.activeFrame];
    } else if (this.frames[id]) {
      frame = this.frames[id];
    }

    if (id == this.homescreenId) {
      this.error("WindowManager: can't close the homescreen!!");
      return;
    }

    if (!frame) {
      return;
    }

    frame.removeEventListener("pointerdown", this, { capture: true });

    // If this frame is a split-screen one, we need to:
    // - figure out if it's a left or right one.
    // - mark the other frame from the pair as un-split.
    if (frame.classList.contains("split")) {
      let toUnsplit;
      if (frame.classList.contains("split-left")) {
        toUnsplit = frame.nextElementSibling;
        toUnsplit.classList.remove("split-right");
      } else if (frame.classList.contains("split-right")) {
        toUnsplit = frame.previousElementSibling;
        toUnsplit.classList.remove("split-left");
      }
      toUnsplit.classList.remove("split");
    }

    frame.cleanup();
    frame.remove();
    frame = null;
    delete this.frames[id];

    // Remove the frame from the list of start points.
    let startAt = null;
    for (let url in this.startedAt) {
      if (this.startedAt[url] == id) {
        startAt = url;
      }
    }
    if (startAt) {
      delete this.startedAt[startAt];
    }

    // Go to the homescreen.
    if (goTo && this.frames[goTo]) {
      this.switchToFrame(goTo);
    } else {
      this.goHome();
    }

    this.updateFrameList();
  }

  updateFrameList() {
    let list = [];
    let frame = this.windows.firstElementChild;
    while (frame) {
      if (!frame.config.isHomescreen) {
        const { title, icon } = frame.state;
        let id = frame.getAttribute("id");
        list.push({ id, title, icon });
      }
      frame = frame.nextElementSibling;
    }

    actionsDispatcher.dispatch("update-frame-list", list);
  }

  switchToFrame(id, behavior = "instant") {
    // If the window-content is already displayed (eg. inactive split frame),
    // do a manual swap of the curent active frame for the new one.
    let frame = this.frames[this.activeFrame];
    if (frame) {
      let bounding = frame.getBoundingClientRect();
      let visible =
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= window.innerHeight &&
        bounding.right <= window.innerWidth;
      if (visible) {
        frame.deactivate();
        this.activeFrame = id;
        frame = this.frames[this.activeFrame];
        frame.activate();
        return;
      }
    }

    document.querySelector(`#${id}`).scrollIntoView({
      behavior,
      block: "end",
      inline: "center",
    });

    // In split mode, the activated frame may not be the correct one.
    this.expectedActiveFrame = id;
  }

  switchToWebView(webView) {
    for (let id in this.frames) {
      if (webView == this.frames[id].webView) {
        this.switchToFrame(id);
        return;
      }
    }
  }

  goHome() {
    if (this.homescreenId) {
      this.switchToFrame(this.homescreenId);
    }
  }

  openCaptivePortal() {
    this.openFrame("http://example.com", {
      activate: true,
      isCaptivePortal: true,
    });
  }

  closeCaptivePortal() {
    if (!this.captivePortalId) {
      return;
    }

    this.closeFrame(this.captivePortalId);
  }

  openCarousel() {
    if (this.isCarouselOpen) {
      return;
    }

    // We don't put the homescreen in the carousel.
    let frameCount = Object.keys(this.frames).length;

    // No content open except the homescreen: just display a message.
    if (frameCount == 1) {
      this.carousel.setAttribute("style", "grid-template-column: 1fr");
      this.carousel.innerHTML = `<div class="empty-carousel">
                                   <img src="${window.config.brandLogo}" />
                                   <div data-l10n-id="empty-carousel"></div>
                                   <div class="learn-something" data-l10n-id="learn-something-text"></div>
                                 </div>`;

      // Hide the live content and show the carousel.
      this.windows.classList.add("hidden");
      this.carousel.classList.remove("hidden");
      this.isCarouselOpen = true;

      // Open a new frame when clicking on the "learn something" text.
      // We can't use a <a href="..." target="_blank"> because Gecko prevents
      // chrome documents from opening https:// ones.
      this.carousel.querySelector(".learn-something").addEventListener(
        "click",
        async () => {
          actionsDispatcher.dispatch("close-carousel");
          let url = await window.utils.l10n("learn-something-url");
          this.openFrame(url, { activate: true });
        },
        { once: true }
      );

      this.carousel.querySelector(".empty-carousel").addEventListener(
        "click",
        () => {
          actionsDispatcher.dispatch("close-carousel");
        },
        { once: true }
      );
      return;
    }

    // Keep the 75% vs 50% in sync with this rule in window_manager.css :
    // window-manager .carousel > div:not(.empty-carousel)
    let screenshotSize = embedder.sessionType === "mobile" ? 75 : 50;
    this.carousel.style.gridTemplateColumns = `25% repeat(${
      frameCount - 1
    }, ${screenshotSize}%) 25%`;
    // Add the elements to the carousel.
    this.carousel.innerHTML = "";

    let options = {
      root: this.carousel,
      rootMargin: "0px",
      threshold: [0, 0.25, 0.5, 1],
    };

    let intersectionCallback = (entries, observer) => {
      // Avoid oscillation effect when reaching the edges.
      let overscroll = false;
      entries.forEach((entry) => {
        if (
          entry.intersectionRatio == 1 &&
          entry.target.classList.contains("padding")
        ) {
          overscroll = true;
        }
      });
      if (overscroll) {
        return;
      }

      entries.forEach((entry) => {
        let target = entry.target.getAttribute("frame");
        if (!target) {
          return;
        }

        let ratio = entry.intersectionRatio;

        // this.log(
        //   `Carousel: isIntersecting=${
        //     entry.isIntersecting
        //   } target=${target} ratio=${ratio.toFixed(5)}`
        // );

        if (entry.isIntersecting && Math.abs(ratio - 1) < 0.1) {
          entry.target.classList.remove("sideline");
          entry.target.classList.remove("middle");
          // this.log(`Carousel: ${target} -> full`);
        } else if (entry.isIntersecting && Math.abs(ratio - 0.5) < 0.1) {
          entry.target.classList.remove("sideline");
          entry.target.classList.add("middle");
          // this.log(`Carousel: ${target} -> middle`);
        } else {
          entry.target.classList.remove("middle");
          entry.target.classList.add("sideline");
          // this.log(`Carousel: ${target} -> sideline`);
        }
      });
    };

    this.carouselObserver = new IntersectionObserver(
      intersectionCallback,
      options
    );

    // Left padding div.
    let padding = document.createElement("div");
    padding.classList.add("padding");
    this.carouselObserver.observe(padding);
    this.carousel.appendChild(padding);

    // Add screenshots for all windows except the homescreen.
    let index = 0;
    let selectedIndex = -1;
    let frame = this.windows.firstElementChild;
    while (frame) {
      if (frame.config.isHomescreen) {
        frame = frame.nextElementSibling;
        continue;
      }

      let screenshot = document.createElement("div");
      let id = frame.getAttribute("id");

      if (id == this.activeFrame) {
        selectedIndex = index;
        screenshot.classList.add("selected");
      }

      let { current, next } = frame.getScreenshot();
      if (current) {
        let url = URL.createObjectURL(current);
        screenshot.style.backgroundImage = `url(${url})`;
        screenshot.blobUrl = url;
      }

      next.then((blob) => {
        // Optimistic heuristic: if blob are the exact same size, images should be the same.
        // This is obviously not true in general, but good enough here to prevent most
        // useless background updates.
        if (blob.size === current.size) {
          return;
        }
        if (screenshot.blobUrl) {
          URL.revokeObjectURL(screenshot.blobUrl);
        }
        let url = URL.createObjectURL(blob);
        screenshot.style.backgroundImage = `url(${url})`;
        screenshot.blobUrl = url;
      });
      screenshot.setAttribute("frame", id);
      screenshot.setAttribute("id", `carousel-screenshot-${index}`);
      index += 1;
      screenshot.classList.add("screenshot");
      screenshot.innerHTML = `
      <div class="head">
        <img class="favicon" src="${
          frame.state.icon || window.config.brandLogo
        }" />
        <div class="flex-fill"></div>
        <div class="close-icon">
          <lucide-icon kind="x"></lucide-icon>
        </div>
      </div>`;
      screenshot.querySelector(".close-icon").addEventListener(
        "click",
        (event) => {
          this.log(`Will close frame ${id}`);
          event.stopPropagation();
          screenshot.classList.add("closing");
          screenshot.ontransitionend = screenshot.ontransitioncancel = () => {
            screenshot.remove();
            this.closeFrame(id);
            // Update the grid columns definitions.
            let frameCount = Object.keys(this.frames).length;
            if (frameCount > 1) {
              this.carousel.style.gridTemplateColumns = `25% repeat(${
                frameCount - 1
              }, ${screenshotSize}%) 25%`;
            }

            // Exit the carousel when closing the last window.
            if (frameCount == 1) {
              actionsDispatcher.dispatch("close-carousel");
            }
          };
        },
        { once: true }
      );
      screenshot.addEventListener(
        "click",
        () => {
          this.log(`Will switch to frame ${id}`);
          actionsDispatcher.dispatch("close-carousel");
          this.switchToFrame(id);
        },
        { once: true }
      );
      this.carouselObserver.observe(screenshot);
      this.carousel.appendChild(screenshot);

      frame = frame.nextElementSibling;
    }

    // Right padding div.
    padding = document.createElement("div");
    padding.classList.add("padding");
    this.carouselObserver.observe(padding);
    this.carousel.appendChild(padding);

    // Hide the live content and show the carousel.
    this.windows.classList.add("hidden");
    this.carousel.classList.remove("hidden");

    // Select the current frame, unless we come from the homescreen.
    if (selectedIndex !== -1) {
      document
        .querySelector(`#carousel-screenshot-${selectedIndex}`)
        .scrollIntoView({
          behavior: "instant",
          block: "end",
          inline: "center",
        });
    }

    this.isCarouselOpen = true;
    this.keys.changeCarouselState(true);
  }

  closeCarousel() {
    if (!this.isCarouselOpen) {
      return;
    }

    this.keys.changeCarouselState(false);

    // Revoke the blob urls used for the background images.
    let screenshots = this.carousel.querySelectorAll(".screenshot");
    screenshots.forEach((item) => {
      // this.log(`Will revoke blob url ${item.blobUrl}`);
      URL.revokeObjectURL(item.blobUrl);
    });

    // Stop observing the screenshots.
    if (this.carouselObserver) {
      this.carouselObserver.takeRecords().forEach((entry) => {
        this.carouselObserver.unobserve(entry.target);
      });
      this.carouselObserver = null;
    }

    // Empty the carousel.
    this.carousel.innerHTML = "";

    // Display the live content and hide the carousel.
    this.windows.classList.remove("hidden");
    this.carousel.classList.add("hidden");
    this.isCarouselOpen = false;
  }

  lockSwipe() {
    this.log(`lockSwipe()`);
    this.classList.add("lock-swipe");
  }

  unlockSwipe() {
    this.log(`unlockSwipe()`);
    this.classList.remove("lock-swipe");
  }
}

customElements.define("window-manager", WindowManager);
