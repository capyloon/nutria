/* fallback renderer component, that will just load the resource in an iframe */

export class DefaultRenderer extends HTMLElement {
  constructor(resource) {
    super();
    this.src = resource.variantUrl();

    let fullSize = resource.meta.variants
      .map((item) => item.size)
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    this.fullSize = contentManager.formatSize(fullSize);

    // Manually apply offset to UTC since we have no guarantee that
    // anything else but `UTC` will work in DateTimeFormat.
    let modified =
      resource.meta.modified.getTime() -
      new Date().getTimezoneOffset() * 60 * 1000;
    const timeFormat = new Intl.DateTimeFormat("default", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "UTC",
      hour12: false,
    });
    this.modified = timeFormat.format(modified);
  }

  log(msg) {
    console.log(`DefaultRenderer: ${msg}`);
  }

  static get properties() {
    return {
      src: { state: true },
    };
  }

  enterEditMode() {}

  leaveEditMode() {}

  connectedCallback() {
    //   this.fullSize = 0;
    //   this.modified = "now";
    //   this.src = "http://example.com";
    this.render();
  }

  render() {
    // return html`<link rel="stylesheet" href="components/default_renderer.css" />
    //   <div class="info">${this.fullSize}&nbsp;—&nbsp;${this.modified}</div>
    //   <iframe src="${this.src}"></iframe> `;

    this.innerHTML = `<link rel="stylesheet" href="components/default_renderer.css" />
      <div class="info">${this.fullSize}&nbsp;—&nbsp;${this.modified}</div>
      <iframe src="${this.src}"></iframe> `;

    // let webView = this.querySelector("web-view");
    // webView.openWindowInfo = null;
  }

  canEdit() {
    return false;
  }
}

customElements.define("default-renderer", DefaultRenderer);
