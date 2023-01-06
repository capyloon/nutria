// QR Code result dialog

// Represents a <qr-dialog> dialog, displaying the text decoded QRCode,
// and allowing clipboard copy as well as sharing activity.

class QrDialog extends LitElement {
  constructor() {
    super();
    this.value = null;
    this.log(`constructor`);
  }

  static get properties() {
    return {
      value: { state: true },
    };
  }

  log(msg) {
    console.log(`QrDialog: ${msg}`);
  }

  error(msg) {
    console.error(`QrDialog: ${msg}`);
  }

  updated() {
    document.l10n.translateFragment(this.shadowRoot);
  }

  render() {
    this.log(`render`);

    return html` <link rel="stylesheet" href="components/qr_dialog.css" />
      <sl-dialog data-l10n-id="qr-dialog-title" data-l10n-attrs="label">
        <div class="container">
          <div class="text">${this.value}</div>
          <div>
            <sl-icon-button
              @click="${this.copyToClipboard}"
              name="clipboard-copy"
              data-l10n-id="qr-dialog-copy"
              data-l10n-attrs="label"
            ></sl-icon-button>
            <sl-icon-button
              @click="${this.share}"
              name="share-2"
              data-l10n-id="qr-dialog-share"
              data-l10n-attrs="label"
            ></sl-icon-button>
          </div>
        </div>
        <sl-button
          @click="${this.close}"
          slot="footer"
          variant="primary"
          data-l10n-id="qr-dialog-close"
        ></sl-button>
      </sl-dialog>`;
  }

  get dialog() {
    return this.shadowRoot.querySelector("sl-dialog");
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.value).then(
      async () => {
        let msg = await window.utils.l10n("qr-dialog-copied");
        this.log(msg);
        // TODO: toaster over rpc with system app.
        // window.toaster.show(msg);
      },
      (err) => {
        this.error(`Failure copying '${this.value}' to the clipboard: ${err}`);
      }
    );
  }

  share() {
    let activity = new WebActivity("share", { type: "text", text: this.value });
    activity.start();
  }

  close() {
    this.value = null;
    this.dialog.hide();
  }

  open(value) {
    this.log(`open`);
    if (!value) {
      this.error(`no value!`);
      return;
    }
    this.value = value;
    this.dialog.show();
  }
}

customElements.define("qr-dialog", QrDialog);
