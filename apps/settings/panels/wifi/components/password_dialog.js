// A dialog box to enter wifi credentials

class PasswordDialog extends HTMLElement {
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
            <header data-l10n-id="password-for" data-l10n-args='{"ssid": "${ssid}"}'></header>
            <div class="password-input">
              <input id="password" type="password">
              <lucide-icon id="eye-toggle" kind="eye-off"></lucide-icon>
            </div>
            <div class="buttons">
                <button id="done" data-l10n-id="button-ok"></button>
                <button id="cancel" data-l10n-id="button-cancel"></button>
            </div>
          </div>
        </div>
        `;

    document.l10n.translateFragment(shadow);

    this.input = shadow.querySelector("#password");
    let done = shadow.querySelector("#done");
    done.onclick = () => {
      this.password = this.input.value;
      this.dispatchEvent(new Event("password-done"));
    };
    let cancel = shadow.querySelector("#cancel");
    cancel.onclick = () => {
      this.dispatchEvent(new Event("password-cancel"));
    };

    this.eyeOn = false;
    let eyeIcon = shadow.querySelector("#eye-toggle");
    eyeIcon.onclick = () => {
        this.eyeOn = !this.eyeOn;
        if (this.eyeOn) {
            eyeIcon.setAttribute("kind", "eye");
            this.input.removeAttribute("type");
        } else {
            eyeIcon.setAttribute("kind", "eye-off");
            this.input.setAttribute("type", "password");
        }
    }
  }

  activate() {
    this.input.focus();
  }
}

customElements.define("password-dialog", PasswordDialog);
