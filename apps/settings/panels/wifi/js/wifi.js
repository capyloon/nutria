// Manages the wifi panel interactions.

const PanelModes = {
  LIVE_NETWORKS: "live-mode",
  SAVED_NETWORKS: "saved-mode",
};

var panelMode = PanelModes.LIVE_NETWORKS;

function associate(network) {
  return this.manager.associate(network);
}

function updateNetworkList(manager, networks) {
  console.log(`Wifi updateNetworkList ${networks.length} networks`);
  let list = document.getElementById("networks");
  let connectedList = document.getElementById("connected-networks");
  list.innerHTML = "";
  connectedList.innerHTML = "";

  if (!networks) {
    return;
  }

  // Sort the network list by signal strength.
  networks.sort((n1, n2) => {
    return n1.relSignalStrength < n2.relSignalStrength;
  });

  networks.forEach((network) => {
    let ssid = network.ssid.trim();
    if (!ssid.length) {
      return;
    }

    let item = document.createElement("sl-menu-item");
    let detail = document.createElement("div");
    detail.classList.add("wifi-detail");
    let nameElement = document.createElement("span");
    nameElement.classList.add("wifi-name");
    let statusElement = document.createElement("span");
    statusElement.classList.add("wifi-status");
    nameElement.innerText = network.ssid.trim();
    statusElement.setAttribute("data-l10n-id", network.connected ? "wifi-connected" 
      : (network.known ? "wifi-saved" 
      : (network.security === "OPEN" ? "wifi-open" : "wifi-secure")));
    let icon = document.createElement("sl-icon");
    icon.name = network.connected ? "wifi" : (network.known ? "wifi-off" : (network.security === "OPEN" ? "shield-alert": "lock"));
    icon.slot = "prefix";

    detail.appendChild(nameElement);
    detail.appendChild(statusElement);
    item.appendChild(icon);
    item.appendChild(detail);

    // Make sure the connected network will be in the correct list.
    if (network.connected) {
      connectedList.appendChild(item);
    } else {
      list.appendChild(item);
    }
  });
}

function clearNetworkList() {
  window.networks.innerHTML = "";
}

function createMockContent() {
  let networks = [];
  for (let i = 0; i < 50; i++) {
    networks.push({
      ssid: `Network #${i}`,
      security: i < 4 ? "OPEN" : "WPA-EAP",
      frequency: 5200,
      connected: i === 5,
    });
  }

  updateNetworkList(null, networks);
}

function switchMode(newMode) {
  if (
    newMode !== PanelModes.LIVE_NETWORKS &&
    newMode !== PanelModes.SAVED_NETWORKS
  ) {
    console.error(`Wifi Invalid mode: ${newMode}`);
    return;
  }

  panelMode = newMode;

  /*let footer = document.querySelector("footer");
  if (newMode === PanelModes.SAVED_NETWORKS) {
    footer.classList.add("saved-networks");
  } else {
    footer.classList.remove("saved-networks");
  }*/

  //clearNetworkList();
}

function forceScan(manager) {
  console.log(`Wifi forceScan`);
  try {
  manager
    .getNetworks()
    .then((networks) => updateNetworkList(manager, networks));
  } catch(e) {
    console.error(`Wifi error: ${e}`);
  }
}

export function setupWifi() {
  let manager = navigator.b2g?.wifiManager;
  if (!manager) {
    console.error("navigator.b2g.wifiManager is not available.");
    // Used to check styling on desktop
    createMockContent();
    return;
  }

  switchMode(PanelModes.LIVE_NETWORKS);

  let onOffSwitch = window["on-off-switch"];
  onOffSwitch.checked = manager.enabled;
  onOffSwitch.addEventListener("sl-change", () => {
    manager.setWifiEnabled(onOffSwitch.checked);
  });

  /*let forceScanButton = window["force-scan"];
  if (!manager.enabled) {
    forceScanButton.disabled = true;
  }

  forceScanButton.onclick = () => {
    forceScan(manager);
  };

  let savedNetworks = window["saved-networks"];
  savedNetworks.onclick = () => {
    switchMode(PanelModes.SAVED_NETWORKS);
    manager
      .getKnownNetworks()
      .then((networks) => updateNetworkList(manager, networks));
  };

  let liveNetworks = window["live-networks"];
  liveNetworks.onclick = () => {
    switchMode(PanelModes.LIVE_NETWORKS);
    updateNetworkList(manager, manager.scanResult);
  };*/

  manager.onenabled = () => {
    //statusText.setAttribute("data-l10n-id", "status-enabled");
    forceScanButton.disabled = false;
    onOffSwitch.checked = true;
  };

  manager.ondisabled = () => {
    //statusText.setAttribute("data-l10n-id", "status-disabled");
    forceScanButton.disabled = true;
    onOffSwitch.checked = false;
    clearNetworkList();
  };

  manager.onscanresult = (event) => {
    if (panelMode === PanelModes.LIVE_NETWORKS) {
      updateNetworkList(manager, event.scanResult);
    }
  };

  if (manager.enabled) {
    forceScan(manager);
  }
}
