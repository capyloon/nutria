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
        .querySelector("sl-button.panel-back")
        .addEventListener("click", () => history.back());

      let next = this.panel.getAttribute("next");
      let btnOk = this.panel.querySelector("sl-button.panel-ok");
      btnOk?.addEventListener("click", () => {
        window.location.hash = `#${next}`;
      });

      let btnDone = this.panel.querySelector("sl-button.panel-done");
      btnDone?.addEventListener("click", () => {
        window.close();
      });

      this.loaded = true;
      this.panel.dispatchEvent(new CustomEvent("panel-ready"));

      // Preload the next panel when idle.
      if (next) {
        window.requestIdleCallback(async () => {
          await this.graph.waitForDeps(`${next}-panel`);
        });
      }
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

document.addEventListener("DOMContentLoaded", async () => {
  console.log(`Starting ftu`);

  await depGraphLoaded;

  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));
  await Promise.all(
    ["shared-api-daemon", "shared-fluent", "intro"].map((dep) =>
      graph.waitForDeps(dep)
    )
  );

  document.body.classList.add("ready");

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

  let drawerLoaded = false;

  window.requestIdleCallback(async () => {
    if (!drawerLoaded) {
      await graph.waitForDeps("shoelace-drawer");
      drawerLoaded = true;
    }
  });

  // Will open only the panel for that #hash
  window.addEventListener(
    "hashchange",
    async () => {
      let hash = window.location.hash;
      let name = hash === "" ? "" : hash.substring(1) + "-panel";

      if (!drawerLoaded) {
        await graph.waitForDeps("shoelace-drawer");
        drawerLoaded = true;
      }

      let toShow, toHide;

      for (let wrapper of wrappers.values()) {
        if (wrapper.name === name) {
          toShow = wrapper.panel;
        } else if (wrapper.panel.open) {
          toHide = wrapper.panel;
        }
      }

      // Start by showing the target panel, then hide the previous one.
      // TODO: disable the "hide" animation when toShow is no null.
      if (toShow) {
        toShow.addEventListener(
          "sl-after-show",
          () => {
            toHide.hide();
          },
          { once: true }
        );
        toShow.show();
      } else {
        // Going back to the first screen, just hide the previous panel.
        toHide.hide();
      }
    },
    false
  );

  let startPanel = "language";

  // Preload the first panel when idle.
  window.requestIdleCallback(async () => {
    await this.graph.waitForDeps(`${startPanel}-panel`);
  });

  elem("btn-start").onclick = () => {
    window.location.hash = `#${startPanel}`;
  };
});
