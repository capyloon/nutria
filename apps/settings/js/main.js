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

  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));
  await Promise.all(
    ["shared-api-daemon", "shared-fluent", "intro"].map((dep) =>
      graph.waitForDeps(dep)
    )
  );

  let panelMenu = elem("panel-menu");
  [
    { name: "language", icon: "languages" },
    { name: "wifi", icon: "wifi" },
    { name: "telephony", icon: "phone" },
    { name: "datetime", icon: "clock" },
    { name: "lockscreen", icon: "lock" },
    { name: "privacy", icon: "venetian-mask" },
    { name: "search", icon: "search" },
    { name: "apps", icon: "layout-grid" },
    { name: "webext", icon: "layout-dashboard" },
    { name: "display", icon: "image" },
    { name: "identity", icon: "users" },
    { name: "dweb", icon: "cloud-off" },
    { name: "systeminfo", icon: "info" },
  ].forEach((panel) => {
    let item = document.createElement("sl-menu-item");
    item.dataset.panel = panel.name;
    let title = document.createElement("span");
    title.setAttribute("data-l10n-id", `${panel.name}-title`);
    item.append(title);
    let icon = document.createElement("sl-icon");
    icon.setAttribute("name", panel.icon);
    icon.setAttribute("slot", "prefix");
    item.append(icon);
    panelMenu.append(item);
  });

  panelMenu.addEventListener("sl-select", (event) => {
    window.location.hash = `#${event.detail.item.dataset.panel}`;
  });

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
            toHide?.hide();
          },
          { once: true }
        );
        toShow.show();
      } else {
        // Going back to the first screen, just hide the previous panel.
        toHide?.hide();
      }
    },
    false
  );
});
