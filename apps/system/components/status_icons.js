// the <status-icons> component

class StatusIcons extends LitElement {
  constructor() {
    super();

    this.geoloc = false;
    this.tor = false;
    this.record_audio = 0;
    this.record_video = 0;
  }

  static get properties() {
    return {
      geoloc: { type: Boolean },
      tor: { type: Boolean },
      record_audio: { type: Number },
      record_video: { type: Number },
    };
  }

  render() {
    let opened =
      this.geoloc ||
      this.tor ||
      this.record_audio !== 0 ||
      this.record_video !== 0;

    if (opened) {
      this.classList.remove("hidden");
    } else {
      this.classList.add("hidden");
    }

    return html`
      <link rel="stylesheet" href="components/status_icons.css" />
      <sl-icon name="map-pin" hidden="${!this.geoloc}"></sl-icon>
      <img src="./resources/tor.ico" hidden="${!this.tor}" />
      <sl-icon name="mic" class="danger" hidden="${this.record_audio == 0}"></sl-icon>
      <sl-icon name="video" class="danger" hidden="${this.record_video == 0}"></sl-icon>
    `;
  }

  startAudio() {
    this.record_audio += 1;
  }

  stopAudio() {
    this.record_audio -= 1;
  }

  startVideo() {
    this.record_video += 1;
  }

  stopVideo() {
    this.record_video -= 1;
  }
}

customElements.define("status-icons", StatusIcons);
