// Telephony panel management module.

class TelephonyPanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("telephony-panel");
    this.ready = false;
    this.panel.addEventListener("panel-ready", this);
  }

  log(msg) {
    console.log(`TelephonyPanel: ${msg}`);
  }

  error(msg) {
    console.error(`TelephonyPanel: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "panel-ready") {
      this.init();
    }
  }

  async addSwitchBinding(id, name, handler) {
    let binding = new SwitchAndSetting(
      document.getElementById(`telephony-${id}-switch`),
      name
    );
    binding.addEventListener("change", handler.bind(this));
    await binding.init();
  }

  async ensureApnData() {
    if (this.apnData) {
      return;
    }
    this.apnData = await this.loadApnConfig();
  }

  async ensureSettings() {
    if (this.settings) {
      return;
    }
    this.settings = await apiDaemon.getSettings();
  }

  async updateMobileData(event) {
    this.log(`updateMobileData -> ${event.detail.value}`);
    if (this.conn?.data?.network) {
      let network = this.conn.data.network;
      let mcc = network.mcc;
      let mnc = network.mnc;

      try {
        await this.ensureApnData();
        let apnConfig = this.apnData[mcc][mnc];
        this.log(`DataCall will use apnConfig ${JSON.stringify(apnConfig)}`);

        await this.ensureSettings();
        await this.settings.set([
          { name: "ril.data.defaultServiceId", value: 0 },
          { name: "ril.data.apnSettings.sim1", value: apnConfig },
          { name: "ril.data.roaming_enabled", value: true },
          // This setting is set by the switch <-> setting binding.
          // { name: "ril.data.enabled", value: event.detail.value },
        ]);
      } catch (e) {
        this.error(`DataCall: Failed to set apn settings: ${e}`);
      }
    } else {
      this.error("No network!");
    }
  }

  async loadApnConfig() {
    try {
      let url = `http://shared.localhost:${window.config.port}/resources/apn.json`;
      let data = await fetch(url);
      let json = await data.json();
      return json;
    } catch (e) {
      this.error(`Failed to read apn.json: ${e}`);
      return null;
    }
  }

  buildRow(name, value) {
    let row = document.createElement("tr");
    let nameCell = document.createElement("td");
    nameCell.textContent = name;
    let valueCell = document.createElement("td");
    valueCell.textContent = value;
    row.appendChild(nameCell);
    row.appendChild(valueCell);
    return row;
  }

  appendTo(table, name, value) {
    table.appendChild(this.buildRow(name, value));
  }

  updateDetails() {
    this.log(`updateDetails`);
    let conn = this.conn;
    for (let table of Object.keys(this.tables)) {
      this.tables[table].innerHTML = "";
    }

    let table = this.tables["summary"];

    let ids = conn.getDeviceIdentities();
    this.appendTo(table, "IMEI", ids.imei || ids.esn);

    if (conn.radioState !== "enabled") {
      return;
    }

    // Summary table
    this.appendTo(table, "iccId", conn.iccId);

    let manager = navigator.b2g?.iccManager;
    if (!manager) {
      this.error("b2g.iccManager is not available!");
      return;
    }

    if (conn.iccId) {
      let icc = manager.getIccById(conn.iccId).iccInfo;
      this.appendTo(table, "mcc mnc", `${icc.mcc} ${icc.mnc}`);
      this.appendTo(table, "imsi", `${icc.imsi}`);
      this.appendTo(
        table,
        "Phone Number",
        `msisdn=${icc.msisdn} mdn=${icc.mdn}`
      );
      icc.spn && this.appendTo(table, "spn", `${icc.spn}`);
    }

    // Voice and data tables.
    ["voice", "data"].forEach((name) => {
      let table = this.tables[name];
      let connInfo = conn[name];
      this.appendTo(table, "State", connInfo.state);
      ["emergencyCallsOnly", "roaming", "type"].forEach((prop) => {
        this.appendTo(table, prop, connInfo[prop]);
      });

      let network = connInfo.network;
      if (network) {
        ["shortName", "longname", "mcc", "mnc", "state"].forEach((prop) => {
          this.appendTo(table, prop, network[prop]);
        });
      }
    });
  }

  searchNetworks() {
    this.log(`Searching networks...`);
    this.networkSearchButton.loading = true;
    this.networkList.classList.add("hidden");
    this.networks = [];

    this.conn.getNetworks().then(
      (networks) => {
        this.networkSearchButton.loading = false;
        console.log(networks);
        this.networkList.innerHTML = "";
        this.networkList.value = null;
        networks.forEach((network, index) => {
          let option = document.createElement("sl-option");
          option.textContent = network.longName;
          option.value = index;
          this.networkList.append(option);
        });
        this.networks = networks;
        this.networkList.classList.remove("hidden");
      },
      (error) => {
        this.networkSearchButton.loading = false;
        console.error(error);
      }
    );
  }

  logDOMRequesterror(request, msg) {
    let alertBox = document.getElementById("telephony-alert");
    alertBox.open = false;
    request.then(
      (result) => {
        alertBox.setAttribute("variant", "success");
        alertBox.textContent = `${msg} success: ${result}`;
        alertBox.open = true;
        this.error(`${msg} success: ${result}`);
      },
      (error) => {
        alertBox.setAttribute("variant", "danger");
        alertBox.textContent = `${msg} failed: ${error}`;
        alertBox.open = true;
        this.error(`${msg} failed: ${error}`);
      }
    );
  }

  async init() {
    if (this.ready) {
      return;
    }

    this.tables = {};
    this.tables["summary"] = document.getElementById("telephony-summary");
    this.tables["voice"] = document.getElementById("telephony-voice");
    this.tables["data"] = document.getElementById("telephony-data");

    let conns = navigator.b2g?.mobileConnections;
    if (!conns) {
      this.error("navigator.b2g.mobileConnections is not available.");
      return;
    }

    // Use only the first connection for now.
    // TODO: multi-SIM support.
    this.conn = conns[0];

    await this.addSwitchBinding(
      "data",
      "ril.data.enabled",
      this.updateMobileData
    );

    let onOffSwitch = document.getElementById("telephony-onoff-switch");
    const state = this.conn.radioState;
    onOffSwitch.checked = state == "enabled";
    let onOffLabel = document.getElementById("telephony-onoff-label");
    onOffLabel.setAttribute("data-l10n-id", `telephony-status-${state}`);

    this.conn.ondatachange = this.conn.onvoicechange = () =>
      this.updateDetails();

    this.conn.onradiostatechange = () => {
      onOffLabel.setAttribute(
        "data-l10n-id",
        `telephony-status-${this.conn.radioState}`
      );
      this.updateDetails();
    };

    onOffSwitch.addEventListener("sl-change", () => {
      this.log(`Changing radio state to ${onOffSwitch.checked}`);
      this.conn.setRadioEnabled(onOffSwitch.checked);
    });

    let autoNetworkSwitch = document.getElementById(
      "telephony-auto-network-switch"
    );
    try {
      autoNetworkSwitch.checked = this.conn.networkSelectionMode == "automatic";
      this.log(`Network selection mode: ${this.conn.networkSelectionMode}`);
      let networksSection = document.getElementById(
        "telephony-manual-networks"
      );
      if (autoNetworkSwitch.checked) {
        console.log(`Will hide `, networksSection);
        networksSection.classList.add("hidden");
      } else {
        networksSection.classList.remove("hidden");
      }
      autoNetworkSwitch.addEventListener("sl-change", () => {
        this.log(`Automatic Network Selection: ${autoNetworkSwitch.checked}`);
        if (autoNetworkSwitch.checked) {
          // Hide the "Search Networks" section.
          networksSection.classList.add("hidden");
          this.logDOMRequesterror(
            this.conn.selectNetworkAutomatically(),
            "selectNetworkAutomatically"
          );
        } else {
          // Display the "Search Networks" section.
          networksSection.classList.remove("hidden");
        }
      });

      this.networkList = document.getElementById("telephony-networks");
      this.networkList.classList.add("hidden");
      this.networks = [];
      this.networkList.addEventListener("sl-change", () => {
        let network = this.networks[this.networkList.value];
        this.log(`Selecting network: ${network.longName}`);
        this.logDOMRequesterror(
          this.conn.selectNetwork(network),
          "selectNetwork"
        );
      });
      this.networkSearchButton = document.getElementById(
        "telephony-search-network"
      );
      this.networkSearchButton.onclick = () => this.searchNetworks();
    } catch (e) {
      console.error(e);
    }

    this.updateDetails();

    this.ready = true;
  }
}

const telephonyPanel = new TelephonyPanel();
