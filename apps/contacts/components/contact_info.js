// Custom element for a <contact-info> element

export class ContactInfo extends LitElement {
  constructor(contact) {
    super();
    this.contact = contact;
    this.log(`constructor: ${contact.id}`);
    this.opened = false;
  }

  log(msg) {
    console.log(`ContactInfo: ${msg}`);
  }

  static get properties() {
    return {
      contact: { state: true },
    };
  }

  switchMode() {
    let details = this.shadowRoot.querySelector(".details");
    let actions = this.shadowRoot.querySelector(".actions");

    this.opened = !this.opened;
    if (this.opened) {
      details.classList.remove("hidden");
      actions.classList.remove("hidden");
    } else {
      details.classList.add("hidden");
      actions.classList.add("hidden");
    }
  }

  onAction(event) {
    let action = event.target.dataset.action;
    if (action === "delete") {
      this.log(`About to delete contact ${this.contact.id}`);
      this.dispatchEvent(new CustomEvent("delete-contact"));
    } else {
      this.log(`Unsupported action: '${action}'`);
    }
  }

  render() {
    let initials = this.contact.name
      .split(" ")
      .map((s) => s[0])
      .join("");

    return html`<link rel="stylesheet" href="components/contact_info.css" />
      <div class="main" @click="${this.switchMode}">
        <sl-avatar initials="${initials}"></sl-avatar>${this.contact.name}
      </div>
      <div class="details hidden">
        <div>
          ${this.contact.phone.map(
            (phone) => html`<div class="comm-item"><sl-icon name="phone"></sl-icon><a href="tel://${phone}">${phone}</a></div>`
          )}
        </div>
        <div>
          ${this.contact.phone.map(
            (phone) => html`<div class="comm-item"><sl-icon name="message-circle"></sl-icon><a href="sms://${phone}">${phone}</a></div>`
          )}
        </div>
        <div>
          ${this.contact.email.map(
            (email) => html`<div class="comm-item"><sl-icon name="mail"></sl-icon><a href="mailto:${email}">${email}</a></div>`
          )}
        </div>
      </div>
      <div class="actions hidden">
        <sl-icon-button @click="${this.onAction}" data-action="edit" name="edit"></sl-icon-button>
        <sl-icon-button @click="${this.onAction}" data-action="scan" name="qr-code"></sl-icon-button>
        <sl-icon-button @click="${this.onAction}" data-action="delete" name="trash-2"></sl-icon-button>
      </div> `;
  }
}

customElements.define("contact-info", ContactInfo);
