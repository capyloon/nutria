// Represents a <publish-dialog> dialog used for IPFS publishing.

class PublishDialog extends LitElement {
  constructor() {
    super();
    this.reset();
    this.deferred = null;
    this.log(`constructor`);
    this.addEventListener("sl-request-close", () => {
      this.deferred.reject();
    });
  }

  reset() {
    this.name = "";
    this.isPublic = true;
    this.password = null;
  }

  static get properties() {
    return {
      name: { state: true },
      isPublic: { state: true },
    };
  }

  log(msg) {
    console.log(`PublishDialog: ${msg}`);
  }

  error(msg) {
    console.error(`PublishDialog: ${msg}`);
  }

  updated() {
    document.l10n.translateFragment(this.shadowRoot);
  }

  render() {
    this.log(`render`);
    let nameArg = JSON.stringify({ name: this.name });
    let publicOrPrivate = `ipfs-confirm-publish-${
      this.isPublic ? "public" : "private"
    }`;

    return html` <link rel="stylesheet" href="components/publish_dialog.css" />
      <sl-dialog data-l10n-id="ipfs-publish-dialog-title" data-l10n-attrs="label">
        <div class="container">
          <sl-radio-group label="Publication Mode">
            <sl-radio-button class="public" @click="${this.setPublic}" checked
              >Public</sl-radio-button
            >
            <sl-radio-button class="private" @click="${this.setPrivate}"
              >Private</sl-radio-button
            >
          </sl-radio-group>

          <div
            class="text"
            data-l10n-args="${nameArg}"
            data-l10n-id="${publicOrPrivate}"
          ></div>

          <sl-input
            @input="${this.onPasswordChange}"
            type="password"
            class="${this.isPublic ? "hidden" : ""}"
            toggle-password
            data-l10n-id="ipfs-publish-password"
            data-l10n-attrs="label"
          ></sl-input>

          <div class="buttons">
            <sl-button
              @click="${this.buttonClick}"
              variant="primary"
              data-l10n-id="ipfs-button-publish"
              data-result="publish"
            ></sl-button>
            <sl-button
              @click="${this.buttonClick}"
              variant="neutral"
              data-l10n-id="button-cancel"
              data-result="cancel"
            ></sl-button>
          </div>
        </div>
      </sl-dialog>`;
  }

  get dialog() {
    return this.shadowRoot.querySelector("sl-dialog");
  }

  setPublic() {
    this.isPublic = true;
  }

  setPrivate() {
    this.isPublic = false;
  }

  onPasswordChange(event) {
    this.password = event.target.value;
  }

  close() {
    this.dialog.hide();
    this.reset();
  }

  buttonClick(event) {
    let password = this.isPublic ? null : this.password;
    this.close();
    this.deferred.resolve({ result: event.target.dataset.result, password });
  }

  // data is:
  // {
  //   name: "some resource name",
  //   isPublic: true
  // }

  // This function returns a promise that resolves with the id of the button
  // that was clicked, or reject if the dialog is dismissed.
  open(data) {
    this.log(`open`);
    if (!data || !data.name) {
      this.error(`invalid data!`);
      return Promise.reject();
    }
    this.reset();
    this.name = data.name;
    // Consider that public publishing is the default when undefined
    this.isPublic = data.isPublic !== undefined ? data.isPublic : true;

    if (this.isPublic) {
      this.shadowRoot.querySelector(".public").setAttribute("checked", "true");
      this.shadowRoot.querySelector(".private").removeAttribute("checked");
    } else {
      this.shadowRoot.querySelector(".private").setAttribute("checked", "true");
      this.shadowRoot.querySelector(".public").removeAttribute("checked");
    }

    this.dialog.show();
    return new Promise((resolve, reject) => {
      this.deferred = { resolve, reject };
    });
  }
}

customElements.define("publish-dialog", PublishDialog);
