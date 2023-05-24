/* eslint-disable quotes */
/* global WebEmbedder */
"use strict";

const { XPCOMUtils } = ChromeUtils.importESModule(
  "resource://gre/modules/XPCOMUtils.sys.mjs"
);

// TODO: move to web-view.js
let modules = {};
XPCOMUtils.defineLazyModuleGetters(modules, {
  ContentBlockingAllowList:
    "resource://gre/modules/ContentBlockingAllowList.jsm",
  SafeBrowsing: "resource://gre/modules/SafeBrowsing.jsm",
});

const { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

window.config.platform = AppConstants.platform;
window.config.metaOrControl =
  AppConstants.platform == "macosx" ? "Meta" : "Control";

const UAHelper = {
  default: () => {
    let version = Services.appinfo.platformVersion;
    // MOZ_BUILDID looks like 20220222131952
    const buildId = AppConstants.MOZ_BUILDID;
    const b2gVersion = `${buildId.substr(0, 4)}.${buildId.substr(4, 2)}`;
    return `Mozilla/5.0 (Mobile; rv:${version}) Gecko/20100101 Firefox/${version} ${AppConstants.MOZ_B2G_OS_NAME}/${b2gVersion}`;
  },

  get: (kind) => {
    let version = Services.appinfo.platformVersion;
    let ua;
    if (kind == "android") {
      ua = `Mozilla/5.0 (Android 12; Mobile; rv:${version}) Gecko/${version} Firefox/${version}`;
    } else if (kind == "desktop") {
      ua = `Mozilla/5.0 (X11; Linux x86_64; rv:${version}) Gecko/20100101 Firefox/${version}`;
    }
    return ua || UAHelper.default();
  },
};

(async (exports) => {
  // Keep in sync with dom/interfaces/base/nsIBrowserDOMWindow.idl
  const OPEN_ACTIVITYWINDOW = 16;
  const OPEN_ATTENTIONWINDOW = 17;
  const OPEN_FULLSCREENWINDOW = 18;

  // Setup a promise that will resolve once we are done here.
  let defferedDone = null;
  exports.embedderSetupDone = new Promise((resolve) => {
    defferedDone = resolve;
  });

  const kPreallocLaunchDelay = 5000; // ms of wait time before launching a new preallocated process.

  function log(msg) {
    console.log(`Embedding: ${msg}`);
  }

  let _notificationsManager = null;
  function notificationsManager() {
    if (!_notificationsManager) {
      _notificationsManager = new NotificationsManager();
    }
    return _notificationsManager;
  }

  const windowProvider = {
    openURI(aURI, aOpenWindowInfo, aWhere, aFlags, aTriggeringPrincipal, aCsp) {
      log(`browserWindow::openURI ${aURI}`);
      throw Error("NOT IMPLEMENTED");
    },

    createContentWindow(
      aURI,
      aOpenWindowInfo,
      aWhere,
      aFlags,
      aTriggeringPrincipal,
      aCsp
    ) {
      log(`browserWindow::createContentWindow ${aURI} ${aWhere} ${aFlags}`);
      let disposition = null;
      if (aWhere == OPEN_ACTIVITYWINDOW) {
        disposition = "inline";
      } else if (aWhere == OPEN_ATTENTIONWINDOW) {
        disposition = "attention";
      } else if (aWhere == OPEN_FULLSCREENWINDOW) {
        disposition = "fullscreen";
      }

      let webView = exports.wm.openFrame(aURI, {
        activate: true,
        openWindowInfo: aOpenWindowInfo,
        disposition,
      });
      return webView;
    },

    openURIInFrame(aURI, aParams, aWhere, aFlags, aName) {
      log(
        `browserWindow::openURIInFrame ${aURI} ${aParams} ${aWhere} ${aFlags} ${aName}`
      );

      // Need to return the new WebView here.
      return this.createContentWindowInFrame(
        aURI,
        aParams,
        aWhere,
        aFlags,
        aName
      );
    },

    // Open a new tab in all cases.
    createContentWindowInFrame(aURI, aParams, aWhere, aFlags, aName) {
      log(
        `browserWindow::createContentWindowInFrame ${aURI} ${aParams} ${aWhere} ${aFlags} ${aName}`
      );

      // Ci.nsIBrowserDOMWindow.OPEN_PRINT_BROWSER case
      let isPrinting = aWhere == 4;

      let details = {};

      if (aParams.features?.startsWith("details=")) {
        try {
          let encoded = aParams.features.substr(8); // "details=".length
          details = JSON.parse(decodeURIComponent(encoded));
          // Needed because aFeatures is all lowercase...
          details.backgroundColor = details.backgroundcolor;
        } catch (e) {
          log(`Failed to decode features: ${e}`);
        }
      }

      let webView = exports.wm.openFrame(aURI, {
        activate: !isPrinting,
        openWindowInfo: aParams.openWindowInfo,
        details,
      });
      return webView;
    },

    canClose() {
      log(`browserWindow::canClose`);
      return true;
    },
  };

  const processSelector = {
    NEW_PROCESS: -1,
    timer: null,

    // Launch a preallocated process after at least kPreallocLaunchDelay seconds.
    delayPreallocatedProcess() {
      if (processSelector.timer) {
        window.clearTimeout(processSelector.timer);
      }
      processSelector.timer = window.setTimeout(() => {
        log(`Creating new preallocated process`);
        embedder.launchPreallocatedProcess();
      }, kPreallocLaunchDelay);
    },

    provideProcess(aType, aProcesses, aMaxCount) {
      log(`provideProcess ${aType} (max=${aMaxCount})`);
      try {
        // log(`${JSON.stringify(aProcesses)}`);
      } catch (e) {
        log(`Oops: ${e}`);
      }

      // If we find an existing process with no tab, use it.

      for (let i = 0; i < aProcesses.length; i++) {
        if (aProcesses[i].tabCount == 0) {
          log(`Re-using process #${i}, pid=${aProcesses[i].processId}`);
          return i;
        }
      }

      // Fallback to creating a new process.
      log(`No reusable process found, will create a new one.`);
      return processSelector.NEW_PROCESS;
    },

    suggestServiceWorkerProcess(scope) {
      console.log(`suggestServiceWorkerProcess ${scope}`);

      let current = embedder.getContentProcesses();
      // console.log(`suggestServiceWorkerProcess ${JSON.stringify(current)}`);

      for (let process of current) {
        if (!process.isAlive || process.willShutdown) {
          continue;
        }
        for (let uri of process.tabURIs) {
          if (uri.href.startsWith(scope)) {
            console.log(
              `suggestServiceWorkerProcess will re-use process ${process.processId}`
            );
            return process.processId;
          }
        }
      }

      // For now don't try to be smart with Service Workers pid.
      return 0;
    },
  };

  const notifications = {
    showNotification(notification) {
      log(`showNotification: ${JSON.stringify(notification)}`);
      notificationsManager().show(notification);
    },

    closeNotification(id) {
      log(`closeNotification: ${id}`);
      notificationsManager().close(id);
    },
  };

  const EME_NOTIFICATION_SETTING = "eme-success-notification-displayed";
  const eme = {
    async show(details) {
      if (details.successNotification) {
        // Only show this notification once since it can be quite noisy.
        let settings = await apiDaemon.getSettings();
        try {
          let result = await settings.get(EME_NOTIFICATION_SETTING);
          if (result.value) {
            return;
          }
        } catch (e) {}
        await settings.set([{ name: EME_NOTIFICATION_SETTING, value: true }]);
        log(`EME: successNotification!`);
        window.toaster.show(await window.utils.l10n("drm-success-title"));
        return;
      }

      let actions = null;
      let id = details.notificationId;
      if (id === "drm-content-disabled") {
        actions = [
          {
            action: "enable",
            title: await window.utils.l10n(`drm-button-title`),
          },
        ];
      }

      // Dummy callback used when there is no action to make sure
      // the notification is not routed back to the alerts embedder.
      let dummy = () => {};

      let notification = {
        id,
        icon: "system-icon:toy-brick", // Some kind of "plugin" icon...
        title: await window.utils.l10n(`${id}-title`),
        text: await window.utils.l10n(`${id}-text`),
        callback: details.callback || dummy,
        actions,
      };
      notificationsManager().show(notification);
    },
  };

  const imeHandler = {
    focusChanged(detail) {
      window.actionsDispatcher.dispatch("ime-focus-changed", detail);
    },
  };

  const activityChooser = {
    choseActivity(detail) {
      log(`choseActivity ${JSON.stringify(detail)}`);
      // Don't show the chooser if there's only one option.
      if (detail.choices.length === 1) {
        return Promise.resolve({ id: detail.id, value: 0 });
      }

      let chooser =
        document.getElementById("activity-chooser").firstElementChild;
      return chooser.open(detail);
    },
  };

  let { WebExtensionsDelegate } = await import("./web_extensions_delegate.js");
  const webExtensions = new WebExtensionsDelegate();

  const embedder = new WebEmbedder({
    windowProvider,
    processSelector,
    notifications,
    imeHandler,
    activityChooser,
    webExtensions,
    eme,
  });
  embedder.addEventListener("runtime-ready", (e) => {
    embedder.isReady = true;
    log(`Embedder event: ${e.type}`);
    embedder.launchPreallocatedProcess();
  });

  embedder.delayPreallocatedProcess = processSelector.delayPreallocatedProcess;
  embedder.wrCapture = () => {
    log(`wrCapture`);
    window.windowUtils.wrCapture();
  };

  exports.embedder = embedder;

  // Hacks.
  // Force a Mobile User Agent string.
  Services.prefs.setCharPref(
    "general.useragent.override",
    // UAHelper.get("android")
    UAHelper.default()
  );

  for (let win of Services.ww.getWindowEnumerator()) {
    let winUtils = win.windowUtils;
    log(
      `=== Layer Manager: ${winUtils.layerManagerType} for ${window.location}`
    );
  }

  log(
    `WebExtension Signature needed? ${Services.prefs.getBoolPref(
      "xpinstall.signatures.required"
    )}`
  );

  let sessionType = Services.prefs.getCharPref("b2g.session-type", "mobile");

  log(`session type is '${sessionType}'`);

  // Set some prefs based on the session type.
  if (sessionType == "desktop" || sessionType == "session") {
    Services.prefs.setBoolPref("dom.inputmethod.enabled", false);
    Services.prefs.setBoolPref("dom.flashlight.enabled", false);
    embedder.useVirtualKeyboard = false;
  } else {
    Services.prefs.setBoolPref("dom.inputmethod.enabled", true);
    Services.prefs.setBoolPref("dom.flashlight.enabled", true);
    embedder.useVirtualKeyboard = true;
  }
  embedder.sessionType = sessionType;

  embedder.logOut = () => {
    Services.startup.quit(Services.startup.eForceQuit);
  };

  Services.prefs.setBoolPref("devtools.custom-formatters", false);
  Services.prefs.setBoolPref("devtools.custom-formatters.enabled", false);

  defferedDone();
})(window);
