
let settings = [
  "deviceinfo.build_number",
  "deviceinfo.software",
  "deviceinfo.platform_version",
  "deviceinfo.platform_build_id",
  "deviceinfo.hardware",
  "deviceinfo.product_manufacturer",
  "deviceinfo.product_model",
];

function displaySettings(service) {
  service.getBatch(settings).then(
    (results) => {
      let table = window.settings;
      results.forEach((setting) => {
        let row = document.createElement("tr");
        let nameCell = document.createElement("td");
        nameCell.setAttribute("data-l10n-id", setting.name.replace(".", "-"));
        let valueCell = document.createElement("td");
        valueCell.textContent = setting.value;
        row.appendChild(nameCell);
        row.appendChild(valueCell);
        table.appendChild(row);
      });

      let row = document.createElement("tr");
        let nameCell = document.createElement("td");
        nameCell.setAttribute("data-l10n-id", "user-agent");
        let valueCell = document.createElement("td");
        valueCell.textContent = navigator.userAgent;
        row.appendChild(nameCell);
        row.appendChild(valueCell);
        table.appendChild(row);

    },
    () => console.error("Failed to get get deviceinfo settings.")
  );
}

function displayTelephony() {
  let manager = navigator.b2g?.iccManager;
  if (!manager) {
    console.error("b2g.iccManager is not available!");
  }

  let table = window.telephony;

  let conns = navigator.b2g.mobileConnections;
  console.log(`ZZZ found ${conns.length} mobile connections`);

  for (conn of conns) {
    try {
      console.log(`ZZZ Adding sim card info`);

      let row = document.createElement("tr");
      let head = document.createElement("th");
      let identity = conn.getDeviceIdentities();
      head.textContent = `SIM Card ${identity.imei} ${conn.radioState}`;
      row.appendChild(head);
      table.appendChild(row);

      if (conn.iccId) {
        console.log(`ZZZ Connection icc is ${conn.iccId}`);
      }
    } catch (e) {
      console.error(`ZZZ oops: ${e}`);
    }
  }

  console.log(`ZZZ Done with mobile connections`);

  // Array.from(ids).forEach((id) => {
  //   let icc = manager.getIccById(id);

  //   let row = document.createElement("tr");
  //   let head = document.createElement("th");
  //   head.textContent = `SIM ${id}`;
  //   row.appendChild(head);
  //   table.appendChild(row);

  //   let info = icc.iccInfo;
  //   let row = document.createElement("tr");
  //   let nameCell = document.createElement("tr");
  //   nameCell.textContent = "Number";
  //   let valueCell = document.createElement("tr");
  //   valueCell = info.imsi;
  //   row.appendChild(nameCell);
  //   row.appendChild(valueCell);
  //   table.appendChild(row);

  //   let row = document.createElement("tr");
  //   let nameCell = document.createElement("tr");
  //   nameCell.textContent = "MCC/MNC";
  //   let valueCell = document.createElement("tr");
  //   valueCell = `${info.mcc} ${info.mnc}`;
  //   row.appendChild(nameCell);
  //   row.appendChild(valueCell);
  //   table.appendChild(row);
  // });
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    window.logo.src = `http://system.localhost:${location.port}/resources/logo-b2g.webp`;

    await depGraphLoaded;
    await getSharedDeps("shared-all");

    if (navigator.b2g?.externalapi) {
      apiDaemon.getSettings().then(
        (settings) => {
          console.log(`ApiDaemon we got a settings service! ${settings}`);
          displaySettings(settings);
        },
        (error) => console.error(error)
      );
    }

    displayTelephony();
  },
  { once: true }
);
