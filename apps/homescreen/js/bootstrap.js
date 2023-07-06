// Starts and attach some event listeners to open and close the search panel.

var graph;

const kBindingsModifier = "Control";
// Global key bindings for the homescreen.
class KeyBindings {
  constructor() {
    this.isModifierDown = false;
    window.addEventListener("keydown", this, true);
    window.addEventListener("keyup", this, true);
  }

  handleEvent(event) {
    if (event.key == kBindingsModifier) {
      this.isModifierDown = event.type === "keydown";
    }

    // [Ctrl]+[l] opens the search box.
    if (this.isModifierDown && event.type === "keydown" && event.key === "l") {
      openSearchBox();
    }
  }
}

function openSearchBox() {
  let searchPanel = document.getElementById("search-panel");
  if (!searchPanel.classList.contains("open")) {
    let searchBox = document.getElementById("search-box");
    searchBox.focus();
  }
}

function isPrivateBrowsing() {
  let elem = document.getElementById("private-browsing");
  return elem.classList.contains("active");
}

// Helper to decide how to process an window.open url parameter.
// Returns true if window.open() was called, false otherwise.
function maybeOpenURL(url, details = {}) {
  console.log(`maybeOpenURL ${url}`);
  if (!url || url.length == 0) {
    return false;
  }

  details.privatebrowsing = isPrivateBrowsing();

  let isUrl = false;
  try {
    let a = new URL(url);
    isUrl = true;
  } catch (e) {}

  if (url.startsWith("about:")) {
    let act = new WebActivity("open-about", { url });
    act.start();
    return true;
  }

  const isFileUrl = url.startsWith("file://");
  console.log(`maybeOpenURL isUrl=${isUrl} isFileUrl=${isFileUrl}`);

  try {
    // No "." in the url that is not a file:// or ipfs:// one, return false since this
    // is likely a keyword search.
    if (!url.includes(".") && !isUrl) {
      return false;
    }

    if (
      !isFileUrl &&
      !url.startsWith("http") &&
      !url.startsWith("ipfs://") &&
      !url.startsWith("ipns://") &&
      !url.startsWith("tile://")
    ) {
      url = `https://${url}`;
    }

    let encoded = encodeURIComponent(JSON.stringify(details));
    window.open(url, "_blank", `details=${encoded}`);
    console.log(`maybeOpenURL called window.open(${url})`);
  } catch (e) {
    console.log(`maybeOpenUrl oops ${e}`);
  }
  return true;
}

document.addEventListener("DOMContentLoaded", async () => {
  await depGraphLoaded;

  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));
  await Promise.all(
    ["shared-fluent", "main"].map((dep) => graph.waitForDeps(dep))
  );

  let actionsPanel = document.getElementById("actions-panel");
  let searchBox = document.getElementById("search-box");

  let panelManager = null;

  async function ensurePanelManager() {
    // Lazy loading of dependencies for the search panel.
    if (panelManager) {
      return;
    }
    let result = await graph.waitForDeps("search");
    let module = result.get("search panel");
    panelManager = new module.SearchPanel();
    panelManager.init();
  }

  async function openSearchPanel() {
    await ensurePanelManager();
    panelManager.onOpen();
    actionsPanel.classList.add("hide");
  }

  function closeSearchPanel() {
    actionsPanel.classList.remove("hide");
    searchBox.value = "";
    panelManager.onClose();
  }

  searchBox.addEventListener("blur", () => {
    // console.log("Search Box: blur");
    closeSearchPanel();
    panelManager.clearAllResults();
  });

  searchBox.addEventListener("focus", () => {
    // console.log("Search Box: focus");
    openSearchPanel();
  });

  searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchBox.blur();
    }

    if (event.key === "Tab") {
      document.getElementById("default-search-results").onTabKey(event);
      event.preventDefault();
    }
  });

  let opensearchEngine;
  searchBox.addEventListener("keypress", (event) => {
    opensearchEngine = opensearchEngine || new OpenSearch();
    console.log(`SearchBox: keypress ${event.key}`);
    if (event.key !== "Enter") {
      return;
    }

    if (document.getElementById("default-search-results").onEnterKey()) {
      return;
    }

    let input = searchBox.value.trim();
    searchBox.blur();
    if (!maybeOpenURL(input)) {
      // Keyword search, redirect to the current search engine.
      maybeOpenURL(opensearchEngine.getSearchUrlFor(input), { search: input });
    }
  });

  // Configure activity handlers.
  let activities = new ActivityManager({
    "add-to-home": addToHome,
  });

  let keyBindings = new KeyBindings();

  document.getElementById("qr-code").onclick = () => {
    let activity = new WebActivity("scan-qr-code");
    activity.start().then(
      (result) => {
        // await ensurePanelManager();
        // check that this is a proper url.
        console.log(`SCAN-QR-CODE: result is ${result}`);
        try {
          // Rewrite ticket: urls to local dweb/$ticket ones.
          if (result.startsWith("ticket:")) {
            result = `http://localhost:${config.port}/dweb/${result.substring(
              7
            )}`;
          }
          let url = new URL(result);
          maybeOpenURL(url.href);
        } catch (e) {
          console.error(`SCAN-QR-CODE: result is not a URL: ${e}`);
          displayQRCodeResult(result);
        }
      },
      (error) => {
        console.error(`SCAN-QR-CODE: failure: ${error}`);
      }
    );
  };

  const HomescreenFns = {
    isAppInHomescreen: (url) => {
      let actionsWall = document.querySelector("actions-wall");
      return Promise.resolve(!!actionsWall.store.getActionByManifestUrl(url));
    },

    newTab: openSearchBox,
  };

  let xac = await import(`http://shared.localhost:${config.port}/xac/peer.js`);
  let peer = new xac.Peer(
    [{ host: "system", fns: ["isAppInHomescreen", "newTab"] }],
    HomescreenFns
  );
  peer.addEventListener("ready", () => {
    console.log(`XAC: Homescreen received ready!`);
  });
});

window.utils = {
  // Helper to localize a single string.
  l10n: async (id, args) => {
    return await document.l10n.formatValue(id, args);
  },
};

async function displayQRCodeResult(text) {
  await graph.waitForDeps("qr dialog comp");
  document.getElementById("qr-dialog").open(text);
}

async function addToHome(data) {
  console.log(`add-to-home data: ${JSON.stringify(data)}`);
  let actionsWall = document.querySelector("actions-wall");
  if (data.siteInfo) {
    let siteInfo = data.siteInfo;
    for (let prop in siteInfo) {
      console.log(`  ${prop}: ${siteInfo[prop]}`);
    }
    actionsWall.addNewAction({
      kind: "bookmark",
      title: siteInfo.title,
      url: siteInfo.url,
      icon:
        siteInfo.icon ||
        `http://branding.localhost:${location.port}/resources/logo.webp`,
      backgroundColor: siteInfo.backgroundColor,
      color: siteInfo.color,
    });
  } else if (data.app) {
    // We got an app object, for instance for an already installed app that is not pinned to the
    // homescreen.
    actionsWall.addAppAction(data.app);
  }

  return true;
}
