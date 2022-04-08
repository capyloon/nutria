// <web-notification> web component
// Displays a single notification.

export class WebNotification extends LitElement {
  constructor(wrapper) {
    super();

    this._wrapper = wrapper;
    this._count = 0;
    this.addEventListener("sl-after-hide", this);
  }

  static properties = {
    _count: { state: true },
  };

  static get styles() {
    return css`
      :host .icon {
        width: 2.5em;
      }

      :host sl-alert::part(base) {
        border-top-width: var(--sl-panel-border-width);
        border-top-color: var(--sl-panel-border-color);
      }
    `;
  }

  setNotification(wrapper) {
    this._wrapper = wrapper;
    // this._wrapper doesn´t actually change, only the inner notification values,
    // so we trigger re-rendering with this ugly hack.
    this._count += 1;
  }

  render() {
    let notification = this._wrapper.notification;

    let iconPart = html`<img class="icon" src="${notification.icon}" />`;
    if (notification.icon.startsWith("system-icon:")) {
      iconPart = html`<sl-icon
        class="icon"
        name=${notification.icon.split(":")[1]}
      ></sl-icon>`;
    }

    return html`
      <sl-alert variant="neutral" closable open>
        <div class="icon-slot" slot="icon">${iconPart}</div>
        <div @click=${this.clicked}>
          <div><strong class="title">${notification.title}</strong></div>
          <div class="message">${notification.text}</div>
        </div>
      </sl-alert>
    `;
  }

  handleEvent(event) {
    if (event.type === "sl-after-hide") {
      this._wrapper.remove();
      this.close();
    } else {
      console.error(`XYZ WebNotification: unexpected event: ${event.type}`);
    }
  }

  clicked() {
    this._wrapper.click();
    this._wrapper.remove();
    this.close();
    this.dispatchEvent(new CustomEvent("clicked"));
  }

  close() {
    this.removeEventListener("sl-after-hide", this);
    this.remove();
  }
}

customElements.define("web-notification", WebNotification);
