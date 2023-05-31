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

// Helper class managing the pairing code input.
class CodeInput {
  constructor() {
    this.promise = null;
  }

  init() {
    // Build the code input keyboard.
    let container = document.getElementById("keyboard");
    for (let i = 0; i < 10; i++) {
      let key = document.createElement("div");
      key.classList.add("key");
      key.textContent = `${i}`;
      key.style.gridArea = `n${i}`;
      container.append(key);
      key.onclick = (event) => {
        this.onKey(event.target);
      };
    }
    // Add the backspace key and enter keys.
    let key = document.createElement("sl-icon");
    key.classList.add("key");
    key.setAttribute("name", "delete");
    key.style.gridArea = "back";
    container.append(key);
    key.onclick = () => {
      this.onDelete();
    };

    key = document.createElement("sl-icon");
    key.classList.add("key");
    key.setAttribute("name", "corner-down-left");
    key.style.gridArea = "enter";
    container.append(key);
    key.onclick = () => {
      this.onEnter();
    };

    this.input = document.querySelector("#code-input pre");
  }

  updateInputStatus() {
    if (this.input.textContent.length == 6) {
      this.input.classList.add("complete");
    } else {
      this.input.classList.remove("complete");
    }
  }

  onKey(target) {
    if (this.input.textContent.length >= 6) {
      return;
    }
    this.input.textContent += target.textContent;
    this.updateInputStatus();
  }

  onDelete() {
    if (this.input.textContent.length == 0) {
      return;
    }

    this.input.textContent = this.input.textContent.slice(0, -1);
    this.updateInputStatus();
  }

  onEnter() {
    this.promise?.resolve();
  }

  async getCode() {
    let keyboard = document.getElementById("code-input");
    let remote = document.getElementById("remote-keys");
    remote.classList.add("hidden");
    keyboard.classList.remove("hidden");

    let p = new Promise((resolve) => {
      this.promise = { resolve };
    });

    try {
      await p;
    } catch (e) {}

    this.promise = null;

    remote.classList.remove("hidden");
    keyboard.classList.add("hidden");
    return this.input.textContent;
  }
}

const codeInput = new CodeInput();

// Local copy of webrtc helper from shared/js/tile.js
// TODO: share
class Webrtc extends EventTarget {
  constructor() {
    super();
    this.pc = null;
    this.channel = null;
  }

  ensurePeerConnection() {
    if (this.pc !== null) {
      return;
    }

    this.pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
      sdpSemantics: "unified-plan",
    });

    // This promise resolves when the local description is ready.
    this._iceGatheringDone = null;
    this.iceGatheringReady = new Promise((resolve) => {
      this._iceGatheringDone = resolve;
    });

    [
      // "iceconnectionstatechange",
      "icegatheringstatechange",
      // "signalingstatechange",
      // "icecandidate",
      "track",
      "datachannel",
    ].forEach((event) => this.pc.addEventListener(event, this));
  }

  setupChannel(channel) {
    log(`webrtc: setup channel`);
    this.channel = channel;
    this.channel.binaryType = "arraybuffer";
    ["open", "close", "error"].forEach((event) =>
      this.channel.addEventListener(event, (event) => {
        this.dispatchEvent(new CustomEvent(`channel-${event.type}`));
      })
    );
  }

  async handleEvent(event) {
    log(`webrtc: event ${event.type}`);

    if (event.type === "icegatheringstatechange") {
      log(`webrtc: gatheringState is ${this.pc.iceGatheringState}`);
      if (this.pc.iceGatheringState === "complete") {
        this._iceGatheringDone();
      }
    } else if (event.type === "datachannel") {
      this.setupChannel(event.channel);
    }
  }

  async offer() {
    this.ensurePeerConnection();
    if (!this.channel) {
      this.setupChannel(this.pc.createDataChannel("capyloon-remote-control"));
    }

    let offer = await this.pc.createOffer();
    this.pc.setLocalDescription(offer);
    await this.iceGatheringReady;
    return this.pc.localDescription;
  }

  async answer() {
    this.ensurePeerConnection();
    let answer = await this.pc.createAnswer();
    this.pc.setLocalDescription(answer);
    await this.iceGatheringReady;
    return this.pc.localDescription;
  }

  setRemoteDescription(answer) {
    this.ensurePeerConnection();
    this.pc.setRemoteDescription(answer);
  }
}

class RemoteControl {
  constructor() {
    this.dweb = null;
    this.session = null;
    this.open = false;
    this.webrtc = new Webrtc();
  }

  async ensureDweb() {
    if (this.dweb) {
      return;
    }
    await graph.waitForDeps("shared-api-daemon");

    this.dweb = await apiDaemon.getDwebService();
  }

  setupWebrtcEvents() {
    this.webrtc.addEventListener("channel-open", () => {
      log(`channel open`);
      this.open = true;
      this.webrtc.channel.addEventListener("message", (event) => {
        this.handleMessage(event.data);
      });
    });

    this.webrtc.addEventListener("channel-error", () => {
      log(`channel error`);
      this.open = false;
    });

    this.webrtc.addEventListener("channel-close", () => {
      log(`channel closed`);
      this.open = false;
    });
  }

  async init(sessionId) {
    try {
      await this.ensureDweb();
      let session = await this.dweb.getSession(sessionId);

      let pairingAccepted = await this.dweb.dial(session, {
        action: "remote-control-request",
      });
      if (!pairingAccepted) {
        return;
      }

      // Get the code.
      let code = await codeInput.getCode();

      this.setupWebrtcEvents();
      let offer = await this.webrtc.offer();
      let params = {
        action: "remote-control-pairing",
        params: { offer, code },
      };
      let answer = await this.dweb.dial(session, params);
      log(`Received webrtc answer: |${answer.type}|`);
      this.webrtc.setRemoteDescription(answer);
      log(`remoteDescription set`);
    } catch (e) {
      log(`Oopps: ${JSON.stringify(e)}`);
    }
  }

  async handleMessage(data) {
    log(`message: ${JSON.stringify(data)}`);
  }

  async handleEvent(event) {
    log(`Event ${event.type}: ${event.target.dataset.keyName}`);

    if (!this.open) {
      log(`Error: no webrtc channel available.`);
      return;
    }

    try {
      let params = {
        command: "keypress",
        params: { keys: event.target.dataset.keyName },
      };
      this.webrtc.channel.send(JSON.stringify(params));
    } catch (e) {
      log(`Failed to send 'keypress' command: ${e}`);
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

  document.body.oncontextmenu = (event) => {
    event.preventDefault();
  };

  // Build the remote control keys.
  // 'area' maps to the CSS grid area.
  let keys = [
    { area: "left", key: "ArrowLeft", icon: "arrow-left" },
    { area: "right", key: "ArrowRight", icon: "arrow-right" },
    { area: "up", key: "ArrowUp", icon: "arrow-up" },
    { area: "down", key: "ArrowDown", icon: "arrow-down" },
    { area: "ok", key: "Enter", icon: "corner-down-left" },
    { area: "home", key: "Home", icon: "home" },
    { area: "tab", key: "Tab", icon: "arrow-right-to-line" },
    { area: "sh-tab", key: "Shift,Tab", icon: "arrow-left-to-line" },
  ];

  let container = document.getElementById("remote-keys");
  let keyHandler = remoteControl.handleEvent.bind(remoteControl);
  keys.forEach((item) => {
    let key = document.createElement("sl-icon");
    key.classList.add(item.area);
    key.dataset.keyName = item.key;
    key.setAttribute("name", item.icon);
    key.style.gridArea = item.area;
    container.append(key);

    key.onclick = keyHandler;
  });

  codeInput.init();
});

// remote-control activity entry point.
async function onRemoteControl(data) {
  log(`onRemoteControl: ${JSON.stringify(data)}`);
  document.getElementById("device-desc").textContent =
    data.session.peer.deviceDesc;

  remoteControl.init(data.session.id);
}
