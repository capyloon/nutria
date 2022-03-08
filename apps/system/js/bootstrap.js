// Entry point that manages lazy loading of resources and
// making the logo screen disappear.

"use strict";

const bsLoad = Date.now();

function timingFromStart(label) {
  let now = Date.now();
  console.log(`Timing '${label}' at ${now - bsLoad}ms`);
}

function hideLogo() {
  timingFromStart("hideLogo start");
  actionsDispatcher.removeListener("homescreen-ready", hideLogo);
  let logo = document.getElementById("logo");
  if (!logo) {
    return;
  }
  logo.addEventListener(
    "transitionend",
    () => {
      logo.classList.add("hidden");
      logo.classList.remove("starting");
      logo.classList.remove("byebye");
      timingFromStart("hideLogo transitionend");
    },
    { once: true }
  );
  logo.classList.add("byebye");
}

// Returns a promise that resolves once the embedder is ready.
function embedderReady() {
  return new Promise((resolve) => {
    if (window.embedder.isReady) {
      resolve();
    } else {
      window.embedder.addEventListener("runtime-ready", resolve, {
        once: true,
      });
    }
  });
}

// Returns a promise that resolves once the daemon is fully ready:
// - the embedder is ready (needed to get daemon events).
// - the daemon itself is connected.
function daemonReady() {
  return new Promise((resolve) => {
    embedderReady().then(() => {
      if (embedder.isDaemonReady()) {
        resolve();
      } else {
        embedder.addEventListener("daemon-reconnected", resolve, {
          once: true,
        });
      }
    });
  });
}

const customRunner = {
  homescreenLauncher: () => {
    return () => {
      timingFromStart("wm.openFrame for homescreen");
      window.wm.openFrame(
        `http://homescreen.localhost:${config.port}/index.html#${
          embedder.isGonk() ? "device" : "desktop"
        }`,
        {
          isHomescreen: true,
        }
      );
      return Promise.resolve();
    };
  },

  wallpaperReady: () => {
    return () => {
      return new Promise((resolve) => {
        let wallpaperManager = new window.WallpaperManager();
        wallpaperManager.addEventListener("wallpaper-ready", resolve, {
          once: true,
        });
      });
    };
  },

  watchHomescreen: () => {
    return () => {
      actionsDispatcher.addListener("homescreen-ready", hideLogo);
      return Promise.resolve();
    };
  },
};

// Enable radio by default.
async function setupTelephony() {
  let conns = navigator.b2g?.mobileConnections;
  if (!conns) {
    console.error("navigator.b2g.mobileConnections is not available.");
    return;
  }

  // Use only the first connection for now.
  // TODO: multi-SIM support.

  let conn = conns[0];
  if (!conn) {
    console.error(`No mobile connection available!`);
    return;
  } else {
    console.log(`Using connection #1 of ${conns.length}: ${conn}`);
  }
  conn.setRadioEnabled(true);

  // If the radio data is enabled, turn it on and off to force the data
  // connection do be enabled.
  let settings = await apiDaemon.getSettings();
  try {
    let init = await settings.getBatch([
      "ril.data.defaultServiceId",
      "ril.data.apnSettings.sim1",
      "ril.data.roaming_enabled",
      "ril.data.enabled",
    ]);
    console.log(`Bootstrap init=${JSON.stringify(init)}`);
    let dataEnabled = false;
    init.forEach((item) => {
      if (item.name === "ril.data.enabled") {
        dataEnabled = item.value;
      }
    });

    console.log(`Bootstrap Data enabled: ${dataEnabled}`);
    if (dataEnabled) {
      await settings.set([{ name: "ril.data.enabled", value: false }]);
      console.log(`Bootstrap Data turned off`);
      await new Promise((resolve) => {
        window.setTimeout(resolve, 5000);
      });
      await settings.set(init);
      console.log(`Bootstrap Data turned on`);
    }
  } catch (e) {}

  // Open the dialer when we receive an incoming call.
  navigator.b2g.telephony.onincoming = () => {
    // If the screen is turned off, turn it on.
    actionsDispatcher.dispatch("set-screen-on");

    // If the screen is locked, launch through the lockscreen.
    let url = `http://dialer.localhost:${config.port}/index.html?incoming`;
    if (window.lockscreen.isOpen()) {
      window.lockscreen.launch(url);
    } else {
      window.wm.openFrame(url, {
        activate: true,
      });
    }
  };
}

window.utils = {
  // Helper to localize a single string.
  l10n: async (id, args) => {
    return await document.l10n.formatValue(id, args);
  },
};

async function installWebExtensions() {
  // Load the json file with the list of extensions.
  let extensions = [];
  try {
    let list = await fetch(
      `http://shared.localhost:${config.port}/extensions/extensions.json`
    );
    extensions = await list.json();

    [
      "onEnabling",
      "onEnabled",
      "onDisabling",
      "onDisabled",
      "onInstalling",
      "onInstalled",
      "onUninstalling",
      "onUninstalled",
      "onOperationCancelled",
    ].forEach((event) => {
      navigator.mozAddonManager.addEventListener(event, (data) => {
        console.log(`WebExtensions: event ${data.type} id=${data.id}`);
      });
    });
  } catch (e) {
    console.log(`WebExtensions: Error: ${e}`);
  }

  extensions.forEach(async (extension) => {
    let url = `http://shared.localhost:${config.port}/extensions/${extension.url}`;
    console.log(`WebExtensions: Installing ${extension} from ${url}`);
    try {
      let installed = false;
      try {
        let addon = await navigator.mozAddonManager.getAddonByID(extension.id);
        installed = !!addon;
        installed &&
          console.log(
            `WebExtensions:: the ${extension.id} extension is already installed: ${addon.name}, enabled=${addon.isEnabled} active=${addon.isActive}`
          );
      } catch (e) {
        console.log(
          `WebExtensions: the ${extension.id} extension failed to install: ${e.stack}`
        );
      }

      if (!installed) {
        let install = await navigator.mozAddonManager.createInstall({ url });

        if (install.state == "STATE_AVAILABLE") {
          await install.install();
        }
      }
    } catch (e) {
      console.error(`WebExtensions: Error installing Extension: ${e.stack}`);
    }
  });
}

// Check wether we need to run the FTU, and if so launch it.
async function manageFTU() {
  let settings = await apiDaemon.getSettings();
  let ftuDone = false;
  try {
    let result = await settings.get("ftu.done");
    ftuDone = result.value;
  } catch (e) {}

  if (ftuDone) {
    return;
  }

  await window.lockscreen.launch(
    `http://ftu.localhost:${config.port}/index.html`
  );
  try {
    await settings.set([{ name: "ftu.done", value: true }]);
  } catch (e) {
    console.error(`Failed to register FTU as done: ${e}`);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    timingFromStart(
      `DOMContentLoaded, embedder is ${window.embedderSetupDone}`
    );

    let enableTopStatus = Services.prefs.getBoolPref(
      "ui.status-top.enabled",
      false
    );
    window.config.topStatusBar = enableTopStatus;
    if (!enableTopStatus) {
      document.getElementById("screen").classList.add("no-top-status-bar");
    }

    // Make sure the embedding is setup.
    await window.embedderSetupDone;
    console.log(`embedderSetupDone, embedder is ${window.embedder}`);

    // First wait for the daemon to be up, since we can't load the
    // dependency resolver from shared.localhost before!
    await daemonReady();

    // Load <link rel="stylesheet" href="style/{device|desktop}.css" />
    addStylesheet(`style/${isDevice ? "device" : "desktop"}.css`);

    // Load the shared style.
    addStylesheet(
      `http://shared.localhost:${window.config.port}/style/themes/default/theme.css`
    );

    await depGraphLoaded();
    let platform = embedder.isGonk() ? "gonk" : "linux";
    let graph = new ParallelGraphLoader(kDeps, customRunner, { platform });

    // Start with the lock screen on before we load the homescreen to avoid a
    // flash of the homescreen.
    await graph.waitForDeps("lockscreen comp");
    window.lockscreen.open();

    await graph.waitForDeps("phase1");
    await graph.waitForDeps("launch");

    keyManager.registerShortPressAction(config.powerKey, "power");
    keyManager.registerLongPressAction(config.powerKey, "power");
    keyManager.registerShortPressAction("PrintScreen", "printscreen");

    setupTelephony();

    await graph.waitForDeps("audio volume");

    embedder.addEventListener("headphones-status-changed", async (event) => {
      console.log(`headphone status is now ${event.detail}`);
      if (event.detail === "headset") {
        let msg = await window.utils.l10n("headset-plugged");
        window.toaster.show(msg);
      }
    });

    await manageFTU();

    window.onuserproximity = (event) => {
      console.log(`D/hal === userproximity event: near=${event.near}`);
    };

    window.ondevicelight = (event) => {
      console.log(`D/hal === devicelight event: value=${event.value}`);
    };

    // window.ondevicemotion = (event) => {
    //   console.log(`D/hal === devicemotion event: ${event}`);
    // };

    // window.onabsolutedeviceorientation = (event) => {
    //   console.log(
    //     `D/hal === absolutedeviceorientation event: absolute=${event.absolute} a=${event.alpha} b=${event.beta} g=${event.gamma}`
    //   );
    // };

    // window.ondeviceorientation = (event) => {
    //   console.log(
    //     `D/hal === deviceorientation event: absolute=${event.absolute} a=${event.alpha} b=${event.beta} g=${event.gamma}`
    //   );
    // };

    console.log(`D/hal device events set.`);

    installWebExtensions();
  },
  { once: true }
);
