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
        background-size: cover;
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

      :host .hidden {
        visibility: hidden;
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

    let prevTrackClass = "hidden";
    let nextTrackClass = "hidden";
    this.controller.supportedKeys.forEach((key) => {
      if (key == "previoustrack") {
        prevTrackClass = "";
      } else if (key == "nexttrack") {
        nextTrackClass = "";
      }
    });

    return html`
      <header><img src="${this.meta.icon}" />${this.meta.title}</header>
      <div class="controls">
        <sl-button
          class="${prevTrackClass}"
          variant="neutral"
          circle
          @click=${this.prevTrack}
        >
          <sl-icon name="skip-back"></sl-icon>
        </sl-button>
        <sl-button variant="neutral" circle @click=${this.togglePlay}>
          <sl-icon name="${playIcon}"></sl-icon>
        </sl-button>
        <sl-button
          class="${nextTrackClass}"
          variant="neutral"
          circle
          @click=${this.nextTrack}
        >
          <sl-icon name="skip-forward"></sl-icon>
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

  prevTrack() {
    this.controller.prevTrack();
  }

  nextTrack() {
    this.controller.nextTrack();
  }
}

customElements.define("media-controller", MediaController);

// <media-controller-list> web component
// Manages a set of <media-controller> elements.

export class MediaControllerList extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `<link rel="stylesheet" href="components/media_controller.css">`;

    actionsDispatcher.addListener("media-controller-change", (_name, data) => {
      this.mediaControllerChange(data);
    });
  }

  getMediaController(controller) {
    return this.shadowRoot.querySelector(`#media-control-${controller.id}`);
  }

  mediaControllerChange(data) {
    const { event, controller, meta } = data;

    if (event === "activated") {
      // Create a new controller.
      let element = new MediaController(controller, meta);
      element.setAttribute("id", `media-control-${controller.id}`);
      this.shadowRoot.append(element);
    } else if (event === "deactivated") {
      // Remove an existing controller.
      this.getMediaController(controller)?.remove();
    } else {
      // Update an existing controller.
      this.getMediaController(controller)?.updateController(meta);
    }
  }
}

customElements.define("media-controller-list", MediaControllerList);
