// Starts and attach some event listeners to open and close the search panel.

var graph;

class AppsListHelper {
  constructor() {
    this.ready = false;
  }

  async ensureReady() {
    if (!this.ready) {
      await graph.waitForDeps("apps list comp");
      this.elem = window["apps-list"];
    }
    this.ready = true;
  }

  async toggle() {
    await this.ensureReady();
    this.elem.toggle();
  }

  async close() {
    await this.ensureReady();
    this.elem.close();
  }
}

const appsList = new AppsListHelper();

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

    // [Escape] closes the apps list view if it's open.
    if (
      !this.isModifierDown &&
      event.type === "keydown" &&
      event.key === "Escape"
    ) {
      appsList.close();
    }

    // [Ctrl]+[l] opens the search box.
    if (this.isModifierDown && event.type === "keydown" && event.key === "l") {
      appsList.close();
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

    // Calling .blur() in the event handler triggers
    // a bug that navigates the window to about:blank, so we
    // use an immediate timeout.
    // TODO: figure the gecko issue.
    window.setTimeout(() => {
      let input = searchBox.value.trim();
      searchBox.blur();
      if (!panelManager.openURL(input)) {
        // Keyword search, redirect to the current search engine.
        panelManager.openURL(opensearchEngine.getSearchUrlFor(input), input);
      }
    }, 0);
  });

  // Configure activity handlers.
  let activities = new ActivityManager({
    "new-tab": openSearchBox,
    "add-to-home": addToHome,
  });

  let keyBindings = new KeyBindings();

  document.getElementById("qr-code").onclick = () => {
    let activity = new WebActivity("scan-qr-code");
    activity.start().then(
      async (result) => {
        await ensurePanelManager();
        // check that this is a proper url.
        console.log(`SCAN-QR-CODE: result is ${result}`);
        try {
          let url = new URL(result);
          panelManager.openURL(url.href);
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

  window.requestIdleCallback(() => {
    appsList.ensureReady();
  });

  const HomescreenFns = {
    toggleAppList: () => {
      appsList.toggle();
      return Promise.resolve();
    },
  };

  let xac = await import(`http://shared.localhost:${config.port}/xac/peer.js`);
  let peer = new xac.Peer(
    [{ host: "system", fns: ["toggleAppList"] }],
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
