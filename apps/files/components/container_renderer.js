/* renderer component for containers */

export class ContainerRenderer extends LitElement {
  constructor(id, filter) {
    super();
    this.id = id;
    this.getItems();
    this.iconLayout = false;
    this.selected = new Set();
    this.selectedCount = 0;
    this.filter = filter;
  }

  log(msg) {
    console.log(`ContainerRenderer: ${msg}`);
  }

  static get properties() {
    return {
      items: { state: true },
      iconLayout: { state: true },
      selectedCount: { state: true, type: Number },
    };
  }

  async getItems() {
    let svc = await contentManager.getService();
    let lib = await contentManager.lib();
    let cursor = await svc.childrenOf(this.id);
    let items = [];
    let done = false;
    while (!done) {
      try {
        let children = await cursor.next();
        for (let child of children) {
          items.push(child);
        }
      } catch (e) {
        // cursor.next() rejects when no more items are available, so it's not
        // a fatal error.
        // this.error(`Cursor error: ${JSON.stringify(e)}`);
        done = true;
      }
    }
    cursor.release();

    this.items = [];

    for (let item of items) {
      const isFolder = item.kind === lib.ResourceKind.CONTAINER;

      // filter out files that don't match the pick activity.
      if (!isFolder && this.filter) {
        let defaultMime = item.variants.find(
          (variant) => variant.name == "default"
        )?.mimeType;
        // TODO: better filtering
        if (!defaultMime.startsWith(this.filter)) {
          continue;
        }
      }

      // Add up the size of all variants.
      let fullSize = 0;
      if (isFolder) {
        fullSize = await svc.containerSize(item.id);
      } else {
        fullSize = item.variants
          .map((item) => item.size)
          .reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          );
      }
      let size = contentManager.formatSize(fullSize);

      // Manually apply offset to UTC since we have no guarantee that
      // anything else but `UTC` will work in DateTimeFormat.
      let modified =
        item.modified.getTime() - new Date().getTimezoneOffset() * 60 * 1000;
      const timeFormat = new Intl.DateTimeFormat("default", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: "UTC",
        hour12: false,
      });

      let kind = await contentManager.iconForResource(item);

      let isPublishedOnIpfs = !!item.tags.find((tag) =>
        tag.startsWith(".ipfs://")
      );
      let qrCode = isPublishedOnIpfs
        ? html`<sl-icon @click="${this.onQrCode}" name="qr-code"></sl-icon>`
        : "";

      this.items.push(html`<div
        @click=${this.openResource}
        @contextmenu=${this.toggleSelection}
        data-id="${item.id}"
        data-kind="${isFolder ? "container" : "leaf"}"
      >
        <sl-icon name="${kind}"></sl-icon>
        ${qrCode}
        <div class="details">
          <span class="name">${item.name}</span>
          <div>
            <span>${timeFormat.format(modified)}</span>&nbsp;—&nbsp;<span
              >${size}</span
            >
          </div>
        </div>
      </div>`);
    }
    // TODO(fabrice): figure out why we need that explicit update trigger.
    this.requestUpdate();
  }

  onQrCode(event) {
    let id = this.findNodeFromEvent(event)?.dataset.id;
    if (!id) {
      return;
    }
    event.stopPropagation();
    // Trigger a "resource publishing" activity.
    let activity = new WebActivity("publish-resource", { id });
    activity.start();
  }

  findNodeFromEvent(event) {
    let node = event.target;
    while (node && !node.dataset.id) {
      node = node.parentElement;
    }
    return node;
  }

  toggleSelection(event) {
    let node = this.findNodeFromEvent(event);
    if (!node) {
      return;
    }

    // Prevent the standard context menu from showing up.
    event.stopPropagation();
    event.preventDefault();

    // this.log(`toggleSelection for ${id}`);
    node.classList.toggle("selected");
    if (node.classList.contains("selected")) {
      this.selected.add(node.dataset);
    } else {
      this.selected.delete(node.dataset);
    }
    this.selectedCount = this.selected.size;
  }

  openResource(event) {
    let node = this.findNodeFromEvent(event);

    if (!node) {
      return;
    }

    const { kind, id } = node.dataset;
    this.log(`will open ${kind} ${id}`);
    // If this is a container, just update ourselves and notify the main screen of the new id to
    // update the breadcrumb
    if (kind == "container") {
      this.id = id;
      this.dispatchEvent(new CustomEvent("update-path", { detail: id }));
      history.pushState({ id, container: true }, "");
      this.getItems();
    } else {
      this.dispatchEvent(new CustomEvent("switch-to-leaf", { detail: { id } }));
    }
  }

  closeApp() {
    window.close();
  }

  switchMode() {
    this.iconLayout = !this.iconLayout;
  }

  clearSelected() {
    this.selected.clear();
    this.selectedCount = 0;
  }

  async createDirectory() {
    let title = await document.l10n.formatValue("new-dir-name");
    let newDirName = prompt(title);
    if (newDirName) {
      let svc = await contentManager.getService();
      let lib = await contentManager.lib();
      try {
        await svc.createobj(
          {
            parent: this.id,
            name: newDirName,
            kind: lib.ResourceKind.CONTAINER,
            tags: [],
          },
          ""
        );
        this.clearSelected();
        await this.getItems();
      } catch (e) {
        console.error(e);
      }
    }
  }

  async deleteSelected() {
    // this.log(`deleteSelected`);
    let toDelete = [];
    let svc = await contentManager.getService();
    for (let item of this.selected) {
      toDelete.push(svc.delete(item.id));
    }
    await Promise.allSettled(toDelete);
    this.clearSelected();
    await this.getItems();
  }

  async renameResource() {
    // Bail out if called with multiple resources selected.
    if (this.selectedCount != 1) {
      return;
    }

    let resourceId = this.selected.values().next().value.id;
    /* TODO: use a different string for files vs. directories */
    let title = await document.l10n.formatValue("new-resource-name");
    let svc = await contentManager.getService();
    let meta = await svc.getMetadata(resourceId);
    let newName = prompt(title, meta.name);
    await svc.renameResource(resourceId, newName);
    this.clearSelected();
    await this.getItems();
  }

  async applyToSingleResourceWithDir(action, callback) {
    // Bail out if called with multiple resources selected.
    if (this.selectedCount != 1) {
      return;
    }

    let { kind, id } = this.selected.values().next().value;
    this.log(`Will ${action} ${kind} ${id}`);
    if (kind !== "leaf") {
      let title = await document.l10n.formatValue(`cant-${action}-directory`);
      alert(title);
      return;
    }

    await graph.waitForDeps("directory picker");
    let picker = document.getElementById("directory-picker");
    try {
      let container = await picker.pick();
      this.log(`About to ${action} to ${container}`);
      let svc = await contentManager.getService();
      await callback(svc, id, container);
      this.clearSelected();
      await this.getItems();
    } catch (e) {}
  }

  async moveResource() {
    await this.applyToSingleResourceWithDir("move", async (svc, id, container) => {
      await svc.moveResource(id, container);
    });
  }

  async copyResource() {
    await this.applyToSingleResourceWithDir("copy", async (svc, id, container) => {
      await svc.copyResource(id, container);
    });
  }

  updated() {
    document.l10n.translateFragment(this.shadowRoot);
  }

  render() {
    let optionalDelete;
    if (this.selected.size > 0) {
      optionalDelete = html`<div @click="${this.deleteSelected}">
        <sl-icon-button name="trash-2"></sl-icon-button>
      </div>`;
    }

    let optionalSingle;
    if (this.selected.size === 1) {
      optionalSingle = html`<div>
        <sl-dropdown placement="top-end">
          <sl-icon slot="trigger" name="more-vertical"></sl-icon>
          <sl-menu>
            <sl-menu-item
              @click="${this.moveResource}"
              data-l10n-id="menu-resource-move"
            ></sl-menu-item>
            <sl-menu-item
              @click="${this.copyResource}"
              data-l10n-id="menu-resource-copy"
            ></sl-menu-item>
            <sl-menu-item
              @click="${this.renameResource}"
              data-l10n-id="menu-resource-rename"
            ></sl-menu-item>
            <!-- <sl-menu-item data-l10n-id="menu-resource-details"></sl-menu-item> -->
          </sl-menu>
        </sl-dropdown>
      </div>`;
    }

    let items =
      !this.items || this.items.length == 0
        ? html`<div class="empty" data-l10n-id="empty-container"></div>`
        : this.items;

    return html`<link
        rel="stylesheet"
        href="components/container_renderer.css"
      />
      <div id="list" class="${this.iconLayout ? "icons" : "list"}">
        ${items}
      </div>
      <div class="flex-fill"></div>
      <footer>
        <div @click="${this.switchMode}">
          <sl-icon-button
            name="${this.iconLayout ? "list" : "layout-grid"}"
          ></sl-icon-button>
        </div>
        <div @click="${this.createDirectory}">
          <sl-icon-button name="folder-plus"></sl-icon-button>
        </div>
        ${optionalDelete} ${optionalSingle}
        <div @click="${this.closeApp}">
          <sl-icon-button name="x"></sl-icon-button>
        </div>
      </footer>`;
  }

  canEdit() {
    return false;
  }
}

customElements.define("container-renderer", ContainerRenderer);
