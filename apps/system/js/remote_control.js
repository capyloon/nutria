// System app side of the remote control feature.
// It is responsible for answering the dial query
// with a webrtc answer, and after that to manage
// remote commands.

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
      console.log(`webrtc: gatheringState is ${this.pc.iceGatheringState}`);
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
    this.reset();
  }

  reset() {
    this.webrtc = new Webrtc();
    this.open = false;
  }

  log(msg) {
    console.log(`RemoteControl: ${msg}`);
  }

  error(msg) {
    console.error(`RemoteControl: ${msg}`);
  }

  setupWebrtcEvents() {
    this.webrtc.addEventListener("channel-open", () => {
      this.log(`channel open`);
      this.open = true;
      this.webrtc.channel.addEventListener("message", this);
    });

    this.webrtc.addEventListener("channel-error", () => {
      this.log(`channel error`);
      this.reset();
    });

    this.webrtc.addEventListener("channel-close", () => {
      this.log(`channel closed`);
      this.reset();
    });
  }

  // Receives the offer from the caller, and returns
  // the answer.
  async start(offer) {
    this.webrtc.setRemoteDescription(offer);
    this.setupWebrtcEvents();
    let answer = await this.webrtc.answer();
    // answser is a RTCSessionDescription object that can't be cloned so
    // we do a JSON roundtrip to turn it into a clonable object.
    this.log(`returning answer: ${answer}`);
    return JSON.parse(JSON.stringify(answer));
  }

  // Receives the 'message' event from the webrtc channel.
  handleEvent(event) {
    if (event.type !== "message") {
      this.error(`Unexpected event: ${event.type}`);
      return;
    }

    try {
      let { command, params } = JSON.parse(event.data);
      switch (command) {
        case "keypress":
          this.onKeyPress(params);
          break;
        default:
          this.error(`Unexpected command: ${command}`);
      }
    } catch (e) {
      this.error(`Failed to handle command: ${e}`);
    }
  }

  // params = { keys: "..." }
  async onKeyPress(params) {
    this.log(`onKeyPress ${params.keys}`);

    // Dispatch the keypress events to the active frame.
    let keys = params.keys.split(",");
    let win = window.wm.currentFrame().webView.ownerGlobal;

    // We can't use the KeyEventGenerator API because it doesn't support
    // key sequences that change modifier states.
    // Modifier state changes are needed eg. for [Shift]+[Tab] generation.
    try {
      let tip = Cc["@mozilla.org/text-input-processor;1"].createInstance(
        Ci.nsITextInputProcessor
      );
      tip.beginInputTransaction(win, () => {});
      keys.forEach((key) => {
        tip.keydown(new win.KeyboardEvent("keydown", { key }));
      });

      keys.reverse().forEach((key) => {
        tip.keyup(new win.KeyboardEvent("keyup", { key }));
      });

      tip = null;
    } catch (e) {
      this.error(`Failed to generate key event: ${e}`);
    }

    return true;
  }
}
