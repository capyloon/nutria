/* Main screen component, encapsulating most logic */

class MainScreen extends LitElement {
  constructor() {
    super();

    this.data = null;
    this.resourcePath = null;
    this.editMode = false;
    this.isContainer = false;
    this.isPublishedOnIpfs = false;

    // When in file picker mode, contains the mime type filter.
    this.fileFilter = null;
    // When in file picker mode, a { resolve, reject } object.
    this.filePicker = null;

    addEventListener("popstate", (event) => {
      this.switchTo(event.state, true);
    });
  }

  log(msg) {
    console.log(`Files[MainScreen] ${msg}`);
  }

  error(msg) {
    console.error(`Files[MainScreen] ${msg}`);
  }

  static get properties() {
    return {
      data: { state: true },
      resourcePath: { state: true },
      editMode: { type: Boolean },
      isContainer: { type: Boolean },
      isPublishedOnIpfs: { type: Boolean },
    };
  }

  enterFilePickerMode(data, defered) {
    this.fileFilter = data.type;
    this.filePickerBroadcast = !!data.forBroadcast;
    this.filePicker = defered;
  }

  closeApp() {
    this.filePicker?.reject();

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
        this.resourcePath.push(
          html`<sl-breadcrumb-item data-id="${id}">${path}</sl-breadcrumb-item>`
        );
      }
    });
  }

  async openRoot() {
    let svc = await contentManager.getService();

    let root = await svc.getRoot();
    let data = { container: true, id: root.id };
    history.replaceState(data, "");
    await this.switchTo(data, true);
  }

  // Returns the mime type of the default variant for this id.
  async defaultMimeType(id) {
    let svc = await contentManager.getService();
    let meta = await svc.getMetadata(id);
    return meta.variants.find((variant) => variant.name == "default")?.mimeType;
  }

  async switchTo(data, fromPopState = false) {
    if (!data) {
      return;
    }

    if (!fromPopState) {
      history.pushState(data, "");
    }

    this.data = data;
    this.renderer = null;

    if (data.container) {
      // Create a container renderer.
      let { ContainerRenderer } = await import(
        "/components/container_renderer.js"
      );
      this.renderer = new ContainerRenderer(data.id, this.fileFilter);
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
      this.isPublishedOnIpfs = false;
    } else {
      this.isContainer = false;
      let resource = await contentManager.resourceFromId(data.id);
      this.isPublishedOnIpfs = !!resource.meta.tags.find((tag) =>
        tag.startsWith(".ipfs://")
      );

      if (data.mimeType.startsWith("image/")) {
        let { ImageRenderer } = await import("/components/image_renderer.js");
        this.renderer = new ImageRenderer(resource);
      } else if (data.mimeType.startsWith("video/")) {
        let { VideoRenderer } = await import("/components/video_renderer.js");
        this.renderer = new VideoRenderer(resource);
      } else {
        this.log(`Using default renderer for mime type '${data.mimeType}'`);
        let { DefaultRenderer } = await import(
          "/components/default_renderer.js"
        );
        this.renderer = new DefaultRenderer(resource);
      }
    }

    this.buildBreadCrumb(data.id);
  }

  async enterEditMode() {
    // Trigger an activity to process the resource.
    try {
      let resource = await contentManager.resourceFromId(this.data.id);
      let response = await fetch(resource.variantUrl());
      let blob = await response.blob();

      let suffix = blob.type.split("/")[0];
      let activity = new WebActivity(`process-${suffix}`, { blob });
      let result = await activity.start();
      await resource.update(result);
      // Update the rendered resource.
      this.renderer?.updateResource();
    } catch (e) {
      console.error(`Error during resource edition: ${e}`);
    }
  }

  enterEditMode_old() {
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

  async uploadResource() {
    // Copy the resource to the "shared on ipfs" folder and let the IPFS
    // publisher module take care of the actual upload.
    try {
      let target = await contentManager.ensureTopLevelContainer(
        "shared on ipfs"
      );
      let svc = await contentManager.getService();
      let _meta = await svc.copyResource(this.data.id, target);
    } catch (e) {
      this.error(JSON.stringify(e));
    }
  }

  async shareResource() {
    // Download the resource as a Blob, and trigger the "share" activity.
    try {
      let resource = await contentManager.resourceFromId(this.data.id);
      let response = await fetch(resource.variantUrl());
      let blob = await response.blob();
      this.log(`Sharing blob ${blob.type} ${blob.size}`);
      let activity = new WebActivity("share", {
        type: blob.type.split("/")[0],
        blob,
        name: resource.meta.name,
      });
      await activity.start();
    } catch (e) {
      this.error(
        `Failed to share resource ${this.data.id}: ${JSON.stringify(e)}`
      );
    }
  }

  async getBroadcastTicket() {
    // Get the native path of the resource and "provide" it through Iroh.
    try {
      let svc = await contentManager.getService();
      let path = await svc.nativePath(this.data.id, "default");
      let mime = await this.defaultMimeType(this.data.id);

      if (!this.dweb) {
        this.dweb = await apiDaemon.getDwebService();
      }
      let ticket = await this.dweb.broadcastFile(path, mime);
      return ticket;
    } catch (e) {
      this.error(
        `Failed to broadcast resource ${this.data.id}: ${JSON.stringify(e)}`
      );
      console.error(`Failed to broadcast resource ${this.data.id}`, e);
    }
  }

  async broadcastResource() {
    // Get the native path of the resource and "provide" it through Iroh.
    try {
      let ticket = await this.getBroadcastTicket();
      this.log(`Ticket is http://localhost:8081/dweb/${ticket}`);
      let share = new WebActivity("share", { url: `ticket:${ticket}` });
      await share.start();
    } catch (e) {
      this.error(
        `Failed to broadcast resource ${this.data.id}: ${JSON.stringify(e)}`
      );
      console.error(`Failed to broadcast resource ${this.data.id}`, e);
    }
  }

  async pickResource() {
    // Download the resource as a Blob, and return it as the activity result.
    if (!this.filePicker) {
      return;
    }

    try {
      let resource = await contentManager.resourceFromId(this.data.id);
      // If we are asked a broadcastable resource, don't fetch the blob.
      if (this.filePickerBroadcast) {
        let ticket = await this.getBroadcastTicket();
        this.filePicker.resolve({ ticket, name: resource.meta.name });
      } else {
        let response = await fetch(resource.variantUrl());
        let blob = await response.blob();
        this.filePicker.resolve(blob);
      }
    } catch (e) {
      this.error(
        `Failed to pick resource ${this.data.id}: ${JSON.stringify(e)}`
      );
      this.filePicker.reject();
    }
    window.close();
  }

  render() {
    this.log(`render editMode=${this.editMode}`);
    let content = this.renderer || html`<div></div>`;

    let filePickerClass = this.filePicker ? "hidden" : "";

    return html`<link rel="stylesheet" href="components/main_screen.css" />
      <sl-breadcrumb @click="${this.switchPath}"
        >${this.resourcePath}</sl-breadcrumb
      >
      <div id="main">${content}</div>
      <footer class="${this.editMode || this.isContainer ? "hidden" : ""}">
        <div
          @click="${this.enterEditMode}"
          class="${!this.filePicker && this.renderer?.canEdit()
            ? ""
            : "hidden"}"
        >
          <sl-icon-button name="edit"></sl-icon-button>
        </div>
        <div @click="${this.uploadResource}" class="${filePickerClass}">
          ${this.isPublishedOnIpfs
            ? html`<sl-icon-button disabled name="upload"></sl-icon-button>`
            : html`<sl-icon-button name="upload"></sl-icon-button>`}
        </div>
        <div @click="${this.shareResource}" class="${filePickerClass}">
          <sl-icon-button name="share-2"></sl-icon-button>
        </div>
        <div @click="${this.broadcastResource}" class="${filePickerClass}">
          <sl-icon-button name="airplay"></sl-icon-button>
        </div>
        <div @click="${this.deleteResource}" class="${filePickerClass}">
          <sl-icon-button name="trash-2"></sl-icon-button>
        </div>
        <div
          @click="${this.pickResource}"
          class="${this.filePicker ? "" : "hidden"}"
        >
          <sl-icon-button name="check"></sl-icon-button>
        </div>
        <div @click="${this.closeApp}">
          <sl-icon-button name="x"></sl-icon-button>
        </div>
      </footer>`;
  }
}

customElements.define("main-screen", MainScreen);
