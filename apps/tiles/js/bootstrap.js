const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: [
      "shared-fluent",
      "shoelace-light-theme",
      "shoelace-setup",
      "shoelace-tree",
      "shoelace-tree-item",
      "shoelace-textarea",
      "shoelace-button",
      "shoelace-tab",
      "shoelace-tab-group",
      "shoelace-tab-panel",
      "shoelace-split-panel",
    ],
  },
  {
    name: "content manager",
    kind: "sharedWindowModule",
    param: ["js/content_manager.js", "contentManager", "ContentManager"],
    deps: ["shared-api-daemon"],
  },
];

function log(msg) {
  console.log(`Tiles: ${msg}`);
}

var graph;

document.addEventListener("DOMContentLoaded", async () => {
  console.log(`DOMContentLoaded`);
  await depGraphLoaded;
  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));

  await graph.waitForDeps("main");

  document.getElementById("tabs").show("file-1");

  document.querySelector(
    `#start sl-button[data-l10n-id=action-start-new]`
  ).onclick = startNew;

  document.body.classList.add("ready");
});

function startNew() {
  document.getElementById("start").classList.add("hidden");
  document.getElementById("ui").classList.remove("hidden");
  let editor = new TileEditor();
  editor.onNewTile();
}

class TileEditor {
  constructor() {
    ace.config.set("useStrictCSP", true);

    const actions = ["new", "launch", "publish", "import"];
    actions.forEach((action) => {
      document
        .querySelector(`#actions sl-button[data-l10n-id=action-${action}]`)
        .addEventListener("click", this);
    });

    this.tile = new Tile();
  }

  handleEvent(event) {
    let action = event.target.dataset.l10nId;
    switch (action) {
      case "action-new":
        this.onNewTile();
        break;
      case "action-publish":
        this.onPublish(event.target);
        break;
      case "action-launch":
        this.onLaunch(event.target);
        break;
      default:
        log(`Unimplemented action: ${action}`);
    }
  }

  async onPublish(target) {
    try {
      let manifestUrl = `${await this.tile?.onPublish(
        target
      )}manifest.webmanifest`;
      console.log(`ABCD manifestUrl=${manifestUrl}`);
      let service = await window.apiDaemon.getAppsManager();
      let app;
      try {
        // Check if the app is installed. getApp() expects the cached url, so instead
        // we need to get all apps and check their update url...
        let apps = await service.getAll();
        app = apps.find((app) => {
          return app.updateUrl == manifestUrl;
        });
      } catch (e) {}
      if (!app) {
        let appObject = await service.installPwa(manifestUrl);
        log(`Tile registered: ${JSON.stringify(appObject)}`);
      } else {
        log(`This tile is already registered`);
      }
    } catch (e) {
      log(`Failed to publish tile: ${e}`);
    }
  }

  async onLaunch(target) {
    this.tile?.onLaunch(target);
  }

  async onNewTile() {
    // Cleanup the UI.
    let files = document.getElementById("files");
    files.innerHTML = "";
    let tabs = document.getElementById("tabs");
    tabs.innerHTML = "";

    document.getElementById("tile-name").textContent = "";

    // Reset the tile state.
    this.tile.reset();
    await this.tile.fromNew();
    await this.tile.open("/manifest.webmanifest");
  }
}

// A tile is made of a manifest and a set of resources.
// The manifest is also a resource but gets special treatment
// since it's the Tile "root" and needs to include references
// to other resources.
class Tile {
  constructor() {
    this.reset();
  }

  reset() {
    this.manifest = null;
    this.resources = new Set(); // The resource list.
    this.content = new Map(); // Maps resource names to content, to allow lazy loading of content.
    this.root = null;
  }

  async ensureResource(fullPath, kind = "text") {
    let content = this.content.get(fullPath);
    if (!content) {
      let response = await fetch(`${fullPath}`);
      if (kind === "text") {
        content = await response.text();
        this.content.set(fullPath, content);
      } else if (kind === "json") {
        content = await response.json();
      } else if (kind === "blob") {
        content = await response.blob();
      } else {
        log(`Invalid kind: ${kind}`);
        return null;
      }
    } else {
      if (kind === "json") {
        content = JSON.parse(content);
      } else if (kind === "blob") {
        content = new Blob([content]);
      }
    }
    return content;
  }

  async onLaunch(target) {
    // Get the start url from the manifest.
    this.manifest = this.ensureResource(
      `${this.root}/manifest.webmanifest`,
      "json"
    );
    let startUrl = this.manifest.start_url || "/index.html";
    let url = new URL(startUrl, await this.onPublish(target));
    window.open(url, "_blank");
  }

  saveAllEditors() {
    let panels = document
      .getElementById("tabs")
      ?.querySelectorAll("sl-tab-panel");
    panels?.forEach((panel) => {
      let resource = panel.getAttribute("name");
      this.content.set(`${this.root}${resource}`, panel.editor.getValue());
    });
  }

  // Publishes the resources to the local IPFS node.
  async onPublish(target) {
    this.saveAllEditors();

    // TODO: netter progress UI.
    target.setAttribute("loading", "true");

    let ipfsUrl = null;
    try {
      // Build the multipart form.
      let form = new FormData();
      let i = 0;
      for (let resource of this.resources) {
        let skip = this.root.length;
        log(`Will add ${resource.substring(skip + 1)} to form data`);
        let blob = await this.ensureResource(resource, "blob");
        form.append(`field-${i}`, blob, `${resource.substring(skip + 1)}`);
        i += 1;
      }

      // POST the content.
      const url = "ipfs://localhost/ipfs/";
      const response = await fetch(url, {
        method: "POST",
        body: form,
      });
      console.log(response.status, response.statusText);
      for (let header of response.headers) {
        if (header[0] == "location") {
          ipfsUrl = header[1];
          console.log(`url is ${ipfsUrl}`);
        }
      }
    } catch (e) {
      log(e);
    }

    target.removeAttribute("loading");
    // Replace ipfs:// by tile://
    ipfsUrl = `tile://${ipfsUrl.substring(7)}`;
    return ipfsUrl;
  }

  iconForResource(resource) {
    let icon = "file";
    if (resource.endsWith(".json") || resource.endsWith(".webmanifest")) {
      icon = "file-json";
    } else if (resource.endsWith(".html")) {
      icon = "file-code";
    } else if (resource.endsWith(".js")) {
      icon = "file-text";
    } else if (resource.endsWith(".css")) {
      icon = "file-type";
    } else if (resource.endsWith(".svg")) {
      icon = "file-image";
    }
    return icon;
  }

  async fromNew() {
    let root = (this.root = "/resources/new-tile");
    try {
      this.manifest = await (
        await fetch(`${root}/manifest.webmanifest`)
      ).json();
      document.getElementById("tile-name").textContent =
        this.manifest.description;

      this.resources.add(`${root}/manifest.webmanifest`);
      this.content.set(
        `${root}/manifest.webmanifest`,
        JSON.stringify(this.manifest, null, "  ")
      );

      this.manifest.tile?.resources?.forEach((resource) => {
        this.resources.add(`${root}${resource}`);
      });

      // Build the tree.
      let files = document.getElementById("files");
      let tree = document.createElement("sl-tree");
      let dirs = new Map(); // dir path -> DOM node mapping.
      dirs.set("/", tree);

      let allResources = ["/manifest.webmanifest"];
      allResources = allResources.concat(this.manifest.tile?.resources);

      allResources.forEach((resource) => {
        let container = tree;
        // Get the path without a trailing
        let parts = resource.split("/");
        let leafName = parts.pop();
        // Ensure the whole path exists.
        let currentPath = "/";
        for (let part of parts) {
          currentPath = currentPath + part;
          if (dirs.has(currentPath)) {
            container = dirs.get(currentPath);
          } else {
            let newDir = document.createElement("sl-tree-item");
            let icon = document.createElement("sl-icon");
            icon.setAttribute("name", "folder");
            newDir.append(icon);
            newDir.append(document.createTextNode(part));
            dirs.set(currentPath, newDir);
            container.append(newDir);
            container = newDir;
          }
        }

        let leaf = document.createElement("sl-tree-item");
        let icon = document.createElement("sl-icon");
        icon.setAttribute("name", this.iconForResource(leafName));
        leaf.append(icon);
        leaf.append(document.createTextNode(leafName));

        leaf.addEventListener("dblclick", async () => {
          await this.open(resource);
        });
        container.append(leaf);
      });

      files.append(tree);
    } catch (e) {
      log(`Failed to load tile resouce: ${e}`);
    }
  }

  findPanel(tabs, resource) {
    let existing = tabs.querySelectorAll(`sl-tab-panel`);
    if (existing) {
      for (let panel of existing) {
        if (panel.getAttribute("name") == resource) {
          return panel;
        }
      }
    }
    return null;
  }

  async open(resource) {
    log(`open ${resource}`);
    let fullPath = `${this.root}${resource}`;

    if (!this.resources.has(fullPath)) {
      log(`Can't open unknown resource: ${resource}`);
      return;
    }

    // Check if that resource is already opened.
    let tabs = document.getElementById("tabs");
    let existing = tabs.querySelectorAll(`sl-tab`);
    if (existing) {
      for (let tab of existing) {
        if (tab.getAttribute("panel") == resource) {
          tabs.show(resource);
          return;
        }
      }
    }

    try {
      // Retrieve the content if needed.
      let content = await this.ensureResource(fullPath);

      // Add a tab
      let nav = document.createElement("sl-tab");
      nav.setAttribute("slot", "nav");
      nav.setAttribute("closable", "true");
      nav.setAttribute("panel", resource);
      nav.textContent = resource.split("/").pop();
      nav.addEventListener(
        "sl-close",
        (event) => {
          // Find the matching panel, and remove both the panel and the nav.
          let panel = this.findPanel(tabs, resource);
          if (panel) {
            let active = panel.active;
            this.content.set(fullPath, panel.editor.getValue());
            panel.remove();
            event.target.remove();
            if (active) {
              tabs.show(
                tabs.querySelectorAll("sl-tab")?.[0].getAttribute("panel")
              );
            }
          }
        },
        { once: true }
      );
      tabs.append(nav);

      let panel = document.createElement("sl-tab-panel");
      panel.setAttribute("name", resource);
      let editor = document.createElement("div");
      editor.classList.add("text-editor");
      panel.append(editor);
      tabs.append(panel);
      panel.editor = ace.edit(editor);
      panel.editor.setTheme("ace/theme/twilight");

      // Simple file extension -> syntax mapping.
      let mode = "text";
      if (resource.endsWith(".json") || resource.endsWith(".webmanifest")) {
        mode = "json";
      } else if (resource.endsWith(".html")) {
        mode = "html";
      } else if (resource.endsWith(".js")) {
        mode = "javascript";
      } else if (resource.endsWith(".css")) {
        mode = "css";
      } else if (resource.endsWith(".svg")) {
        mode = "svg";
      }

      panel.editor.session.setMode(`ace/mode/${mode}`);
      panel.editor.setValue(content);
      panel.editor.selection.clearSelection();
      window.setTimeout(() => tabs.show(resource), 0);
    } catch (e) {
      log(`Failed to open resource ${resource}: ${e}`);
    }
  }
}
