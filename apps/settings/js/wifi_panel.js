// Wifi panel management module.

const PanelModes = {
  LIVE_NETWORKS: "live-mode",
  SAVED_NETWORKS: "saved-mode",
};

// Builds a <sl-menu-item> to display a network.
function buildNetworkItem(network) {
  let freq = network.frequency > 5000 ? "5GHz" : "2.4GHz";
  let ssid = network.ssid.trim();
  let security = network.security.trim();
  let isOpen = security === "OPEN";
  let securityLabel = isOpen ? "" : security;

  let outer = document.createElement("sl-menu-item");
  outer.innerHTML = `
      <sl-icon slot=prefix name=${isOpen ? "_empty_" : "lock"}></sl-icon>
      <div class="network-name">
        <div class="ssid">${ssid}</div>
        <div class="secondary">${freq} ${securityLabel}</div>
      </div>
      ${network.connected ? "<sl-icon name=wifi slot=suffix></sl-icon>" : ""}`;
  outer.network = network;
  return outer;
}

// Helper to manage the password input dialog.
// Usage is:
// let dialog =  new PasswordDialog(network);
// let answer = await dialog.result();
class PasswordDialog {
  constructor(network) {
    this.network = network;
    this.dialog = document.getElementById("wifi-password-dialog");
    this.input = document.getElementById("wifi-password-input");
    this.input.value = "";

    this.input.addEventListener("sl-input", this);

    this.dialog.label = network.ssid.trim();

    this.dialog.addEventListener(
      "sl-initial-focus",
      (event) => {
        event.preventDefault();
        this.input.focus();
      },
      { once: true }
    );

    this.dialog.addEventListener(
      "sl-request-close",
      (event) => {
        this.input.blur();
        this.dialog.hide();
      },
      { once: true }
    );

    this.btnCancel = this.dialog.querySelector(
      "sl-button[data-l10n-id = btn-cancel]"
    );
    this.btnCancel.isOk = false;
    this.btnCancel.addEventListener("click", this);

    this.btnOk = this.dialog.querySelector("sl-button[data-l10n-id = btn-ok]");
    this.btnOk.isOk = true;
    this.btnOk.addEventListener("click", this);
    this.btnOk.disabled = true;
  }

  result() {
    this.resolver = null;
    return new Promise((resolve) => {
      this.resolver = resolve;
    });
  }

  updateValidity() {
    this.input.reportValidity();
    this.btnOk.disabled = this.input.invalid;
  }

  handleEvent(event) {
    if (event.type === "click") {
      this.close(event.target);
      return;
    } else if (event.type === "sl-input") {
      this.updateValidity();
    }
  }

  close(target) {
    this.dialog.hide();

    this.btnOk.removeEventListener("click", this);
    this.btnCancel.removeEventListener("click", this);
    this.input.removeEventListener("sl-input", this);

    this.resolver({ password: this.input.value, success: target.isOk });
  }

  show() {
    this.dialog.show();
  }
}

class WifiPanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("wifi-panel");
    this.ready = false;
    this.panel.addEventListener("panel-ready", this);

    this.panelMode = PanelModes.LIVE_NETWORKS;
  }

  log(msg) {
    console.log(`WifiPanel: ${msg}`);
  }

  error(msg) {
    console.error(`WifiPanel: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "panel-ready") {
      this.init();
    }
  }

  clearNetworkList() {
    let list = this.panel.querySelector("sl-menu");
    list
      .querySelector("sl-menu-item[data-l10n-id = wifi-no-network]")
      .classList.remove("hidden");

    let items = this.panel.querySelectorAll("sl-menu sl-menu-item");
    items.forEach((item) => {
      if (!item.disabled) {
        item.remove();
      }
    });
    document.getElementById("wifi-divider").classList.add("hidden");
  }

  async forceScan() {
    this.log("start forced scan");
    this.forceScanButton.loading = true;
    this.forceScanButton.disabled = true;
    try {
      this.updateNetworkList(await this.manager.getNetworks());
    } catch (e) {
      this.error(`Wifi error: ${e}`);
    }
    this.forceScanButton.loading = false;
    this.forceScanButton.disabled = false;
  }

  updateNetworkList(networks) {
    this.log(`scan result: ${networks.length} APs`);

    let list = this.panel.querySelector("sl-menu");
    this.clearNetworkList();

    // No network, just show the placeholder.
    if (networks.length == 0) {
      list
        .querySelector("sl-menu-item[data-l10n-id = wifi-no-network]")
        .classList.remove("hidden");
      return;
    }

    // Hide the "No Network" menu item.
    list
      .querySelector("sl-menu-item[data-l10n-id = wifi-no-network]")
      .classList.add("hidden");

    // Sort the network list by signal strength.
    networks.sort((n1, n2) => {
      return n1.relSignalStrength < n2.relSignalStrength;
    });

    networks.forEach((network) => {
      let ssid = network.ssid.trim();
      if (!ssid.length) {
        return;
      }

      let item = buildNetworkItem(network);

      // Make sure the connected network will be the first of the list.
      if (network.connected) {
        list.prepend(item);
        document.getElementById("wifi-divider").classList.remove("hidden");
      } else {
        list.appendChild(item);
      }
    });
  }

  async associateNetwork(network) {
    this.log(`About to associate with ${network.ssid}`);
    if (network.security !== "OPEN") {
      let dialog = new PasswordDialog(network);
      dialog.show();
      let result = await dialog.result();
      this.log(`Dialog result is ${JSON.stringify(result)}`);
      if (result.success) {
        switch (network.security) {
          case "WPA-EAP":
            network.password = result.password;
            break;
          case "WPA2-PSK":
            network.psk = result.password;
            break;
          default:
            console.error(
              `Unsupported Wifi security mode: ${this.network.security}`
            );
            break;
        }

        this.manager.associate(network);
      }
    } else {
      this.manager.associate(network);
    }
  }

  async init() {
    if (this.ready) {
      return;
    }

    this.ready = true;

    let manager = navigator.b2g?.wifiManager;
    if (!manager) {
      this.error("navigator.b2g.wifiManager is not available.");
      return;
    }

    this.manager = manager;

    let onOffSwitch = document.getElementById("wifi-on-off-switch");
    onOffSwitch.checked = manager.enabled;
    onOffSwitch.addEventListener("sl-change", () => {
      manager.setWifiEnabled(onOffSwitch.checked);
    });

    this.forceScanButton = this.panel.querySelector("#wifi-rescan");
    if (!manager.enabled) {
      this.forceScanButton.disabled = true;
    }

    this.forceScanButton.onclick = () => {
      this.forceScan();
    };

    this.savedNetworksButton = this.panel.querySelector("#wifi-saved-networks");
    this.savedNetworksButton.onclick = async () => {
      this.panelMode =
        this.panelMode == PanelModes.SAVED_NETWORKS
          ? PanelModes.LIVE_NETWORKS
          : PanelModes.SAVED_NETWORKS;

      this.clearNetworkList();

      if (this.panelMode == PanelModes.SAVED_NETWORKS) {
        this.forceScanButton.classList.add("hidden");
        this.savedNetworksButton.dataset.l10nId = "wifi-saved-networks-back";
        this.updateNetworkList(await manager.getKnownNetworks());
      } else {
        this.forceScanButton.classList.remove("hidden");
        this.savedNetworksButton.dataset.l10nId = "wifi-saved-networks";
        this.forceScan();
      }
    };

    let statusText = document.getElementById("wifi-status-text");
    statusText.setAttribute(
      "data-l10n-id",
      `wifi-status-${manager.enabled ? "enabled" : "disabled"}`
    );

    let statusIcon = document.getElementById("wifi-status-icon");
    if (manager.enabled) {
      statusIcon.name = "wifi";
    } else {
      statusIcon.name = "wifi-off";
    }

    let list = this.panel.querySelector("sl-menu");
    list.addEventListener("sl-select", async (event) => {
      let network = event.detail.item.network;
      if (this.panelMode === PanelModes.LIVE_NETWORKS) {
        await this.associateNetwork(network);
      } else {
        // TODO: confirmation prompt
        await this.manager.forget(network);
        event.detail.item.remove();
        this.updateNetworkList(await manager.getKnownNetworks());
      }
    });

    manager.onenabled = () => {
      this.forceScanButton.disabled = false;
      statusIcon.name = "wifi";
      statusText.setAttribute("data-l10n-id", "wifi-status-enabled");
      onOffSwitch.checked = true;
      this.forceScan();
    };

    manager.ondisabled = () => {
      this.forceScanButton.disabled = true;
      statusText.setAttribute("data-l10n-id", "wifi-status-disabled");
      onOffSwitch.checked = false;
      statusIcon.name = "wifi-off";
      this.updateNetworkList([]);
    };

    manager.onscanresult = (event) => {
      if (this.panelMode === PanelModes.LIVE_NETWORKS) {
        this.updateNetworkList(manager, event.scanResult);
      }
    };

    if (manager.enabled) {
      this.forceScan();
    }
  }
}

const wifiPanel = new WifiPanel();
