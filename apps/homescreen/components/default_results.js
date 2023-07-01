// Default results component: displays results either by frecency or history.

class DefaultResults extends LitElement {
  constructor() {
    super();

    this.mode = "activity";
    this.results = [];
    this.currentFolder = null;
  }

  static get properties() {
    return {
      results: { state: true },
    };
  }

  updated() {
    // Not sure why we need a timeout there with such a delay.
    setTimeout(() => {
      let box = this.shadowRoot.querySelector(".results");
      if (box) {
        // Poor man way to force scroll to the bottom.
        box.scrollTop = 1000000;
      }
    }, 50);
  }

  render() {
    let isFrecency = this.mode === "activity";
    let isHistory = this.mode === "history";
    let isFolder = this.mode === "folder";

    const itemTemplates = [];

    if (isFolder) {
      this.results.forEach((result) => {
        itemTemplates.push(new ContentManagerResource(result, this.lib));
      });
    } else {
      this.results.forEach((result) => {
        let tag = result.meta.tags[0];

        let node;
        switch (tag) {
          case "media":
            node = new MediaItem(result);
            break;
          case "places":
            node = new PlacesItem(result);
            break;
          default:
            tag && console.error(`Unsupported resource tag: ${tag}`);
            break;
        }

        if (node) {
          itemTemplates.push(node);
          node.activate();
        }
      });
    }

    return html`<link rel="stylesheet" href="components/default_results.css" />
      <div class="results" @click="${this.resultClick}">${itemTemplates}</div>
      <div class="icons">
        <div class="${isFrecency ? "active" : ""}" @click="${this.switchMode}">
          <sl-icon name="activity"></sl-icon>
        </div>
        <div class="${isHistory ? "active" : ""}" @click="${this.switchMode}">
          <sl-icon name="history"></sl-icon>
        </div>
        <div class="${isFolder ? "active" : ""}" @click="${this.switchMode}">
          <sl-icon name="folder"></sl-icon>
        </div>
        <div class="go-home" @click="${this.goHome}">
          <sl-icon name="home"></sl-icon>
        </div>
      </div>`;
  }

  resultClick(event) {
    if (event.target.localName === "resource-item") {
      let item = event.target.item;
      if (item.kind === this.lib.ResourceKind.CONTAINER) {
        this.currentFolder = item;
        this.refreshOpenFolder();
      } else {
        event.target.activate();
      }
    }
  }

  switchMode(event) {
    // Poor man way to get the mode either from the div or the sl-icon
    // since we can't easily use event capturing.
    let newMode =
      event.target.getAttribute("name") ||
      event.target.firstElementChild.getAttribute("name");
    if (this.mode !== newMode) {
      this.mode = newMode;
      this.refresh();
    }
  }

  goHome() {
    this.clear();
    SearchSource.closeSearch();
  }

  async refreshOpenFolder() {
    let svc = await contentManager.getService();
    this.lib = await contentManager.lib();

    if (!this.currentFolder) {
      this.currentFolder = await svc.getRoot();
    }

    // Get the children of the current folder.
    let cursor = await svc.childrenOf(this.currentFolder.id);
    let results = [];

    // If we have a parent folder, add the full path to current folder and way to get back up.
    if (this.currentFolder.id !== this.currentFolder.parent) {
      try {
        // Simple breadcrumb display of the current folder path.
        let steps = await svc.getFullPath(this.currentFolder.id);
        let breadcrumb = this.currentFolder;
        breadcrumb.name = steps
          .filter((step) => step.name !== "/")
          .map((step) => step.name)
          .join(" > ");
        breadcrumb.isBreadcrumb = true;
        results.push(breadcrumb);

        let parent = await svc.getMetadata(this.currentFolder.parent);
        parent.isUpNavigation = true;
        results.push(parent);
      } catch (e) {
        console.error(
          `Failed to get parent '${this.currentFolder.parent}' : ${e}`
        );
      }
    }

    let done = false;
    while (!done) {
      try {
        let children = await cursor.next();
        for (let child of children) {
          results.push(child);
        }
      } catch (e) {
        // cursor.next() rejects when no more items are available, so it's not
        // a fatal error.
        // this.error(`Cursor error: ${JSON.stringify(e)}`);
        done = true;
      }
    }

    this.results = results;
  }

  async refresh() {
    console.log(`refresh '${this.mode}'`);
    this.selectedItem = null;

    if (this.mode === "folder") {
      this.refreshOpenFolder();
      return;
    }

    let func =
      this.mode === "activity"
        ? contentManager.topByFrecency
        : contentManager.lastModified;

    let results = [];
    await func.bind(contentManager)(20, (result) => {
      // console.log(`Top ${this.mode} result: ${JSON.stringify(result)}`);
      if (result) {
        results.push(result);
      }
      return true;
    });
    results.reverse();
    this.results = results;
  }

  clear() {
    this.results = [];
    this.selectedItem = null;
  }

  onTabKey(event) {
    let shift = event.shiftKey;

    let results = this.shadowRoot.querySelector(".results");

    if (!this.selectedItem) {
      this.selectedItem = shift
        ? results.lastElementChild
        : results.firstElementChild;
    } else {
      this.selectedItem.classList.remove("selected");
      this.selectedItem =
        (shift
          ? this.selectedItem.previousElementSibling
          : this.selectedItem.nextElementSibling) ||
        (shift ? results.lastElementChild : results.firstElementChild);
    }
    this.selectedItem.classList.add("selected");
    this.selectedItem.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }

  // Returns whether we process the key even or not.
  onEnterKey() {
    if (!this.selectedItem) {
      return false;
    }

    this.selectedItem.click();

    return true;
  }
}

customElements.define("default-results", DefaultResults);

// A custom element that represents a container or leaf resource.

const PLACES_MIME_TYPE = "application/x-places+json";
const MEDIA_MIME_TYPE = "application/x-media+json";

class ContentManagerResource extends LitElement {
  constructor(item, lib) {
    super();

    this.item = item;
    this.lib = lib;

    this.defaultVariant = item.variants.find(
      (variant) => variant.name === "default"
    );
    if (this.defaultVariant) {
      this.mimeType = this.defaultVariant.mimeType;
    }

    if (this.item.isBreadcrumb) {
      this.classList.add("breadcrumb");
    }
  }

  static get properties() {
    return {
      item: { state: true },
    };
  }

  openURL(url) {
    SearchSource.closeSearch();
    maybeOpenURL(url);
  }

  async activate() {
    if (!this.mimeType) {
      return;
    }

    if (this.mimeType === PLACES_MIME_TYPE) {
      this.openURL(this.item.name);
      if (!isPrivateBrowsing()) {
        contentManager.visitPlace(this.item.name, true);
      }
    } else if (this.mimeType === MEDIA_MIME_TYPE) {
      this.openURL(this.item.name);
      if (!isPrivateBrowsing()) {
        contentManager.visitMedia(this.item.name, true);
      }
    } else {
      // Trigger a "view" activity for this mime type, sending the default variant and
      // the resource id.
      let svc = await contentManager.getService();
      let id = this.item.id;
      let blob = await svc.getVariant(id, "default");
      SearchSource.closeSearch();
      let activity = new WebActivity("view-resource", {
        mimeType: this.mimeType,
        blob,
        id,
      });
      try {
        await activity.start();
        if (!isPrivateBrowsing()) {
          svc.visit(id, this.lib.VisitPriority.HIGH);
        }
      } catch (e) {
        console.error(`Failure in 'view-resource' activity: ${e}`);
      }
    }
  }

  render() {
    let kind = "corner-up-left";
    if (!this.item.isUpNavigation) {
      kind = contentManager.iconFor(
        this.item.kind === this.lib.ResourceKind.CONTAINER,
        this.mimeType
      );
    }

    return html`<link rel="stylesheet" href="components/resource_item.css" />
      <sl-icon name="${kind}"></sl-icon>
      <span class="name">${this.item.name}</span>`;
  }
}

customElements.define("resource-item", ContentManagerResource);
