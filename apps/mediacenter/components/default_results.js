// Default results component: displays results either by frecency or history.

class DefaultResults extends LitElement {
  constructor() {
    super();

    this.results = [];

    // Initialize this spatial navigation section.
    SpatialNavigation.add("default-results-nav", {});
  }

  createRenderRoot() {
    return this.attachShadow({
      mode: "open",
      delegatesFocus: true,
    });
  }

  static get properties() {
    return {
      results: { state: true },
    };
  }

  render() {
    const itemTemplates = [];

    this.results.forEach((result) => {
      let tag = result.meta.tags[0];

      let node;
      switch (tag) {
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

    // Update Spatial navigation.
    SpatialNavigation.set("default-results-nav", {
      selector: itemTemplates,
    });

    return html`<link rel="stylesheet" href="components/default_results.css" />
      <div class="results" @click="${this.resultClick}">
        ${itemTemplates}
      </div> `;
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

  async refresh() {
    console.log(`default-results refresh`);

    let results = [];
    await contentManager.topByFrecency(20, (result) => {
      if (result) {
        results.push(result);
      }
      return true;
    });
    this.results = results;
  }

  clear() {
    this.results = [];
  }
}

customElements.define("default-results", DefaultResults);
