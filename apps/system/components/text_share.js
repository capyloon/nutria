// Represents a <text-share> dialog, displaying the text as a QRCode,
// and allowing clipboard copy as well as sharing activity.

class TextShare extends LitElement {
  constructor() {
    super();
    this.value = null;
    this.label = null;
    this.log(`constructor`);
  }

  static get properties() {
    return {
      value: { state: true },
      label: { state: true },
    };
  }

  log(msg) {
    console.log(`TextShare: ${msg}`);
  }

  error(msg) {
    console.error(`TextShare: ${msg}`);
  }

  updated() {
    document.l10n.translateFragment(this.shadowRoot);
  }

  render() {
    this.log(`render`);
    let isUrl = "";
    try {
      let _url = new URL(this.value);
    } catch (e) {
      isUrl = "hidden";
    }

    return html` <link rel="stylesheet" href="components/text_share.css" />
      <sl-dialog no-header>
        <div class="container">
          <sl-qr-code value="${this.value}"></sl-qr-code>
          <div class="text value">${this.value}</div>
          <div class="text">${this.label}</div>
          <div>
            <sl-icon-button
              @click="${this.copyToClipboard}"
              name="clipboard-copy"
              data-l10n-id="text-share-copy"
              data-l10n-attrs="label"
            ></sl-icon-button>
            <sl-icon-button
              @click="${this.share}"
              name="share-2"
              data-l10n-id="text-share-share"
              data-l10n-attrs="label"
              class="${isUrl}"
            ></sl-icon-button>
          </div>
          <sl-button
            @click="${this.close}"
            variant="primary"
            data-l10n-id="button-ok"
          ></sl-button>
        </div>
      </sl-dialog>`;
  }

  get dialog() {
    return this.shadowRoot.querySelector("sl-dialog");
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.value).then(
      async () => {
        let msg = await window.utils.l10n("text-share-copied");
        window.toaster.show(msg);
      },
      (err) => {
        this.error(`Failure copying '${this.value}' to the clipboard: ${err}`);
      }
    );
  }

  share() {
    let activity = new WebActivity("share", { type: "url", url: this.value });
    activity.start();
  }

  close() {
    this.value = null;
    this.label = null;
    this.dialog.hide();
  }

  open(data) {
    this.log(`open`);
    if (!data || !data.value) {
      this.error(`no data!`);
      return;
    }
    this.value = data.value;
    this.label = data.label || data.value;

    this.dialog.show();
  }
}

customElements.define("text-share", TextShare);
