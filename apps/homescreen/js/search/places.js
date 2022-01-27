// Top places search module.

class Places {
  // Returns a Promise that resolves to a result set.
  async search(query, count) {
    console.log(`Places query ${query}`);
    let results = [];
    await contentManager.searchPlaces(query, count, (result) => {
      // console.log(`Places result: ${JSON.stringify(result)}`);
      if (result) {
        results.push(result);
      }
      return true;
    });

    // Reverse result order to better fit the UI and display the first
    // results closer to the keyboard.
    return results.reverse();
  }
}

class PlacesSource extends SearchSource {
  constructor(sectionName) {
    super(sectionName, new Places());
  }

  domForResult(result) {
    return new PlacesItem(result);
  }

  activate(result) {
    let url = result.variants.default.url;
    SearchSource.openURL(url);
    contentManager.visitPlace(url, true);
  }
}

// Define a custom element for our content.
class PlacesItem extends LitElement {
  // data is { meta, variants }
  constructor(data) {
    super();
    this.data = data;
    this.revokable = [];
  }

  static get properties() {
    return {
      data: { state: true },
    };
  }

  variant(name = "default") {
    let variant = this.data.variants[name];
    if (variant) {
      if (typeof variant === "string") {
        return variant;
      }
      // Variant should be a blob if not a string.
      let url = URL.createObjectURL(variant);
      this.revokable.push(url);
      return url;
    }
  }

  render() {
    let content = this.data.variants.default;
    let iconSrc = this.variant("icon") || content.icon;

    return html`
      <link rel="stylesheet" href="style/search/places.css">
      <div class="entry" title="${content.url}">
        <img src=${iconSrc}/>
        <div class="title">${content.title}</div>
      </div>`;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.revokable.forEach(URL.revokeObjectURL);
    this.revokable = [];
  }

  activate() {
    this.addEventListener(
      "click",
      () => {
        SearchSource.closeSearch();
        let url = this.data.variants.default.url;
        SearchSource.openURL(url);
        contentManager.visitPlace(url, true);
      },
      { once: true }
    );
  }
}

customElements.define("places-item", PlacesItem);
