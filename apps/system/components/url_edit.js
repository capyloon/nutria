// Represents an <url-edit> component

class UrlEdit extends LitElement {
  constructor() {
    super();

    this.addEventListener("click", (event) => {
      // Prevent clicks to reach the backdrop and close the panel.
      event.stopPropagation();
    });

    actionsDispatcher.addListener("keyboard-opening", () => {
      this.classList.add("keyboard-open");
    });

    actionsDispatcher.addListener("keyboard-closing", () => {
      this.classList.remove("keyboard-open");
      this.classList.add("offscreen");
      this.results = [];
    });

    actionsDispatcher.addListener("open-url-editor", (_name, url) => {
      this.show();
      this.setUrl(url);
    });

    actionsDispatcher.addListener("open-carousel", () => {
      this.hide();
    });

    actionsDispatcher.addListener("go-home", () => {
      this.hide();
    });

    actionsDispatcher.addListener("close-url-editor", () => {
      this.hide();
    });

    this.urlUpdated = false;
    this.url = null;
    this.results = null;
  }

  static get properties() {
    return {
      results: { state: true },
    };
  }

  setUrl(url) {
    this.urlUpdated = true;
    this.url = url;
    this.updateResults(url);
  }

  updated() {
    if (this.urlUpdated) {
      this.urlUpdated = false;
      // Focus and select the whole text.
      let input = this.shadowRoot.querySelector("input");
      input.value = this.url;
      input.select();
    } else {
      this.shadowRoot
        .querySelector("#results")
        .lastElementChild?.scrollIntoView({
          block: "end",
          inline: "nearest",
        });
    }
  }

  show() {
    this.classList.remove("offscreen");
  }

  hide() {
    this.classList.add("offscreen");
    this.results = [];
    // Force closing the virtual keyboard if it was opened.
    inputMethod.close();
  }

  async updateResults(query) {
    let results = [];

    if (query) {
      await contentManager.searchPlaces(query, 10, (result) => {
        if (result) {
          results.push(result);
        }
        return true;
      });
    } else {
      await contentManager.topByFrecency(10, (result) => {
        if (result) {
          results.push(result);
        }
        return true;
      });
    }

    // Reverse result order to better fit the UI and display the first
    // results closer to the keyboard.
    let dom = [];
    results.reverse().forEach((result) => {
      dom.push(new PlacesItem(result));
    });
    this.results = dom;
  }

  inputChanged(event) {
    let newValue = event.target.value.trim();
    if (newValue.length) {
      this.updateResults(newValue);
    } else {
      this.results = [];
    }
  }

  keyPress(event) {
    if (event.key === "Enter") {
      this.navigateTo(event.target.value);
    } else if (event.key === "Escape") {
      this.hide();
      this.shadowRoot.querySelector("input").blur();
    } else if (event.key === "Tab") {
      this.onTabKey(event);
      event.preventDefault();
    }
  }

  onTabKey(event) {
    let shift = event.shiftKey;

    let results = this.shadowRoot.querySelector("#results");

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
    let input = this.shadowRoot.querySelector("input");
    input.value = this.selectedItem.url;
    input.select();
  }

  navigateTo(input) {
    input = input.trim();

    if (input.includes("://")) {
      // Fully formed URL.
      actionsDispatcher.dispatch("navigate-to", { url: input });
      contentManager.visitPlace(input, true);
    } else if (
      // host name without a scheme.
      !input.includes("://") &&
      input.includes(".") &&
      !input.includes(" ")
    ) {
      let url = `https://${input}`;
      actionsDispatcher.dispatch("navigate-to", { url });
      contentManager.visitPlace(url, true);
    } else {
      window.utils.randomSearchEngineUrl(input).then((url) => {
        actionsDispatcher.dispatch("navigate-to", { url, search: input });
        contentManager.visitPlace(url, true);
      });
    }
    this.hide();
    this.shadowRoot.querySelector("input").blur();
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.addEventListener("navigate-to", (event) => {
      this.navigateTo(event.detail);
    });
  }

  render() {
    return html`
      <link rel="stylesheet" href="components/url_edit.css" />
      <div id="results">${this.results}</div>
      <div>
        <input
          @input="${this.inputChanged}"
          @keypress="${this.keyPress}"
          type="url"
          id="url"
          value="${this.url}"
        />
      </div>
    `;
  }
}

customElements.define("url-edit", UrlEdit);

// Define a custom element for our content.
class PlacesItem extends HTMLElement {
  constructor(data) {
    super();
    this.data = data;
    this.revokable = [];
  }

  variant(name = "default") {
    let blob = this.data.variants[name];
    if (blob) {
      let url = URL.createObjectURL(blob);
      this.revokable.push(url);
      return url;
    }
  }

  get url() {
    return this.data.variants.default.url;
  }

  connectedCallback() {
    let content = this.data.variants.default;
    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <link rel="stylesheet" href="components/places_item.css">
      <div class="entry" title="${content.url}">
        <img/>
        <div class="title">${content.title}</div>
      </div>
      `;

    let icon = shadow.querySelector("img");
    icon.src = content.icon || this.variant("icon");

    this.onclick = () => {
      this.dispatchEvent(
        new CustomEvent("navigate-to", { detail: this.url, bubbles: true })
      );
    };
  }

  disconnectedCallback() {
    this.revokable.forEach(URL.revokeObjectURL);
    this.revokable = [];
  }
}

customElements.define("places-item", PlacesItem);
