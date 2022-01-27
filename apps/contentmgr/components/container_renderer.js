/* renderer component for containers */

export class ContainerRenderer extends LitElement {
  constructor(id) {
    super();
    this.id = id;
    this.getItems();
    this.iconLayout = false;
    this.selected = new Set();
    this.selectedCount = 0;
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
      let modified = item.modified.getTime() - new Date().getTimezoneOffset() * 60 * 1000;
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

      this.items.push(html`<div
        @click=${this.openResource}
        @contextmenu=${this.toggleSelection}
        data-id="${item.id}"
        data-kind="${isFolder ? "container" : "leaf"}"
      >
        <lucide-icon kind="${kind}"></lucide-icon>
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

    const { id } = node.dataset;
    // this.log(`toggleSelection for ${id}`);
    node.classList.toggle("selected");
    if (node.classList.contains("selected")) {
      this.selected.add(id);
    } else {
      this.selected.delete(id);
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

  async deleteSelected() {
    // this.log(`deleteSelected`);
    let toDelete = [];
    let svc = await contentManager.getService();
    for (let selected of this.selected) {
      toDelete.push(svc.delete(selected));
    }
    await Promise.allSettled(toDelete);
    this.selected.clear();
    this.selectedCount = 0;
    await this.getItems();
  }

  render() {
    let optionalDelete;
    if (this.selected.size > 0) {
      optionalDelete = html`<div @click="${this.deleteSelected}">
        <lucide-icon kind="trash-2"></lucide-icon>
      </div>`;
    }

    return html`<link
        rel="stylesheet"
        href="components/container_renderer.css"
      />
      <div id="list" class="${this.iconLayout ? "icons" : "list"}">
        ${this.items}
      </div>
      <div class="flex-fill"></div>
      <footer>
        <div @click="${this.switchMode}">
          <lucide-icon
            kind="${this.iconLayout ? "list" : "layout-grid"}"
          ></lucide-icon>
        </div>
        ${optionalDelete}
        <div @click="${this.closeApp}">
          <lucide-icon kind="x"></lucide-icon>
        </div>
      </footer>`;
  }

  canEdit() {
    return false;
  }
}

customElements.define("container-renderer", ContainerRenderer);
