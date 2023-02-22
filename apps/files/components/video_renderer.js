/* image/* renderer component */

export class VideoRenderer extends LitElement {
  constructor(resource) {
    super();
    this.resource = resource;
    this.src = resource.variantUrl();
  }

  log(msg) {
    console.log(`VideoRenderer: ${msg}`);
  }

  static get properties() {
    return {
      src: { state: true },
    };
  }

  render() {
    return html`<link rel="stylesheet" href="components/video_renderer.css" />
      <video controls src=${this.src} />`;
  }

  canEdit() {
    return false;
  }
}

customElements.define("video-renderer", VideoRenderer);
