function elem(id) {
  return document.getElementById(id);
}

const bootstrapEvent = new CustomEvent('bootstrap', {});

async function processLocation() {
  let sections = this.document.querySelectorAll("section");
  sections.forEach(i => {
    i.classList.add("hidden");
  });

  if (window.location.hash === "") {
    elem("main").classList.remove("hidden");
  } else {
    let name = window.location.hash.substring(1);
    let panel = elem(name);
    if (!panel) {
      elem("main").classList.remove("hidden");
      return;
    }

    if (panel.classList.contains("loaded")) {
      panel.classList.remove("hidden");
    } else {
      elem("spinner").classList.remove("hidden");
      await import(`/panels/${name}/js/bootstrap.js`);
      fetch(`/panels/${name}/index.html`)
      .then((response) => response.text())
      .then((html) => {
          panel.innerHTML = html;
          elem("spinner").classList.add("hidden");
          panel.dispatchEvent(bootstrapEvent);
          panel.classList.remove("hidden");
          panel.classList.add("loaded");
      })
      .catch(console.error);
    }
  }
}

var gDepGraph;

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    await depGraphLoaded;

    let graph = new ParallelGraphLoader(addShoelaceDeps(kDeps));
    await Promise.all([getSharedDeps("shared-all"), graph.waitForDeps("settings")]);

    gDepGraph = graph;

    const { registerIconLibrary } = await import(
      `http://shared.localhost:${location.port}/shoelace/utilities/icon-library.js`
    );

    // Use the Lucide icons as the default ones to be consistent.
    registerIconLibrary("default", {
      resolver: (name) =>
        `http://shared.localhost:${location.port}/lucide/icons/${name}.svg`,
    });

    // Setup dark mode if needed.
    let settings = await apiDaemon.getSettings();
    let isDarkMode = false;
    try {
      let result = await settings.get("ui.prefers.color-scheme");
      isDarkMode = result.value === "dark";
    } catch (e) {}
    if (isDarkMode) {
      await gDepGraph.waitForDeps("shoelace-dark-theme");
      document.documentElement.classList.add("sl-theme-dark");
    } else {
      document.documentElement.classList.remove("sl-theme-dark");
    }

    elem("main-menu").addEventListener("sl-select", async (e) => {
      window.location.hash = "#" + e.detail.item.value;
    });

    window.addEventListener('hashchange', processLocation, false);
    await processLocation();
  },
  { once: true }
);
