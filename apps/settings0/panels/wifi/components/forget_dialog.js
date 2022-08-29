// A dialog box to confirm forgetting a network.

class ForgetDialog extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    let shadow = this.attachShadow({ mode: "open" });
    let ssid = this.getAttribute("ssid");
    shadow.innerHTML = `
        <link rel="stylesheet" href="components/password_dialog.css">
        <link rel="stylesheet" href="http://shared.localhost:${location.port}/style/elements.css">
        <div class="modal">
          <div class="container">
            <header data-l10n-id="forget-title" data-l10n-args='{"ssid": "${ssid}"}'></header>
            <div class="buttons">
                <button id="done" data-l10n-id="button-forget"></button>
                <button id="cancel" data-l10n-id="button-cancel"></button>
            </div>
          </div>
        </div>
        `;

    document.l10n.translateFragment(shadow);

    let done = shadow.querySelector("#done");
    done.onclick = () => {
      this.dispatchEvent(new Event("forget-done"));
    };
    let cancel = shadow.querySelector("#cancel");
    cancel.onclick = () => {
      this.dispatchEvent(new Event("forget-cancel"));
    };
  }
}

customElements.define("forget-dialog", ForgetDialog);
