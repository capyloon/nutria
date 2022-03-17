// Audio volume indicator component.

class AudioVolumeIndicator extends LitElement {
  constructor() {
    super();

    this.volume = 0;
    this.headphones = false;
  }

  static get properties() {
    return {
      volume: { type: Number },
      headphones: { type: Boolean },
    };
  }

  render() {
    return html`
    <link rel="stylesheet" href="components/audio_volume_indicator.css">
    <div>
      <sl-icon name="${this.headphones ? "headphones" : "volume-1"}"></sl-icon>
      <sl-progress-bar min="0" max="100" value="${this.volume}"></sl-progress-bar>
    </div>`;
  }

  setValue(value) {
    if (this.hasAttribute("hidden")) {
      this.removeAttribute("hidden");
    }

    // Clamp value in 0..100 inclusive.
    this.volume = Math.min(Math.max(0, value), 100);

    this.headphones = navigator.b2g?.audioChannelManager?.headphones || false;

    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    this.timer = window.setTimeout(() => {
      this.timer = null;
      this.classList.add("offscreen");
    }, 2000);
    this.classList.remove("offscreen");
  }
  
}

customElements.define("audio-volume", AudioVolumeIndicator);
