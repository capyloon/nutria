// the <status-icons> component

class StatusIcons extends LitElement {
  constructor() {
    super();

    this.geoloc = false;
    this.tor = false;
  }

  static get properties() {
    return {
      geoloc: { type: Boolean },
      tor: { type: Boolean },
    };
  }

  render() {
    let opened = this.geoloc || this.tor;
    if (opened) {
        this.classList.remove("hidden");
    } else {
        this.classList.add("hidden");
    }

    return html`
      <link rel="stylesheet" href="components/status_icons.css" />
      <sl-icon name="map-pin" hidden="${!this.geoloc}"></sl-icon>
      <img src="./resources/tor.ico" hidden="${!this.tor}">
    `;
  }
}

customElements.define("status-icons", StatusIcons);
