const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: [
      "shared-fluent",
      "shoelace-light-theme",
      "shoelace-setup",
      "shoelace-icon",
    ],
  },
  {
    name: "activity manager",
    kind: "sharedModule",
    param: ["js/activity_manager.js", ["ActivityManager"]],
  },
];

function log(msg) {
  console.log(`ZZZ RemoteControl: ${msg}`);
}

class RemoteControl {
  constructor() {
    this.dweb = null;
    this.session = null;
  }

  async ensureDweb() {
    if (this.dweb) {
      return;
    }
    await graph.waitForDeps("shared-api-daemon");

    this.dweb = await apiDaemon.getDwebService();
  }

  async init(sessionId) {
    await this.ensureDweb();
    try {
      this.session = await this.dweb.getSession(sessionId);
      let params = {
        action: "remote-control",
        params: { start: true },
      };
      let result = await this.dweb.dial(this.session, params);
      log(`dial result for 'init': ${result}`);
      this.controlId = result;
    } catch (e) {
      log(`Oopps: ${e}`);
    }
  }

  async handleEvent(event) {
    log(
      `Event ${event.type} for ${event.target.localName} ${event.target.dataset.keyName}`
    );

    if (!this.session) {
      log(`Error: no session available.`);
    }
    await this.ensureDweb();
    try {
      let params = {
        action: "remote-control",
        params: {
          controlId: this.controlId,
          keypress: event.target.dataset.keyName,
        },
      };
      let result = await this.dweb.dial(this.session, params);
      log(`dial result for 'keypress': ${result}`);
    } catch (e) {
      log(`Oopps: ${e}`);
    }
  }
}

const remoteControl = new RemoteControl();

var graph;

document.addEventListener("DOMContentLoaded", async () => {
  log(`DOMContentLoaded`);
  await depGraphLoaded;
  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));

  await graph.waitForDeps("activity manager");
  // Configure activity handlers.
  let _activities = new ActivityManager({
    "remote-control": onRemoteControl,
  });

  await graph.waitForDeps("main");

  // Build the keys.
  let keys = [
    { class: "left", key: "ArrowLeft", icon: "arrow-left" },
    { class: "right", key: "ArrowRight", icon: "arrow-right" },
    { class: "up", key: "ArrowUp", icon: "arrow-up" },
    { class: "down", key: "ArrowDown", icon: "arrow-down" },
    { class: "ok", key: "Enter", icon: "corner-down-left" },
  ];

  let container = document.getElementById("keys");
  let keyHandler = remoteControl.handleEvent.bind(remoteControl);
  keys.forEach((item) => {
    let key = document.createElement("sl-icon");
    key.classList.add(item.class);
    key.dataset.keyName = item.key;
    key.setAttribute("name", item.icon);
    key.style.gridArea = item.class;
    container.append(key);

    key.onclick = keyHandler;
  });
});

// remote-control activity entry point.
async function onRemoteControl(data) {
  log(`onRemoteControl: ${JSON.stringify(data)}`);
  document.getElementById("device-desc").textContent =
    data.session.peer.deviceDesc;

  remoteControl.init(data.session.id);
}
