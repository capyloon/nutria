function buildRow(name, value) {
  let row = document.createElement("tr");
  let nameCell = document.createElement("td");
  nameCell.textContent = name;
  let valueCell = document.createElement("td");
  valueCell.textContent = value;
  row.appendChild(nameCell);
  row.appendChild(valueCell);
  return row;
}

function updateDetails(conn) {
  let table = window.details;
  table.innerHTML = "";

  let ids = conn.getDeviceIdentities();
  table.appendChild(buildRow("IMEI", ids.imei || ids.esn));

  if (conn.radioState !== "enabled") {
    return;
  }

  table.appendChild(buildRow("iccId", conn.iccId));

  let manager = navigator.b2g?.iccManager;
  if (!manager) {
    console.error("ZZZ b2g.iccManager is not available!");
    return;
  }

  if (conn.iccId) {
    let icc = manager.getIccById(conn.iccId).iccInfo;
    table.appendChild(buildRow("mcc mnc", `${icc.mcc} ${icc.mnc}`));
    table.appendChild(buildRow("imsi", `${icc.imsi}`));
    table.appendChild(
      buildRow("Phone Number", `msisdn=${icc.msisdn} mdn=${icc.mdn}`)
    );
    icc.spn && table.appendChild(buildRow("spn", `${icc.spn}`));
  }

  [
    { name: "Voice", info: conn.voice },
    { name: "Data", info: conn.data },
  ].forEach((connectionInfo) => {
    let connInfo = connectionInfo.info;
    table.appendChild(buildRow(connectionInfo.name, connInfo.state));
    ["emergencyCallsOnly", "roaming", "type"].forEach((prop) => {
      table.appendChild(buildRow(prop, connInfo[prop]));
    });

    let network = connInfo.network;
    if (network) {
      ["shortName", "longname", "mcc", "mnc", "state"].forEach((prop) => {
        table.appendChild(buildRow(prop, network[prop]));
      });
    }
  });
}

async function setupTelephony(apnData) {
  let conns = navigator.b2g?.mobileConnections;
  if (!conns) {
    console.error("navigator.b2g.mobileConnections is not available.");
    return;
  }

  // Use only the first connection for now.
  // TODO: multi-SIM support.

  let conn = conns[0];
  if (!conn) {
    console.error(`No mobile connection available!`);
    return;
  } else {
    console.log(`Using connection #1 of ${conns.length}: ${conn}`);
  }

  let statusText = window["status-text"];
  conn.onradiostatechange = () => {
    statusText.setAttribute("data-l10n-id", `status-${conn.radioState}`);
    updateDetails(conn);
  };

  conn.ondatachange = conn.onvoicechange = () => updateDetails(conn);

  let state = conn.radioState;
  statusText.setAttribute("data-l10n-id", `status-${state}`);
  updateDetails(conn);

  let onOffSwitch = window["on-off-switch"];
  onOffSwitch.checked = state === "enabled";
  onOffSwitch.onchange = () => {
    console.log(`Changing radio state to ${onOffSwitch.checked}`);
    conn.setRadioEnabled(onOffSwitch.checked);
  };

  // TODO: shared component or helper to bind a setting with a switch.

  let settings = await window.apiDaemon.getSettings();

  let dataSwitch = window["data-switch"];
  dataSwitch.onchange = async () => {
    if (conn?.data?.network) {
      let network = conn.data.network;
      let mcc = network.mcc;
      let mnc = network.mnc;

      try {
        let apnConfig = apnData[mcc][mnc];
        console.log(`DataCall will use apnConfig ${JSON.stringify(apnConfig)}`);

        await settings.set([
          { name: "ril.data.defaultServiceId", value: 0 },
          { name: "ril.data.apnSettings.sim1", value: apnConfig },
          { name: "ril.data.roaming_enabled", value: true },
          { name: "ril.data.enabled", value: dataSwitch.checked },
        ]);
      } catch (e) {
        console.error(`DataCall: Failed to set apn settings: ${e}`);
      }
    }
  };

  try {
    let dataEnabled = await settings.get("ril.data.enabled");
    dataSwitch.checked = dataEnabled.value;
  } catch (e) {
    console.error(`No value for ril.data.enabled: ${e}, default is 'false'.`);
    dataSwitch.checked = false;
  }
}

async function loadApnConfig() {
  try {
    let url = `http://shared.localhost:${window.config.port}/resources/apn.json`;
    let data = await fetch(url);
    let json = await data.json();
    return json;
  } catch (e) {
    console.error(`Failed to read apn.json: ${e}`);
    return null;
  }
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    await depGraphLoaded;
    await getSharedDeps(["shared-all"]);

    let apnData = await loadApnConfig();
    setupTelephony(apnData);
  },
  { once: true }
);
