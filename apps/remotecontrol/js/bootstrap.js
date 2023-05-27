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
    this.channel = channel;
    this.channel.binaryType = "arraybuffer";
    ["open", "close", "error"].forEach((event) =>
      this.channel.addEventListener(event, (event) => {
        this.dispatchEvent(new CustomEvent(`channel-${event.type}`));
      })
    );
  }

  async handleEvent(event) {
    console.log(`webrtc: event ${event.type}`);

    if (event.type === "icegatheringstatechange") {
      console.log(
        `dweb webrtc: gatheringState is ${this.pc.iceGatheringState}`
      );
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
      this.setupChannel(this.pc.createDataChannel("capyloon-p2p"));
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
      let offer = await this.webrtc.offer();
      let session = await this.dweb.getSession(sessionId);
      let params = {
        action: "remote-control",
        params: { offer },
      };
      let answer = await this.dweb.dial(session, params);
      this.webrtc.setRemoteDescription(answer);
    } catch (e) {
      log(`Oopps: ${JSON.stringify(e)}`);
    }
  }

  async handleMessage(data) {
    log(`message: ${JSON.stringify(data)}`);
  }

  async handleEvent(event) {
    log(
      `Event ${event.type}: ${event.target.dataset.keyName}`
    );

    if (!this.open) {
      log(`Error: no webrtc channel available.`);
      return;
    }

    try {
      let params = {
        command: "keypress",
        keys: event.target.dataset.keyName,
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

  // Build the keys.
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

  let container = document.getElementById("keys");
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
});

// remote-control activity entry point.
async function onRemoteControl(data) {
  log(`onRemoteControl: ${JSON.stringify(data)}`);
  document.getElementById("device-desc").textContent =
    data.session.peer.deviceDesc;

  remoteControl.init(data.session.id);
}
