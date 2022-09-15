// System information panel management module.

class SystemInfoPanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("systeminfo-panel");
    this.ready = false;
    this.panel.addEventListener("panel-ready", this);
  }

  log(msg) {
    console.log(`SystemInfoPanel: ${msg}`);
  }

  error(msg) {
    console.error(`SystemInfoPanel: ${msg}`);
  }

  handleEvent(event) {
    if (event.type === "panel-ready") {
      this.init();
    }
  }

  async displayBuildInfo() {
    let service = await apiDaemon.getSettings();
    let settings = [
      "deviceinfo.build_number",
      "deviceinfo.software",
      "deviceinfo.platform_version",
      "deviceinfo.platform_build_id",
      "deviceinfo.hardware",
      "deviceinfo.product_manufacturer",
      "deviceinfo.product_model",
    ];

    service.getBatch(settings).then(
      (results) => {
        let table = document.getElementById("systeminfo-system-table");
        results.forEach((setting) => {
          let row = document.createElement("tr");
          let nameCell = document.createElement("td");
          nameCell.dataset.l10nId =
            "systeminfo-" + setting.name.replace(".", "-");
          let valueCell = document.createElement("td");
          valueCell.textContent = setting.value;
          row.appendChild(nameCell);
          row.appendChild(valueCell);
          table.appendChild(row);
        });

        let row = document.createElement("tr");
        let nameCell = document.createElement("td");
        nameCell.dataset.l10nId = "systeminfo-user-agent";
        let valueCell = document.createElement("td");
        valueCell.textContent = navigator.userAgent;
        row.appendChild(nameCell);
        row.appendChild(valueCell);
        table.appendChild(row);
      },
      () => console.error("Failed to get get deviceinfo settings.")
    );
  }

  async displayTelephony() {
    let manager = navigator.b2g?.iccManager;
    if (!manager) {
      console.error("b2g.iccManager is not available!");
    }

    let table = document.getElementById("systeminfo-telephony-table");

    let conns = navigator.b2g.mobileConnections;

    for (let conn of conns) {
      try {
        let row = document.createElement("tr");
        let head = document.createElement("td");
        let identity = conn.getDeviceIdentities();
        head.textContent = `SIM Card ${identity.imei} ${conn.radioState}`;
        row.appendChild(head);
        table.appendChild(row);

        if (conn.iccId) {
          console.log(`Connection icc is ${conn.iccId}`);
        }
      } catch (e) {
        console.error(`Telephony info: ${e}`);
      }
    }
  }

  async init() {
    if (this.ready) {
      return;
    }

    await this.displayBuildInfo();
    await this.displayTelephony();

    document.getElementById(
      "systeminfo-logo"
    ).src = `http://branding.localhost:${location.port}/resources/logo.webp`;

    this.ready = true;
  }
}

const systemInfoPanel = new SystemInfoPanel();
