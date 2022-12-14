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

  setContactsManager(manager) {
    this.contactsManager = manager;
  }

  async handleEvent(event) {
    // Load the template in the panel, and manage Ok / Back buttons.
    if (!this.loaded && event.type === "sl-show") {
      await this.graph.waitForDeps(this.name);

      let template = elem(`${this.name}-tmpl`);
      this.panel.append(template.content.cloneNode(true));

      this.loaded = true;
      this.panel.dispatchEvent(
        new CustomEvent("panel-ready", { detail: this.contactsManager })
      );
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
  async function ensureDrawer() {
    if (!drawerLoaded) {
      await graph.waitForDeps("shoelace-drawer");
      drawerLoaded = true;
    }
  }

  window.requestIdleCallback(async () => {
    await ensureDrawer();
  });

  // Will open only the panel for that #hash
  window.addEventListener(
    "hashchange",
    async () => {
      let hash = window.location.hash;
      let name = hash === "" ? "" : hash.substring(1) + "-panel";

      await ensureDrawer();

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

  // Hook up the "New contact" button.
  elem("action-add-contact").addEventListener("click", () => {
    window.location.hash = `#add`;
  });

  manageList(wrappers);
});

async function manageList(wrappers) {
  await contentManager.as_superuser();

  let manager = contentManager.getContactsManager((contacts) => {
    console.log(`Contacts list updated: ${contacts.length} contacts`);
    elem("main-title").setAttribute(
      "data-l10n-args",
      JSON.stringify({ count: contacts.length })
    );

    let list = elem("contact-list");
    list.innerHTML = "";
    for (let contact of contacts) {
      let el = list.appendChild(new ContactInfo(contact));
      el.addEventListener("delete-contact", () => {
        manager.deleteContact(contact);
      });
    }

    document.body.classList.add("ready");
  });

  await manager.init();

  for (let wrapper of wrappers.values()) {
    wrapper.setContactsManager(manager);
  }
}
