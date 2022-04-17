/* Main screen component, encapsulating most logic */

class MainScreen extends LitElement {
  constructor() {
    super();

    this.data = null;
    this.resourcePath = null;
    this.editMode = false;
    this.isContainer = false;
  }

  log(msg) {
    console.log(`MainScreen: ${msg}`);
  }

  error(msg) {
    console.error(`MainScreen: ${msg}`);
  }

  static get properties() {
    return {
      data: { state: true },
      resourcePath: { state: true },
      editMode: { type: Boolean },
      isContainer: { type: Boolean },
    };
  }

  closeApp() {
    window.close();
  }

  buildBreadCrumb(id) {
    // Build the breadcrumb for the resource path.
    contentManager.getService().then(async (svc) => {
      let meta = await svc.getFullPath(id);
      if (!this.homeResourceName) {
        this.homeResourceName = await document.l10n.formatValue(
          "root-resource"
        );
      }
      let paths = meta.map((item) => {
        let path = item.name != "/" ? item.name : this.homeResourceName;
        return { path, id: item.id };
      });
      this.resourcePath = [];
      for (let { path, id } of paths) {
        this.resourcePath.push(html`<sl-breadcrumb-item data-id="${id}">${path}</sl-breadcrumb-item>`);
      }
    });
  }

  async openRoot() {
    let svc = await contentManager.getService();

    let root = await svc.getRoot();
    await this.switchTo({ container: true, id: root.id });
  }

  // Returns the mime type of the default variant for this id.
  async defaultMimeType(id) {
    let svc = await contentManager.getService();
    let meta = await svc.getMetadata(id);
    return meta.variants.find((variant) => variant.name == "default")?.mimeType;
  }

  async switchTo(data) {
    if (!data) {
      return;
    }

    this.data = data;
    this.renderer = null;

    if (data.container) {
      // Create a container renderer.
      let { ContainerRenderer } = await import(
        "/components/container_renderer.js"
      );
      this.renderer = new ContainerRenderer(data.id);
      this.renderer.addEventListener("update-path", (event) => {
        this.data.id = event.detail;
        this.buildBreadCrumb(event.detail);
      });
      this.renderer.addEventListener("switch-to-leaf", async (event) => {
        let id = event.detail.id;
        let mimeType = await this.defaultMimeType(id);
        this.switchTo({ mimeType, id, container: false });
      });
      this.isContainer = true;
    } else if (data.mimeType.startsWith("image/")) {
      let { ImageRenderer } = await import("/components/image_renderer.js");
      let resource = await contentManager.resourceFromId(data.id);
      this.renderer = new ImageRenderer(resource);
      this.isContainer = false;
    } else {
      let { DefaultRenderer } = await import("/components/default_renderer.js");
      let resource = await contentManager.resourceFromId(data.id);
      this.renderer = new DefaultRenderer(resource);
      this.isContainer = false;
    }

    this.buildBreadCrumb(data.id);
  }

  enterEditMode() {
    this.log(`Entering edit mode`);
    // Use the history api to be able to exit edit mode by navigating back.
    history.pushState({ mode: "edit" }, "");
    this.editMode = true;
    this.renderer?.enterEditMode();

    window.addEventListener(
      "popstate",
      (event) => {
        this.log(`location: ${document.location}`);
        // Leaving edit mode.
        this.editMode = false;
        this.renderer?.leaveEditMode();
      },
      { once: true }
    );
  }

  async switchPath(event) {
    let newId = event.target.dataset.id;
    this.log(`switchPath ${this.data.id} -> ${newId}`);
    if (!newId || this.data.id == newId) {
      return;
    }

    this.editMode = false;

    // Get the default variant for this id.
    try {
      let svc = await contentManager.getService();
      let meta = await svc.getMetadata(newId);
      let lib = await contentManager.lib();

      if (meta.kind === lib.ResourceKind.CONTAINER) {
        this.switchTo({ id: newId, container: true });
      } else {
        let mimeType = await this.defaultMimeType(newId);
        this.switchTo({ id: newId, mimeType });
      }
    } catch (e) {
      this.error(JSON.stringify(e));
    }
  }

  async deleteResource() {
    // Once the resource is deleted, we will display its parent folder.
    // We need to get the parent id before removing the resource!

    try {
      let svc = await contentManager.getService();
      let meta = await svc.getMetadata(this.data.id);
      let parent = meta.parent;

      await svc.delete(this.data.id);

      await this.switchTo({ id: parent, container: true });
    } catch (e) {
      this.error(JSON.stringify(e));
    }
  }

  render() {
    this.log(`render editMode=${this.editMode}`);
    let content = this.renderer || html`<div></div>`;

    return html`<link rel="stylesheet" href="components/main_screen.css" />
      <sl-breadcrumb @click="${this.switchPath}">${this.resourcePath}</sl-breadcrumb>
      <div id="main">${content}</div>
      <footer class="${this.editMode || this.isContainer ? "hidden" : ""}">
        <div
          @click="${this.enterEditMode}"
          class="${this.renderer?.canEdit() ? "" : "hidden"}"
        >
          <sl-icon name="edit"></sl-icon>
        </div>
        <div>
          <sl-icon name="upload"></sl-icon>
        </div>
        <div>
          <sl-icon name="share-2"></sl-icon>
        </div>
        <div @click="${this.deleteResource}">
          <sl-icon name="trash-2"></sl-icon>
        </div>
        <div @click="${this.closeApp}">
          <sl-icon name="x"></sl-icon>
        </div>
      </footer>`;
  }
}

customElements.define("main-screen", MainScreen);
