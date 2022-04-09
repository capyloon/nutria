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

      :host sl-progress-bar {
        --height: 0.5rem;
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

    let progress = html``;
    if (notification.data?.progress !== undefined) {
      let value = notification.data.progress;

      if (value < 0) {
        progress = html`<sl-progress-bar indeterminate></sl-progress-bar>`;
      } else {
        value = Math.max(0, Math.min(value, 100));
        progress = html`<sl-progress-bar value="${value}"></sl-progress-bar>`;
      }
    }

    return html`
      <sl-alert variant="neutral" closable open>
        <div class="icon-slot" slot="icon">${iconPart}</div>
        <div @click=${this.clicked}>
          <div><strong class="title">${notification.title}</strong></div>
          <div class="message">${notification.text}</div>
          ${progress}
        </div>
      </sl-alert>
    `;
  }

  handleEvent(event) {
    if (event.type === "sl-after-hide") {
      this._wrapper.close();
      this._wrapper.remove();
      this.close();
    } else {
      console.error(`WebNotification: unexpected event: ${event.type}`);
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
