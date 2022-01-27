// Starts and attach some event listeners to open and close the search panel.

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

var graph;

document.addEventListener("DOMContentLoaded", async () => {
  // navigator.serviceWorker.register("/sw.js").then(
  //   function (registration) {
  //     // Registration was successful
  //     console.log(
  //       "ServiceWorker registration successful with scope: ",
  //       registration.scope
  //     );
  //   },
  //   function (err) {
  //     // registration failed :(
  //     console.log("ServiceWorker registration failed: ", err);
  //   }
  // );
  await depGraphLoaded;

  graph = new ParallelGraphLoader(kDeps);
  await Promise.all([getSharedDeps("shared-all"), graph.waitForDeps("main")]);

  let actionsPanel = document.getElementById("actions-panel");
  let searchBox = document.getElementById("search-box");

  let panelManager = null;

  async function openSearchPanel() {
    // Lazy loading of dependencies for the search panel.
    if (!panelManager) {
      let result = await graph.waitForDeps("search");
      let module = result.get("search panel");
      panelManager = new module.SearchPanel();
      panelManager.init();
    }

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

  searchBox.addEventListener("keypress", (event) => {
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
        let engine = new OpenSearch(kBraveSearch);
        panelManager.openURL(engine.getSearchUrlFor(input));
      }
    }, 0);
  });

  // Listen to messages from the service worker.
  navigator.serviceWorker.onmessage = activityHandler;

  let keyBindings = new KeyBindings();
});

async function activityHandler(event) {
  let activity = event.data;
  console.log(`Homescreen activity from ${event.origin}: ${activity.name}`);
  if (activity.name === "new-tab") {
    openSearchBox();
  } else if (activity.name === "toggle-app-list") {
    appsList.toggle();
  } else if (activity.name === "add-to-home") {
    let actionsWall = document.querySelector("actions-wall");
    let data = activity.data;

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
          siteInfo.iconUrl ||
          `http://system.localhost:${location.port}/resources/logo-b2g.webp`,
      });
    } else if (data.app) {
      // We got an app object, for instance for an already installed app that is not pinned to the
      // homescreen.
      actionsWall.addAppAction(data.app);
    }
  }
}
