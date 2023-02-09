// Represents a <confirm-dialog> dialog.

class ConfirmDialog extends LitElement {
  constructor() {
    super();
    this.data = { title: "", text: "", buttons: [] };
    this.deferred = null;
    this.log(`constructor`);
    this.addEventListener("sl-request-close", () => {
      this.deferred.reject();
    });
  }

  static get properties() {
    return {
      data: { state: true },
    };
  }

  log(msg) {
    console.log(`ConfirmDialog: ${msg}`);
  }

  error(msg) {
    console.error(`ConfirmDialog: ${msg}`);
  }

  updated() {
    document.l10n.translateFragment(this.shadowRoot);
  }

  render() {
    this.log(`render`);
    return html` <link rel="stylesheet" href="components/confirm_dialog.css" />
      <sl-dialog label="${this.data.title}">
        <div class="container">
          <div class="text">${this.data.text}</div>
          <div class="buttons">
            ${this.data.buttons.map(
              (button) =>
                html`<sl-button
                  @click="${this.buttonClick}"
                  data-id="${button.id}"
                  variant="${button.variant || "default"}"
                  >${button.label}</sl-button
                >`
            )}
          </div>
        </div>
      </sl-dialog>`;
  }

  get dialog() {
    return this.shadowRoot.querySelector("sl-dialog");
  }

  close() {
    this.data = { title: "", text: "", buttons: [] };
    this.dialog.hide();
  }

  buttonClick(event) {
    let id = event.target.dataset.id;
    this.dialog.addEventListener(
      "sl-after-hide",
      () => this.deferred.resolve(id),
      { once: true }
    );
    this.close();
  }

  // data is:
  // {
  //   title: "some title",
  //   text: "some text",
  //   buttons: [ { id: "button-1", label: "First Choice", variant: "primary" }]
  // }

  // This function returns a promise that resolves with the id of the button
  // that was clicked, or reject if the dialog is dismissed.
  open(data) {
    this.log(`open dialog=${this.dialog}`);
    if (!data || !data.buttons || !data.buttons.length) {
      this.error(`invalid data!`);
      return Promise.reject();
    }
    this.data = data;

    this.dialog.show();
    return new Promise((resolve, reject) => {
      this.deferred = { resolve, reject };
    });
  }
}

customElements.define("confirm-dialog", ConfirmDialog);
