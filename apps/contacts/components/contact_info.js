// Custom element for a <contact-info> element

export class ContactInfo extends LitElement {
  constructor(contact) {
    super();
    this.contact = contact;
    this.known = [];
    this.paired = [];
    this.log(`constructor: ${contact.id} ${contact.photoUrl}`);
    this.opened = false;
  }

  log(msg) {
    console.log(`ContactInfo: ${msg}`);
  }

  static get properties() {
    return {
      contact: { state: true },
      known: { state: true },
      paired: { state: true },
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
    this.dispatchEvent(new CustomEvent(`${action}-contact`));
  }

  updatePeerInfo(known, paired) {
    this.known = known;
    this.paired = paired;
  }

  launchTile(event) {
    let index = event.target.dataset.pairedIndex;
    let session = this.paired[index];

    this.log(`launching tile for session ${index}`);
    try {
      let act = new WebActivity("p2p-tile-start", { sessionId: session.id });
      act.start();
    } catch (e) {
      console.error(
        `p2p: failed to launch tile for session ${session.id}: ${e}`
      );
    }
    event.stopPropagation();
    event.preventDefault();
  }

  updated() {
    document.l10n.translateFragment(this.shadowRoot);
  }

  emptyArray(array) {
    let res = true;
    array.forEach((item) => {
      if (item.length > 0) {
        console.log(`Found ${item}, len=${item.length}`);
        res = false;
      }
    });
    return res;
  }

  render() {
    let initials = this.contact.name
      .split(" ")
      .map((s) => s[0])
      .join("");

    return html`<link rel="stylesheet" href="components/contact_info.css" />
      <div class="main" @click="${this.switchMode}">
        <sl-avatar
          initials="${initials}"
          image="${this.contact.photoUrl}?${Math.random()}"
        ></sl-avatar>
        <span>${this.contact.name}</span>
        <div class="flex-fill"></div>
        ${this.paired.map((_paired, index) => {
          return html`<sl-button
            data-l10n-id="contact-launch-app"
            data-paired-index="${index}"
            @click="${this.launchTile}"
            size="small"
            variant="success"
          ></sl-button>`;
        })}
      </div>
      <div class="details hidden">
        <div class="${this.emptyArray(this.contact.phone) ? "hidden" : ""}">
          ${this.contact.phone.map(
            (phone) =>
              html`<div class="comm-item">
                <sl-icon name="phone"></sl-icon
                ><a href="tel://${phone}">${phone}</a>
              </div>`
          )}
        </div>
        <div class="${this.emptyArray(this.contact.phone) ? "hidden" : ""}">
          ${this.contact.phone.map(
            (phone) =>
              html`<div class="comm-item">
                <sl-icon name="message-circle"></sl-icon>
                <a href="sms://${phone}">${phone}</a>
              </div>`
          )}
        </div>
        <div class="${this.emptyArray(this.contact.email) ? "hidden" : ""}">
          ${this.contact.email.map(
            (email) =>
              html`<div class="comm-item">
                <sl-icon name="mail"></sl-icon>
                <a href="mailto:${email}">${email}</a>
              </div>`
          )}
        </div>
        <div>
          ${this.contact.did.map(
            (did) =>
              html`<div class="comm-item did">
                <sl-icon name="key"></sl-icon>
                ${did.name} | ${did.uri}
              </div>`
          )}
        </div>
      </div>
      <div class="actions hidden">
        <sl-icon-button
          @click="${this.onAction}"
          data-action="edit"
          name="edit"
        ></sl-icon-button>
        <sl-icon-button
          @click="${this.onAction}"
          data-action="publish"
          name="qr-code"
        ></sl-icon-button>
        <sl-icon-button
          @click="${this.onAction}"
          data-action="delete"
          name="trash-2"
        ></sl-icon-button>
      </div> `;
  }
}

customElements.define("contact-info", ContactInfo);
