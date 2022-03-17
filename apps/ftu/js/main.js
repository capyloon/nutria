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

      let btnOk = this.panel.querySelector("sl-button.panel-ok");
      btnOk?.addEventListener("click", () => {
        window.location.hash = "#" + this.panel.getAttribute("next");
      });

      let btnDone = this.panel.querySelector("sl-button.panel-done");
      btnDone?.addEventListener("click", () => {
        window.close();
      });

      this.loaded = true;
      this.panel.dispatchEvent(new CustomEvent("panel-ready"));
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

  let graph = new ParallelGraphLoader(addShoelaceDeps(kDeps));
  await Promise.all([getSharedDeps("shared-all"), graph.waitForDeps("intro")]);

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
