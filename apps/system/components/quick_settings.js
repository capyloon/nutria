// <quick-settings> panel

class QuickSettings extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
    <link rel="stylesheet" href="components/quick_settings.css">
    <link rel="stylesheet" href="http://shared.localhost:${window.config.port}/style/elements.css"/>
    <section class="telephony-info">
      <div class="bars">
        <div class="bar0"></div>
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
      <span></span>
    </section>
    <section class="switches">
      <lucide-icon class="wifi-icon inactive" kind="wifi-off"></lucide-icon>
      <lucide-icon class="flashlight-icon inactive" kind="flashlight-off"></lucide-icon>
      <div class="flex-fill"></div>
      <img id="tor-icon" src="./resources/tor.ico">
      <lucide-icon kind="settings" id="settings-icon"></lucide-icon>
      <lucide-icon kind="log-out" id="logout-icon"></lucide-icon>
      <lucide-icon kind="lock" id="lock-icon"></lucide-icon>
    </section>
    <section id="brightness-section">
      <lucide-icon kind="sun"></lucide-icon>
      <input type="range" id="brightness" name="brightness" min="5" max="100" value="100">
    </section>
    <section class="notifications"></section>
    <section class="browser-actions"></section>
    `;

    document.l10n.translateFragment(shadow);

    actionsDispatcher.addListener("open-quick-settings", () => {
      backdropManager.show("quick-settings", true);
    });

    this.initWifi();
    this.initFlashlight();
    this.initBrightness();
    this.initTelephony();
    this.initTor();

    let logoutIcon = shadow.querySelector("#logout-icon");
    if (
      embedder.sessionType == "session" ||
      embedder.sessionType == "desktop"
    ) {
      logoutIcon.onclick = embedder.logOut;
    } else {
      logoutIcon.remove();
    }

    let lockIcon = shadow.querySelector("#lock-icon");
    if (embedder.sessionType == "mobile") {
      lockIcon.remove();
    } else {
      lockIcon.onclick = () => {
        actionsDispatcher.dispatch("set-screen-off");
      };
    }

    shadow.querySelector("#settings-icon").onclick = () => {
      backdropManager.hide("quick-settings");
      window.wm.openFrame(
        `http://settings.localhost:${config.port}/index.html`,
        { activate: true }
      );
    };
  }

  connectedCallback() {
    this.dispatchEvent(
      new CustomEvent("quick-settings-connected", { bubbles: true })
    );
  }

  changeIconActiveState(elem, enabled) {
    if (enabled) {
      elem.classList.remove("inactive");
      elem.classList.add("active");
    } else {
      elem.classList.remove("active");
      elem.classList.add("inactive");
    }
  }

  async initBrightness() {
    let slider = this.shadowRoot.querySelector("#brightness");
    slider.oninput = (event) => {
      // console.log(`Brightness changed to ${event.target.value}`);
      window.powerManager.service.brightness = event.target.value;
    };

    slider.onpointerdown = () => {
      this.classList.add("adjust-brightness");
      backdropManager.enterAdjustBrightness();
    };

    slider.onpointerup = () => {
      this.classList.remove("adjust-brightness");
      backdropManager.leaveAdjustBrightness();
    };

    if (window.powerManager) {
      let service = window.powerManager.service;
      await service.ready();
      slider.value = await service.brightness;
    }
  }

  async initTor() {
    let torIcon = this.shadowRoot.querySelector("#tor-icon");

    let settings = await apiDaemon.getSettings();

    async function settingOrDefault(name, defaultValue) {
      try {
        let res = await settings.get(name);
        return res.value;
      } catch (e) {
        return defaultValue;
      }
    }

    let torEnabled = await settingOrDefault("tor.enabled", false);
    if (!torEnabled) {
      torIcon.classList.add("disabled");
    } else {
      torIcon.classList.add("enabling");
    }
    const status = await settingOrDefault("tor.status", { ready: false });
    let torReady = status.ready;
    if (torReady) {
      torIcon.classList.remove("enabling");
    }

    settings.addObserver("tor.enabled", async (setting) => {
      torEnabled = setting.value;
      if (torEnabled) {
        torIcon.classList.remove("disabled");
        torIcon.classList.add("enabling");
      } else {
        torIcon.classList.remove("enabling");
        torIcon.classList.add("disabled");
      }
      let msg = await window.utils.l10n(
        torEnabled ? "tor-enabling" : "tor-disabled"
      );
      window.toaster.show(msg);
    });

    settings.addObserver("tor.status", async (setting) => {
      if (setting.value.ready != torReady) {
        torReady = setting.value.ready;
        if (torReady) {
          torIcon.classList.remove("enabling");
          let msg = await window.utils.l10n("tor-enabled");
          window.toaster.show(msg);
        }
      }
    });

    torIcon.addEventListener("click", async (event) => {
      event.stopPropagation();
      await settings.set([{ name: "tor.enabled", value: !torEnabled }]);
    });
  }

  initFlashlight() {
    let flIcon = this.shadowRoot.querySelector(".flashlight-icon");
    if (!navigator.b2g?.getFlashlightManager) {
      flIcon.remove();
      return;
    }

    flIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      flashlightManager.toggle();
    });

    actionsDispatcher.addListener(
      "flashlight-state-change",
      (_name, enabled) => {
        this.changeIconActiveState(flIcon, enabled);
        flIcon.setAttribute("kind", enabled ? "flashlight" : "flashlight-off");
      }
    );
  }

  initWifi() {
    if (!navigator.b2g || !navigator.b2g.wifiManager) {
      console.warn("No Wifi Support");
      return;
    }

    this.wifi = navigator.b2g.wifiManager;
    this.wifiIcon = this.shadowRoot.querySelector(".wifi-icon");

    if (this.wifi.enabled) {
      this.wifiIcon.setAttribute("kind", "wifi");
    }

    // Setup event listeners.
    ["enabled", "disabled", "statuschange", "captiveportallogin"].forEach(
      (event) => {
        this.wifi.addEventListener(event, this);
      }
    );

    // Toggle Wifi when clicking on the icon.
    this.wifiIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      this.wifi.setWifiEnabled(!this.wifi.enabled);
    });
  }

  async addOrUpdateNotification(notification) {
    let unique = await notification.id;
    let existing = this.shadowRoot.querySelector(`#notification-${unique}`);
    if (existing) {
      existing.update(notification);
    } else {
      let node = new WebNotification(notification);
      node.setAttribute("id", `notification-${unique}`);
      this.shadowRoot.querySelector(".notifications").appendChild(node);
    }
  }

  async removeNotification(notification) {
    let unique = await notification.id;
    let existing = this.shadowRoot.querySelector(`#notification-${unique}`);
    if (existing) {
      existing.remove();
    }
  }

  handleEvent(event) {
    // console.log(`Wifi: event ${event.type}`);
    switch (event.type) {
      case "enabled":
        // console.log(`ZZZ Wifi enabled`);
        this.wifiIcon.setAttribute("kind", "wifi");
        this.wifi.getNetworks();
        break;
      case "disabled":
        // console.log(`ZZZ Wifi disabled`);
        this.wifiIcon.setAttribute("kind", "wifi-off");
        break;
      case "statuschange":
        // console.log(`ZZZ Wifi status changed to ${event.status} for ${event.network.ssid}`);
        if (event.status == "connected") {
          this.wifiIcon.classList.remove("inactive");
          this.wifiIcon.classList.add("active");
        } else {
          this.wifiIcon.classList.remove("active");
          this.wifiIcon.classList.add("inactive");
        }
        break;
      case "captiveportallogin":
        // console.log(`ZZZ Wifi captiveportallogin success=${loginSuccess}`);
        // TODO: Use a notification instead of opening directly the login page.
        if (event.loginSuccess) {
          // Close the captive portal frame if it was opened.
          window.wm.closeCaptivePortal();
        } else {
          // Open a window to give the opportunity to login.
          window.wm.openCaptivePortal();
        }
        break;
    }
  }

  initTelephony() {
    let conns = navigator.b2g?.mobileConnections;
    let dataCallManager = navigator.b2g?.dataCallManager;

    if (!conns || !dataCallManager) {
      console.error("mobileConnections or dataCallManager are not available.");
      this.shadowRoot.querySelector(".telephony-info").remove();
      return;
    }

    // Use the first SIM.
    let conn = conns[0];
    if (!conn) {
      console.error(`No mobile connection available!`);
      return;
    }

    let textNode = this.shadowRoot.querySelector(".telephony-info span");
    let signalBars = [];
    for (let i = 0; i < 4; i++) {
      signalBars.push(
        this.shadowRoot.querySelector(`.telephony-info .bars .bar${i}`)
      );
    }

    const updateDisplay = async () => {
      if (conn.radioState === "disabled") {
        textNode.textContent = "";
        for (let i = 0; i < 4; i++) {
          signalBars[i].classList.add("inactive");
        }
        return;
      }

      let dataCallState = "unknown";
      try {
        dataCallState = await dataCallManager.getDataCallState("default");
      } catch (e) {
        console.error(`Error getting dataCallState: ${e}`);
      }

      let text =
        conn.data.network?.shortName || conn.voice.network?.shortName || "";

      // Map connection types to user friendly names.
      const mobileDataTypes = {
        lte: "4G", // 4G LTE
        lte_ca: "4G", // 4G LTE Carrier Aggregation
        ehrpd: "4G", // 4G CDMA
        "hspa+": "H+", // 3.5G HSPA+
        hsdpa: "H",
        hsupa: "H",
        hspa: "H", // 3.5G HSDPA
        evdo0: "EV",
        evdoa: "EV",
        evdob: "EV", // 3G CDMA
        umts: "3G", // 3G
        tdscdma: "3G", // TDS-CDMA
        edge: "E", // EDGE
        gprs: "2G",
        "1xrtt": "2G",
        is95a: "2G",
        is95b: "2G", // 2G CDMA
      };

      if (dataCallState === "connected" && conn.data.type) {
        text = `${text} — ${
          mobileDataTypes[conn.data.type] || conn.data.type
        }⇅`;
      } else if (conn.voice.type) {
        text = `${text} — ${
          mobileDataTypes[conn.voice.type] || conn.voice.type
        }`;
      } else if (conn.voice.emergencyCallsOnly) {
        let msg = await window.utils.l10n("emergency-calls-only");
        text = `${text} — ${msg}`;
      }
      if (conn.voice.roaming || conn.data.roaming) {
        text += ` 🌍`;
      }

      textNode.textContent = text;

      let level = conn.signalStrength.level; // ranges from -1 to 4.
      if (level !== -1) {
        // Update the bar graph.
        for (let i = 0; i < 4; i++) {
          if (i < level) {
            signalBars[i].classList.remove("inactive");
          } else {
            signalBars[i].classList.add("inactive");
          }
        }
      } else {
        // level == -1 means out-of-service.
        for (let i = 0; i < 4; i++) {
          signalBars[i].classList.add("inactive");
        }
      }
    };

    conn.onradiostatechange = conn.ondatachange = updateDisplay;
    updateDisplay();
  }

  // Turn an extension id into a string usable in css selectors.
  safeId(id) {
    let a = encodeURIComponent(id).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return p1.toString(16);
    });
    return a.replace(/\./, "--");
  }

  addBrowserAction(extensionId, node) {
    let id = `browser-action-${this.safeId(extensionId)}`;
    // console.log(`addBrowserAction ${extensionId} -> ${id}`);
    if (!this.shadowRoot.querySelector(`#${id}`)) {
      this.shadowRoot.querySelector(".browser-actions").append(node);
      node.setAttribute("id", id);
    }
  }

  removeBrowserAction(extensionId) {
    // console.log(`removeBrowserAction`);
    this.getBrowserAction(extensionId)?.remove();
  }

  getBrowserAction(extensionId) {
    // console.log(`getBrowserAction ${extensionId}`);
    return this.shadowRoot.querySelector(
      `#browser-action-${this.safeId(extensionId)}`
    );
  }
}

customElements.define("quick-settings", QuickSettings);
