/* image/* renderer component */

export class ImageRenderer extends LitElement {
  constructor(resource) {
    super();
    this.resource = resource;
    this.src = resource.variantUrl();
  }

  log(msg) {
    console.log(`ImageRenderer: ${msg}`);
  }

  static get properties() {
    return {
      src: { state: true },
    };
  }

  updateResource() {
    this.src = this.src + `?r=${Math.random()}`;
  }

  updated() {
    document.l10n.translateFragment(this.shadowRoot);
  }

  render() {
    return html`<link rel="stylesheet" href="components/image_renderer.css" />
      <img crossorigin="anonymous" src=${this.src} />
      `;
  }

  canEdit() {
    return true;
  }
}

customElements.define("image-renderer", ImageRenderer);
