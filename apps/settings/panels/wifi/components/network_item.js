// Encapsulate displaying a scanResult from the wifi API.

class NetworkItem extends HTMLElement {
  constructor() {
    super();
  }

  configure(manager, network, liveMode) {
    this.manager = manager;
    this.network = network;
    this.liveMode = liveMode;
  }

  connectedCallback() {
    let freq = this.network.frequency > 5000 ? "5GHz" : "2.4GHz";
    let ssid = this.network.ssid.trim();
    let security = this.network.security.trim();
    let isOpen = security === "OPEN";

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
        <link rel="stylesheet" href="components/network_item.css">
        <span class="maybe-lock">${isOpen ? "" : "<lucide-icon kind=lock></lucide-icon>"}</span>
        <span class="network-name">${ssid}<span class="secondary">${freq} ${
      isOpen ? "" : security
    }</span></span>
        <span class="state ${
          this.network.connected ? "" : "disconnected"
        }" data-l10n-id="state-connected"></span>
        `;

    document.l10n.translateFragment(shadow);

    shadow.addEventListener("click", this, true);
  }

  handleEvent(event) {
    if (event.type !== "click") {
      console.error(`Unexpected event on <network-item> : ${event.type}`);
      return;
    }

    if (this.liveMode) {
      this.associate();
    } else {
      this.forget();
    }
  }

  associate() {
    if (this.network.security !== "OPEN") {
      let dialog = document.createElement("password-dialog");
      dialog.setAttribute("ssid", this.network.ssid);
      dialog.addEventListener(
        "password-done",
        () => {
          document.body.removeChild(dialog);
          switch (this.network.security) {
            case "WPA-EAP":
              this.network.password = dialog.password;
              break;
            case "WPA2-PSK":
              this.network.psk = dialog.password;
              break;
            default:
              console.error(
                `Unsupported Wifi security mode: ${this.network.security}`
              );
              break;
          }

          this.manager.associate(this.network);
        },
        { once: true }
      );
      dialog.addEventListener(
        "password-cancel",
        () => {
          document.body.removeChild(dialog);
        },
        { once: true }
      );
      document.body.appendChild(dialog);
      dialog.activate();
    } else {
      this.manager.associate(this.network);
    }
  }

  forget() {
    let dialog = document.createElement("forget-dialog");
    dialog.setAttribute("ssid", this.network.ssid);
    dialog.addEventListener(
      "forget-done",
      () => {
        document.body.removeChild(dialog);
        this.manager.forget(this.network).then(() => {
          // Remove ourselves from the list once successfully forgotten.
          // TODO: move that somewhere else, we should not have to know that we
          // actually need to remove the parent <li> element.
          let parent = this.parentNode;
          parent.parentNode.removeChild(parent);
        });
      },
      { once: true }
    );
    dialog.addEventListener(
      "forget-cancel",
      () => {
        document.body.removeChild(dialog);
      },
      { once: true }
    );
    document.body.appendChild(dialog);
  }
}

customElements.define("network-item", NetworkItem);
