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
  {
    name: "apps manager",
    kind: "sharedWindowModule",
    param: ["js/apps_manager.js", "appsManager", "AppsManager"],
    deps: ["shared-api-daemon"],
  },
  {
    name: "fork dialog",
    kind: "script",
    param: "js/fork_dialog.js",
    deps: [
      "shoelace-dialog",
      "shoelace-select",
      "shoelace-option",
      "shoelace-input",
      "shoelace-button",
    ],
  },
  {
    name: "name editor dialog",
    kind: "script",
    param: "js/name_editor_dialog.js",
    deps: ["shoelace-dialog", "shoelace-input", "shoelace-button"],
  },
  {
    name: "context menu",
    kind: "virtual",
    deps: ["shoelace-menu", "shoelace-menu-item"],
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

  document.querySelector(
    `#start sl-button[data-l10n-id=action-start-fork]`
  ).onclick = startFork;

  document.body.classList.add("ready");
});

async function startFork() {
  try {
    await graph.waitForDeps("fork dialog");
    let dialog = new ForkDialog();
    let manifestUrl = await dialog.open();
    dialog = null;

    document.getElementById("start").classList.add("hidden");
    document.getElementById("ui").classList.remove("hidden");
    let editor = new TileEditor();
    editor.forkTileFrom(manifestUrl);
  } catch (e) {}
}

function startNew() {
  document.getElementById("start").classList.add("hidden");
  document.getElementById("ui").classList.remove("hidden");
  let editor = new TileEditor();
  editor.onNewTile();
}

class TileEditor {
  constructor() {
    ace.config.set("useStrictCSP", true);

    const actions = ["run", "publish"];
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
      case "action-run":
        this.onRun(event.target);
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

  async onRun(target) {
    this.tile?.onRun(target);
  }

  resetUi() {
    // Cleanup the UI.
    let files = document.getElementById("files");
    files.innerHTML = "";
    let tabs = document.getElementById("tabs");
    tabs.innerHTML = "";

    document.getElementById("tile-name").textContent = "";

    // Reset the tile state.
    this.tile.reset();
  }

  async onNewTile() {
    this.resetUi();
    await this.tile.fromNew();
    await this.tile.open("/manifest.webmanifest");
  }

  async forkTileFrom(manifestUrl) {
    this.resetUi();
    await this.tile.forkTileFrom(manifestUrl);
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
    let files = document.getElementById("files");
    files.addEventListener("contextmenu", this);
    this.menu = document.getElementById("context-menu");
    this.menu.addEventListener("sl-select", this);
    this.selected = null;
  }

  async handleMenuChoice(event) {
    let id = event.detail.item.getAttribute("id");
    let dataset = this.selected.dataset;
    if (id === "context-add-file") {
      await this.addFile(dataset.resource, dataset.kind);
    } else if (id === "context-add-directory") {
      await this.addDirectory(dataset.resource, dataset.kind);
    } else if (id === "context-delete-resource") {
      if (dataset.kind === "file") {
        await this.removeFile(dataset.resource);
      } else {
        await this.removeDirectory(dataset.resource);
      }
      this.selected.remove();
    } else {
      console.error(`Unexpected item selected: ${id}`);
    }

    this.menu.classList.add("hidden");
  }

  async handleContextMenu(event) {
    event.preventDefault();

    // Never remove the Tile manifest!
    if (
      !this.selected ||
      this.selected.dataset.resource == "/manifest.webmanifest"
    ) {
      return;
    }

    // Open the context menu.
    let targetRect = event.target.getBoundingClientRect();

    await graph.waitForDeps("context menu");
    this.menu.classList.remove("hidden");

    // Position the context menu.
    let menuRect = this.menu.getBoundingClientRect();
    let uiRect = document.getElementById("ui").getBoundingClientRect();

    let left = event.pageX;
    let top = event.pageY;

    if (left + menuRect.width > uiRect.width) {
      left = uiRect.width - menuRect.width - 10;
    }

    if (left < uiRect.x) {
      left = 10;
    }

    if (top + menuRect.height > uiRect.height) {
      top = uiRect.height - menuRect.height - 10;
    }

    if (top < uiRect.y) {
      top = 10;
    }

    document.getElementById("ui").addEventListener(
      "pointerdown",
      (event) => {
        let isCtxtMenu = false;
        let node = event.target;
        while (node && !isCtxtMenu) {
          node = node.parentElement;
          isCtxtMenu = node === this.menu;
        }
        if (!isCtxtMenu) {
          this.menu.classList.add("hidden");
        }
      },
      {
        capture: true,
        once: true,
      }
    );

    this.menu.style.left = `${left}px`;
    this.menu.style.top = `${top}px`;
  }

  handleEvent(event) {
    switch (event.type) {
      case "sl-selection-change":
        this.selected = event.detail.selection[0];
        break;
      case "sl-select":
        this.handleMenuChoice(event);
        break;
      case "contextmenu":
        this.handleContextMenu(event);
        break;
      default:
        console.error(`Unexpected event: ${event.type}`);
    }
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
      let response = await fetch(`${fullPath}`, { mode: "no-cors" });
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

  async onRun(target) {
    // Get the start url from the manifest.
    this.manifest = await this.ensureResource(
      `${this.root}/manifest.webmanifest`,
      "json"
    );
    let startUrl = this.manifest.start_url || "/index.html";
    let url = new URL(startUrl, await this.onPublish(target));
    window.open(url, "_blank");
  }

  // If the parent is actually a file, find and returns
  // its parent directory.
  fixupParent(parent, kind) {
    let parentPath = parent;
    let parentNode = this.selected;

    // If we add to a file, find it's parent instead.
    if (kind === "file") {
      let parts = parent.split("/");
      parts.pop();
      parentPath = `${parts.join("/")}/`;
      parentNode = this.selected.parentElement;
    }
    return { parentPath, parentNode };
  }

  async addFile(parent, kind) {
    let { parentPath, parentNode } = this.fixupParent(parent, kind);
    console.log(`Will add a file to ${parentPath}`);

    // 1. Get the new file name
    let fileName;
    try {
      await graph.waitForDeps("name editor dialog");
      let dialog = new NameEditorDialog();
      fileName = (await dialog.open("createfile")).trim();
      dialog = null;
    } catch (e) {
      return;
    }

    let resource = `${parentPath}${fileName}`;
    let fullPath = `${this.root}${resource}`;

    // 2. Update the resources set & content.
    if (this.resources.has(fullPath)) {
      console.error(`Can't add twice the same resource: ${fullPath}`);
      return;
    }
    this.resources.add(fullPath);
    this.content.set(fullPath, "");

    // 3. Add the DOM node.
    // TODO: factor out.
    let leaf = document.createElement("sl-tree-item");
    leaf.dataset.kind = "file";
    leaf.dataset.resource = resource;
    let icon = document.createElement("sl-icon");
    icon.setAttribute("name", this.iconForResource(fileName));
    leaf.append(icon);
    leaf.append(document.createTextNode(fileName));
    leaf.addEventListener("dblclick", async () => {
      await this.open(resource);
    });
    parentNode.append(leaf);

    // 4. Update the manifest file list.
    await this.ensureManifest();
    this.manifest.tile.resources.push(resource);
    this.manifest.tile.resources.sort();
    let manifest = JSON.stringify(this.manifest, null, 2);
    this.content.set(`${this.root}/manifest.webmanifest`, manifest);

    // 5. Update the manifest panel if it is open.
    let tabs = document.getElementById("tabs");
    let panel = this.findPanel(tabs, "/manifest.webmanifest");
    if (panel) {
      panel.editor.setValue(manifest);
    }
  }

  async addDirectory(parent, kind) {
    let { parentPath, parentNode } = this.fixupParent(parent, kind);

    // Directories don't have a real resource attached to them, only
    // a DOM node.
    console.log(`Will add a subdirectory to ${parentPath}`);

    let dirName;
    try {
      await graph.waitForDeps("name editor dialog");
      let dialog = new NameEditorDialog();
      dirName = (await dialog.open("createdir")).trim();
      dialog = null;
    } catch (e) {
      return;
    }

    if (!dirName.length) {
      return;
    }

    // TODO: factor out.
    let newDir = document.createElement("sl-tree-item");
    newDir.dataset.kind = "directory";
    newDir.dataset.resource = `/${dirName}/`;
    let icon = document.createElement("sl-icon");
    icon.setAttribute("name", "folder");
    newDir.append(icon);
    newDir.append(document.createTextNode(dirName));
    parentNode.append(newDir);
  }

  async removeDirectory(resource) {
    let fullPath = `${this.root}${resource}`;

    // Iterate over the full set of resources to find the ones that are under this directory.
    let toDelete = [];
    this.resources.forEach((name) => {
      if (name.startsWith(fullPath)) {
        toDelete.push(name.substring(this.root.length));
      }
    });

    // Delete each file.
    for (let item of toDelete) {
      await this.removeFile(item);
    }
  }

  async removeFile(resource) {
    let fullPath = `${this.root}${resource}`;

    // 1. Check that this file exists.
    if (!this.resources.has(fullPath)) {
      console.error(`Can´t remove unknown resource: ${resource}`);
      return;
    }

    // 2. Remove all references to that file where needed.
    this.resources.delete(fullPath);
    this.content.delete(fullPath);

    // 3. Update the manifest.
    await this.ensureManifest();

    let resources = this.manifest.tile.resources.filter(
      (item) => item != resource
    );
    this.manifest.tile.resources = resources;

    let manifest = JSON.stringify(this.manifest, null, 2);
    this.content.set(`${this.root}/manifest.webmanifest`, manifest);

    // 4. Update the manifest panel if it is open.
    let tabs = document.getElementById("tabs");
    let panel = this.findPanel(tabs, "/manifest.webmanifest");
    if (panel) {
      panel.editor.setValue(manifest);
    }
  }

  async ensureManifest() {
    // If the manifest is open in a panel, get the value from the editor
    // since it may have changed.
    let tabs = document.getElementById("tabs");
    let panel = this.findPanel(tabs, "/manifest.webmanifest");
    if (panel) {
      this.content.set(
        `${this.root}/manifest.webmanifest`,
        panel.editor.getValue()
      );
    }

    this.manifest = await this.ensureResource(
      `${this.root}/manifest.webmanifest`,
      "json"
    );
  }

  async saveAllEditors() {
    let panels = document
      .getElementById("tabs")
      ?.querySelectorAll("sl-tab-panel");
    panels?.forEach((panel) => {
      let resource = panel.getAttribute("name");
      this.content.set(`${this.root}${resource}`, panel.editor.getValue());
    });

    await this.ensureManifest();

    this.updateTitle();
  }

  // Publishes the resources to the local IPFS node.
  async onPublish(target) {
    await this.saveAllEditors();

    // TODO: better progress UI.
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

  updateTitle() {
    document.getElementById("tile-name").textContent =
      this.manifest.description;
  }

  async fromNew() {
    await this.forkTileFrom("/resources/new-tile/manifest.webmanifest");
  }

  async forkTileFrom(manifestUrl) {
    let root = manifestUrl.replace("/manifest.webmanifest", "");
    this.root = root;
    try {
      let response = await fetch(manifestUrl, { mode: "no-cors" });
      this.manifest = await response.json();
      this.updateTitle();

      this.resources.add(manifestUrl);
      this.content.set(manifestUrl, JSON.stringify(this.manifest, null, "  "));

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
            newDir.dataset.kind = "directory";
            newDir.dataset.resource = `/${part}/`;
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
        leaf.dataset.kind = "file";
        leaf.dataset.resource = resource;
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

      tree.addEventListener("sl-selection-change", this);
    } catch (e) {
      log(`Failed to load tile resource: ${e}`);
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

  updateTitleFromEditor(editor) {
    try {
      this.manifest = JSON.parse(editor.getValue());
      document.getElementById("tile-name").textContent =
        this.manifest.description;
    } catch (e) {}
  }

  async open(resource) {
    log(`open ${resource}`);
    let fullPath = `${this.root}${resource}`;

    if (!this.resources.has(fullPath)) {
      log(`Can't open unknown resource: ${resource} ${fullPath}`);
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
              let firstPanel = tabs
                .querySelectorAll("sl-tab")?.[0]
                ?.getAttribute("panel");
              if (firstPanel) {
                tabs.show(firstPanel);
              }
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

      if (resource == "/manifest.webmanifest") {
        // Setup a change listener to update the title if needed.
        panel.editor.on("change", () => {
          try {
            this.manifest = JSON.parse(panel.editor.getValue());
            document.getElementById("tile-name").textContent =
              this.manifest.description;
          } catch (e) {}
        });
      }
    } catch (e) {
      log(`Failed to open resource ${resource}: ${e}`);
    }
  }
}
