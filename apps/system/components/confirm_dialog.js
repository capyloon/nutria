// Represents a <confirm-dialog> dialog.

class ConfirmDialog extends LitElement {
  constructor() {
    super();
    this.data = { title: "", text: "", buttons: [], focused: null };
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
    if (!this.data.focused) {
      return;
    }
    document.l10n.translateFragment(this.shadowRoot);

    let button = this.shadowRoot.querySelector("sl-button.initial-focus");
    if (button) {
      // lit.html fails in the focus() call without this setTimeout :()
      window.setTimeout(() => button.focus(), 0);
    }
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
                  class="${button.id == this.data.focused
                    ? "initial-focus"
                    : ""}"
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
    this.data = { title: "", text: "", buttons: [], focused: null };
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
  //   buttons: [ { id: "button-1", label: "First Choice", variant: "primary" }],
  //   focused: <id of button to focus when the dialog is opened>
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

    if (!this.data.focused) {
      this.data.focused = this.data.buttons[0].id;
    }

    this.dialog.show();
    return new Promise((resolve, reject) => {
      this.deferred = { resolve, reject };
    });
  }
}

customElements.define("confirm-dialog", ConfirmDialog);
