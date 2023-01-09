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
  console.log(`openSearchBox`);
  let searchPanel = document.getElementById("search-panel");
  if (!searchPanel.classList.contains("open")) {
    let searchBox = document.getElementById("search-box");
    searchBox.focus();
    console.log(`search-box.focus() called`);
  }
}

class SearchPanel {
  constructor() {
    this.graph = null;
    this.panelManager = null;
  }

  init(graph) {
    this.graph = graph;
    this.actionsPanel = document.getElementById("actions-panel");
    this.searchBox = document.getElementById("search-box");
  }

  async ensureLoaded() {
    // Lazy loading of dependencies for the search panel.
    if (this.panelManager) {
      return;
    }
    let result = await this.graph.waitForDeps("search");
    let module = result.get("search panel");
    this.panelManager = new module.SearchPanel();
    this.panelManager.init();
  }

  async open() {
    await this.ensureLoaded();
    this.panelManager.onOpen();
    this.actionsPanel.classList.add("hidden");
    this.searchBox.focus();
  }

  close() {
    this.actionsPanel.classList.remove("hidden");
    this.searchBox.value = "";
    this.panelManager.onClose();
  }

  manager() {
    return this.panelManager;
  }
}

const gSearchPanel = new SearchPanel();

document.addEventListener("DOMContentLoaded", async () => {
  await depGraphLoaded;

  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));
  await Promise.all(
    ["shared-fluent", "main"].map((dep) => graph.waitForDeps(dep))
  );

  gSearchPanel.init(graph);

  let searchBox = document.getElementById("search-box");

  searchBox?.addEventListener("blur", () => {
    // console.log("Search Box: blur event");
    // closeSearchPanel();
    // panelManager.clearAllResults();
    // window.setTimeout(() => {
    //   console.log(
    //     `After searchBox blur, active element=${document.activeElement.localName}`
    //   );
    // }, 1000);
  });

  searchBox?.addEventListener("sl-focus", () => {
    console.log("Search Box: focus event");
    gSearchPanel.open();
  });

  searchBox?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchBox.blur();
    }

    // if (event.key === "Tab") {
    //   document.getElementById("default-search-results").onTabKey(event);
    //   event.preventDefault();
    // }
  });

  let opensearchEngine;
  searchBox?.addEventListener("keypress", (event) => {
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
    "add-to-home": addToHome,
  });

  // let keyBindings = new KeyBindings();

  const HomescreenFns = {
    isAppInHomescreen: (url) => {
      // Claims that all apps are already in the homescreen.
      return Promise.resolve(true);
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

  await contentManager.as_superuser();

  // Initialize each section.
  let favorites = new Apps(document.getElementById("apps-list"));
  await favorites.init();
  await favorites.ready;

  let videos = new Videos(document.getElementById("video-list"));
  await videos.init();

  document.getElementById("settings-button").addEventListener("click", () => {
    window.open(
      `http://settings.localhost:${location.port}/index.html`,
      "_blank"
    );
  });

  document.getElementById("search-button").addEventListener("click", () => {
    console.log(`search-button click`);
    gSearchPanel.open();
  });

  setupSpatialNavigation();

  let timer = new MinuteTimer();
  timer.addEventListener("tick", updateClock);
  updateClock();
});

function setupSpatialNavigation() {
  SpatialNavigation.init();
  // Define navigable elements
  SpatialNavigation.add("shortcuts", { selector: ".favorite" });
  SpatialNavigation.add("status-bar", { selector: "sl-icon-button" });
  SpatialNavigation.add("search", { selector: "sl-input" });

  document
    .getElementById("search-box")
    .addEventListener("sn:willunfocus", (event) => {
      // Back to the status-bar, close the search panel
      if (event.detail.nextSectionId == "status-bar") {
        gSearchPanel.close();
      }
    });

  // Make the *currently existing* navigable elements focusable.
  SpatialNavigation.makeFocusable("shortcuts");
  // Focus the first navigable element.
  SpatialNavigation.focus();

  document.addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
      document.activeElement.click();
    }
  });
}

function updateClock() {
  let now = Date.now();
  document.getElementById("date-time").textContent = new Intl.DateTimeFormat(
    "default",
    {
      dateStyle: "medium",
      timeStyle: "short",
      // timeZone: this.tz,
    }
  ).format(now);
}

// A timer that will tick at every new minute.
// It fires a "tick" event when time is up.
class MinuteTimer extends EventTarget {
  constructor() {
    super();
    // console.log(`MinuteTimer::constructor`);
    this.suspended = false;
    this.schedule();
  }

  schedule() {
    // console.log(`MinuteTimer::schedule suspended=${this.suspended}`);
    if (this.suspended) {
      return;
    }

    let now = new Date();
    // 61 to help with triggering early during the next minute.
    let seconds = 61 - now.getSeconds();

    // console.log(`MinuteTimer: will tick in ${seconds}s`);

    this.nextTick = window.setTimeout(() => {
      this.dispatchEvent(new CustomEvent("tick"));
      this.nextTick = null;
      this.schedule();
    }, seconds * 1000);
  }

  suspend() {
    if (this.nextTick) {
      window.clearTimeout(this.nextTick);
      this.nextTick = null;
    }
    this.suspended = true;
  }

  resume() {
    if (!this.suspended) {
      return;
    }

    this.suspended = false;
    this.schedule();
  }
}

// TODO: use the content manager for bookmarks?
async function addToHome(data) {
  console.log(`add-to-home data: ${JSON.stringify(data)}`);

  return true;
}
