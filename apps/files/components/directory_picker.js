// <directory-picker> custom element

class DirectoryPicker extends LitElement {
  constructor() {
    super();
    this.attached = false;
    this.updates = 0;
    this.selected = null;
    this.deferred = null;
  }

  static get properties() {
    return {
      updates: { state: true },
    };
  }

  log(msg) {
    console.log(`DirectoryPicker: ${msg}`);
  }

  updateSelected(node, resourceId) {
    if (this.selected) {
      this.selected.node.classList.remove("selected");
    }

    this.selected = { node, resourceId };
    node.classList.add("selected");
    this.btnOk.disabled = false;
  }

  async addSubtree(node, parentId = null) {
    this.log(`addSubtree parent=${parentId}`);
    let svc = await contentManager.getService();
    let lib = await contentManager.lib();

    // If no parentId is set, start from the root.
    if (!parentId) {
      let root = await svc.getRoot();
      parentId = root.id;
    }

    // Gather the list of name & id for the sub containers.
    let cursor = await svc.childrenOf(parentId);
    let items = [];
    let done = false;
    while (!done) {
      try {
        let children = await cursor.next();
        for (let child of children) {
          if (child.kind === lib.ResourceKind.CONTAINER) {
            items.push(child);
          }
        }
      } catch (e) {
        // cursor.next() rejects when no more items are available, so it's not
        // a fatal error.
        // this.error(`Cursor error: ${JSON.stringify(e)}`);
        done = true;
      }
    }

    items.forEach((item) => {
      let treeItem = document.createElement("sl-tree-item");
      let icon = document.createElement("sl-icon");
      icon.setAttribute("name", "folder");
      treeItem.append(icon);
      treeItem.append(document.createTextNode(item.name));
      treeItem.lazy = true;
      treeItem.addEventListener("contextmenu", (event) => {
        this.updateSelected(treeItem, item.id);
        event.preventDefault();
        event.stopPropagation();
      });
      treeItem.addEventListener(
        "sl-lazy-load",
        async () => {
          try {
            await this.addSubtree(treeItem, item.id);
          } catch (e) {}
          treeItem.lazy = false;
        },
        { once: true }
      );
      node.append(treeItem);
    });
  }

  updated() {
    document.l10n.translateFragment(this.shadowRoot);
    if (!this.attached) {
      this.drawer = this.shadowRoot.querySelector("sl-drawer");
      this.drawer.addEventListener("sl-request-close", this.reject);
      this.btnOk = this.shadowRoot.querySelector("#picker-ok");
      this.root = this.shadowRoot.querySelector("#root");
      this.attached = true;
    }

    // Trigger the tree display from the root.
    if (this.updates != 0) {
      this.root.innerHTML = "";
      this.addSubtree(this.root);
    }
  }

  reject() {
    if (this.deferred) {
      this.deferred.reject();
      this.deferred = null;
      this.selected = null;
    }
  }

  // Returns a promise that will resolve with the resource id of
  // the chosen directory, or reject if none was picked.
  pick() {
    this.updates += 1;
    this.drawer.show();
    this.selected = null;
    this.btnOk.disabled = true;
    return new Promise((resolve, reject) => {
      this.deferred = { resolve, reject };
    });
  }

  onCancel() {
    this.reject();
    this.drawer.hide();
  }

  onOk() {
    if (!this.selected || !this.deferred) {
      return;
    }

    this.deferred.resolve(this.selected.resourceId);
    this.deferred = null;
    this.selected = null;

    this.drawer.hide();
  }

  render() {
    return html` <link
        rel="stylesheet"
        href="components/directory_picker.css"
      />
      <sl-drawer>
        <span slot="label" data-l10n-id="picker-title"></span>
        <sl-tree id="root"></sl-tree>
        <div slot="footer">
          <sl-button
            @click="${this.onOk}"
            id="picker-ok"
            variant="primary"
            data-l10n-id="button-ok"
          ></sl-button>
          <sl-button
            @click="${this.onCancel}"
            id="picker-cancel"
            data-l10n-id="button-cancel"
          ></sl-button>
        </div>
      </sl-drawer>`;
  }
}

customElements.define("directory-picker", DirectoryPicker);
