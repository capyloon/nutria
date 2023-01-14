// UCAN related features:
// - Setup of the UI provider.
// - Implementation of the provider dialog.

class UcanDialog extends LitElement {
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
    this.requested = null;
  }

  static get properties() {
    return {
      requested: { state: true },
    };
  }

  log(msg) {
    console.log("UcanDialog:", msg);
  }

  error(msg) {
    console.error("UcanDialog:", msg);
  }

  updated() {
    document.l10n.translateFragment(this.shadowRoot);
  }

  // Updates the permission name to recognizes well-known scope + capabilities patterns.
  mapPermission(scope, permission) {
    // /places/ access is mapped to 'history' access.
    if (scope === "/places/") {
      if (permission === "vfs-read") {
        permission = "history-read";
      } else if (permission === "vfs-write") {
        permission = "history-write";
      }
    }

    return permission;
  }

  render() {
    this.log(`render ${JSON.stringify(this.requested)}`);

    let items = [];
    if (this.requested?.capabilities) {
      this.requested.capabilities.forEach((cap, index) => {
        let args = JSON.stringify({ scope: cap.scope.pathname });
        let permission = this.mapPermission(
          cap.scope.pathname,
          cap.action.toLowerCase().replace("/", "-")
        );
        items.push(
          html`<sl-menu-item
            class="capability"
            type="checkbox"
            data-l10n-id="ucan-permission-${permission}"
            data-l10n-args="${args}"
            data-capability="${index}"
          ></sl-menu-item>`
        );
      });
    }

    let dids = [];
    if (this.dids) {
      this.dids.forEach((did, index) => {
        if (did.name != "superuser") {
          dids.push(
            html`<sl-option value="did-${index}">${did.name}</sl-option>`
          );
        }
      });
    }

    let durations = [];
    [
      { l10n: "10min", seconds: 10 * 60 },
      { l10n: "1hour", seconds: 3600 },
      { l10n: "1day", seconds: 24 * 3600 },
      { l10n: "1week", seconds: 7 * 24 * 3600 },
      { l10n: "1month", seconds: 30 * 24 * 3600 },
    ].forEach((duration, index) => {
      durations.push(
        html`<sl-option
          value="duration-${duration.seconds}"
          data-l10n-id="ucan-duration-${duration.l10n}"
        ></sl-option>`
      );
    });

    return html`<link rel="stylesheet" href="components/ucan_dialog.css" />
      <sl-dialog data-l10n-id="ucan-dialog-title" data-l10n-attrs="label">
        <div class="container">
          <div
            class="description"
            data-l10n-id="ucan-select-url"
            data-l10n-args="${JSON.stringify({
              url: this.requested?.url?.hostname,
            })}"
          ></div>

          <sl-select
            hoist
            id="did-list"
            value="did-1"
            data-l10n-attrs="label"
            data-l10n-id="ucan-select-did"
            >${dids}</sl-select
          >
          <sl-menu>${items}</sl-menu>

          <sl-select
            hoist
            id="duration-list"
            value="duration-600"
            data-l10n-attrs="label"
            data-l10n-id="ucan-select-duration"
            >${durations}</sl-select
          >

          <div class="buttons">
            <sl-button
              @click="${this.buttonClick}"
              variant="primary"
              data-l10n-id="ucan-button-grant"
              data-result="grant"
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

  close() {
    this.dialog.hide();
    this.reset();
  }

  buttonClick(event) {
    let issuer =
      this.dids[this.shadowRoot.querySelector("#did-list").value.split("-")[1]];
    let seconds = this.shadowRoot
      .querySelector("#duration-list")
      .value.split("-")[1];

    let capabilities = [];
    this.shadowRoot.querySelectorAll(".capability").forEach((cap) => {
      if (cap.checked) {
        capabilities.push(this.requested.capabilities[cap.dataset.capability]);
      }
    });
    this.close();
    this.deferred.resolve({
      result: event.target.dataset.result,
      issuer,
      seconds,
      capabilities,
    });
  }

  // This function returns a promise that resolves with the id of the button
  // that was clicked, or reject if the dialog is dismissed.
  open(requested, dids) {
    this.log(`open ${requested}`);
    if (!requested) {
      this.error(`invalid data!`);
      return Promise.reject();
    }
    this.reset();

    this.dids = dids;
    this.requested = requested;

    this.dialog.show();
    return new Promise((resolve, reject) => {
      this.deferred = { resolve, reject };
    });
  }
}

customElements.define("ucan-dialog", UcanDialog);

// Manages the interactions with the dweb service.
export class Ucan {
  constructor() {
    this.ready = this.init();
  }

  async init() {
    this.dweb = await window.apiDaemon.getDwebService();
    this.lib = await window.apiDaemon.getLibraryFor("DwebService");

    try {
      await this.dweb.setUcanUi(this.grantCapabilities.bind(this));
    } catch (e) {
      this.error(`Failed to setup UCAN ui: ${e}`);
    }
    this.log("ready!");
  }

  grantCapabilities(requested) {
    this.log(`grantCapabilities ${requested.url.href} ${requested.audience}`);
    for (let cap of requested.capabilities) {
      this.log(`${cap.action} ON ${cap.scope.href}`);
    }
    return new Promise(async (resolve, reject) => {
      // Get the list of usable DIDs.
      let dids = await this.dweb.getDids();
      // There should always be at least the "superuser" did, but we don't
      // want to use it.
      if (dids.length <= 1) {
        this.error(`No DIDs available, cancelling.`);
        reject(this.lib.UcanError.UI_CANCEL);
      }

      let ucanDialog = document.querySelector("ucan-dialog");
      let cancelled = true;
      let answer;
      try {
        answer = await ucanDialog.open(requested, dids);
        cancelled = answer.result == "cancel";
      } catch (e) {
        this.log(`UCAN dialog cancelled : ${e}`);
        cancelled = true;
      }

      if (cancelled) {
        return;
      }

      this.log(`UCAN: granted: ${JSON.stringify(answer)}`);

      //   this.log(`Using DID: ${JSON.stringify(answer.issuer)}`);
      let notBefore = new Date();
      let expiration = new Date(notBefore.getTime() + answer.seconds * 1000);
      let response = {
        issuer: answer.issuer,
        capabilities: answer.capabilities,
        notBefore,
        expiration,
      };
      this.log(`Resolving query...`);
      resolve(response);
    });
  }

  log(msg) {
    console.log("UCAN:", msg);
  }

  error(msg) {
    console.log("UCAN:", msg);
  }
}
