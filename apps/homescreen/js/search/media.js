// Media search module.

class Media {
  // Returns a Promise that resolves to a result set.
  async search(query, count) {
    console.log(`Media query ${query}`);
    let results = [];

    await contentManager.searchMedia(query, count, (result) => {
      // console.log(`Media result: ${JSON.stringify(result)}`);
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

class MediaSource extends SearchSource {
  constructor(sectionName) {
    super(sectionName, new Media());
  }

  domForResult(result) {
    return new MediaItem(result);
  }

  activate(result) {
    let url = result.variants.default.url;
    maybeOpenURL(url);
    if (!isPrivateBrowsing()) {
      contentManager.visitMedia(url, true);
    }
  }
}

// Define a custom element for our content.
class MediaItem extends HTMLElement {
  constructor(data) {
    super();
    this.data = data;
    this.revokable = [];
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

  connectedCallback() {
    let content = this.data.variants.default;
    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <link rel="stylesheet" href="style/search/media.css">
      <img class="icon">
      <div class="text">${content.title} ${
      content.album ? "- " + content.album : ""
    } ${content.artist ? "- " + content.artist : ""}</div>
      `;

    let icon = shadow.querySelector(".icon");
    icon.src = this.variant("icon") || content.icon;

    let maybeBackground = this.variant("poster");
    if (maybeBackground) {
      shadow.host.style.backgroundImage = `url(${maybeBackground})`;
    } else if (content.backgroundColor) {
      shadow.host.style.backgroundColor = content.backgroundColor;
    }
  }

  disconnectedCallback() {
    this.revokable.forEach(URL.revokeObjectURL);
    this.revokable = [];
  }

  activate() {
    this.addEventListener(
      "click",
      () => {
        SearchSource.closeSearch();
        let url = this.data.variants.default.url;
        maybeOpenURL(url);
        if (!isPrivateBrowsing()) {
          contentManager.visitMedia(url, true);
        }
      },
      { once: true }
    );
  }
}

customElements.define("media-item", MediaItem);
