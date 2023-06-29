// <media-controller> web component
// Displays a single media control interface.

export class MediaController extends LitElement {
  constructor(controller, meta) {
    super();

    this.controller = controller;
    this.meta = meta;
  }

  static properties = {
    meta: { state: true },
  };

  static get styles() {
    return css`
      :host {
        padding: 0.5em;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        border-radius: var(--sl-border-radius-large);
      }
      :host img {
        width: 1.5em;
      }
      :host header {
        display: flex;
        align-items: center;
        gap: 0.5em;
        backdrop-filter: blur(10px);
      }

      :host .controls {
        display: flex;
        justify-content: space-around;
      }

      :host sl-icon {
        font-size: larger;
      }
    `;
  }

  updateController(meta) {
    this.meta = meta;
  }

  updated() {
    this.style.backgroundColor = this.meta.backgroundColor;
    let poster =
      this.meta.artwork?.[0]?.src != "" ? this.meta.artwork?.[0]?.src : null;
    let posterUrl = poster || this.meta.ogImage;
    this.style.backgroundImage = `url(${posterUrl})`;
  }

  render() {
    let playIcon =
      this.controller.playbackState === "playing" ? "pause" : "play";

    return html`
      <header><img src="${this.meta.icon}" />${this.meta.title}</header>
      <div class="controls">
        <sl-button circle @click=${this.togglePlay}>
          <sl-icon name="${playIcon}"></sl-icon>
        </sl-button>
      </div>
    `;
  }

  togglePlay() {
    if (this.controller.playbackState === "playing") {
      this.controller.pause();
    } else {
      this.controller.play();
    }
  }
}

customElements.define("media-controller", MediaController);
