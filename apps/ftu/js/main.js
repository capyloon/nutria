function elem(id) {
  return document.getElementById(id);
}

// A wrapper for a <sl-drawer> that adds common behavior:
// - lazy load the content from a <template>
// - load the dependencies for the panel
// - hook up the footer [back], [ok] and [done] buttons.
// - disable panel closing.
// - set initial focus to the element with the ".initial-focus" class.
class PanelWrapper {
  constructor(node, graph) {
    this.panel = node;
    this.name = node.getAttribute("id");
    this.loaded = false;
    this.graph = graph;

    const events = ["sl-show", "sl-initial-focus", "sl-request-close"];
    events.forEach((eventName) => this.panel.addEventListener(eventName, this));
  }

  async handleEvent(event) {
    // Load the template in the panel, and manage Ok / Back buttons.
    if (!this.loaded && event.type === "sl-show") {
      await this.graph.waitForDeps(this.name);

      let template = elem(`${this.name}-tmpl`);
      this.panel.append(template.content.cloneNode(true));

      this.panel
        .querySelector("sl-button[data-l10n-id = btn-back]")
        .addEventListener("click", () => history.back());

      let btnOk = this.panel.querySelector("sl-button[data-l10n-id = btn-ok]");
      btnOk?.addEventListener("click", () => {
        window.location.hash = "#" + this.panel.getAttribute("next");
      });

      let btnDone = this.panel.querySelector(
        "sl-button[data-l10n-id = btn-done]"
      );
      btnDone?.addEventListener("click", () => {
        window.close();
      });

      this.loaded = true;
    }

    if (event.type === "sl-initial-focus") {
      let toFocus = this.panel.querySelector(".initial-focus");
      if (toFocus) {
        event.preventDefault();
        toFocus.focus();
      }
    } else if (event.type === "sl-request-close") {
      event.preventDefault();
    }
  }
}

var gDepGraph;

document.addEventListener("DOMContentLoaded", async () => {
  console.log(`Starting ftu`);

  await depGraphLoaded;

  let graph = new ParallelGraphLoader(addShoelaceDeps(kDeps));
  await Promise.all([getSharedDeps("shared-all"), graph.waitForDeps("intro")]);

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
  // TODO: share with display_panel.
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

  // Get the list of drawers based on the set of templates.
  let templates = Array.from(document.querySelectorAll("template")).map(
    (template) => template.getAttribute("id").split("-")[0]
  );

  let wrappers = new Map();

  // Create the <sl-drawer> elements.
  let prev = null;
  templates.forEach((name) => {
    let node = document.createElement("sl-drawer");
    node.setAttribute("id", `${name}-panel`);
    node.setAttribute("no-header", "true");
    if (prev) {
      prev.setAttribute("next", name);
    }
    prev = node;
    document.body.append(node);
    let wrapper = new PanelWrapper(node, graph);
    wrappers.set(name, wrapper);
  });

  // Will open only the panel for that #hash
  window.addEventListener(
    "hashchange",
    () => {
      let hash = window.location.hash;
      let name = hash === "" ? "" : hash.substring(1) + "-panel";

      for (let wrapper of wrappers.values()) {
        if (wrapper.name === name) {
          wrapper.panel.show();
        } else {
          wrapper.panel.hide();
        }
      }
    },
    false
  );

  elem("btn-start").onclick = () => {
    window.location.hash = "#language";
  };
});
