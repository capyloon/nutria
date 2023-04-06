// Helper to manager webrtc offer / answer flow for tiles.

class Webrtc extends EventTarget {
  constructor(peer) {
    super();
    this.peer = peer; // The remote peer.
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

export class TileHelper extends EventTarget {
  constructor(data) {
    super();
    this.data = data;
    this.peer = null;
  }

  log(msg) {
    console.log(`TileHelper: ${msg}`);
  }

  setupWebrtcEvents(webrtc) {
    webrtc.addEventListener("channel-open", () => {
      this.dispatchEvent(
        new CustomEvent("open", { detail: { channel: webrtc.channel } })
      );
    });

    webrtc.addEventListener("channel-error", () => {
      this.dispatchEvent(new CustomEvent("error"));
    });

    webrtc.addEventListener("channel-close", () => {
      this.dispatchEvent(new CustomEvent("close"));
    });
  }

  async onStart() {
    let dweb = await window.apiDaemon.getDwebService();

    let session = await dweb.getSession(this.data.sessionId);
    this.peer = session.peer;
    let webrtc = new Webrtc(session.peer);
    this.setupWebrtcEvents(webrtc);

    // Get the local offer.
    let offer = await webrtc.offer();
    this.log(`offer ready, about to dial remote peer`);

    // Get the anwser.
    let answer = await dweb.dial(session, {
      action: "tile",
      cid: location.hostname,
      offer,
      desc: this.data.desc,
    });
    this.log(`onStart got answer: ${JSON.stringify(answer)}`);
    webrtc.setRemoteDescription(answer);
  }

  async onCalled() {
    let webrtc = new Webrtc(this.data.peer);
    this.peer = this.data.peer;
    webrtc.setRemoteDescription(this.data.offer);
    this.setupWebrtcEvents(webrtc);

    // Get the local answer.
    let answer = await webrtc.answer();
    // answser is a RTCSessionDescription object that can't be cloned so
    // we do a JSON roundtrip to turn it into a clonable object.
    this.log(`returning answer: ${answer}`);
    return JSON.parse(JSON.stringify(answer));
  }
}

// Makes it easy to call async methods on a remote peer.
// All interactions are limited to JSON for now.
export class TileRpcClient extends EventTarget {
  constructor(channel) {
    super();
    this.channel = channel;
    this.inFlightPromises = new Map();
    this.reqId = 0;

    this.channel.addEventListener("message", this);
  }

  callFunc(funcName, params) {
    this.reqId += 1;
    let req = { kind: "request", reqId: this.reqId, funcName, params };
    return new Promise((resolve, reject) => {
      this.inFlightPromises.set(req.reqId, { resolve, reject });
      this.channel.send(JSON.stringify(req));
    });
  }

  addMessageListener(name) {
    let req = { kind: "addMessageListener", name };
    this.channel.send(JSON.stringify(req));
  }

  removeMessageListener(name) {
    let req = { kind: "removeMessageListener", name };
    this.channel.send(JSON.stringify(req));
  }

  handleEvent(event) {
    // console.log(`TileRpcClient::handleEvent`, event);
    try {
      let { kind, reqId, success, result, name, detail } = JSON.parse(
        event.data
      );

      if (kind === "message") {
        this.dispatchEvent(new CustomEvent(name, { detail }));
        return;
      }

      if (kind !== "response") {
        console.error(`TileRpcClient: expected 'response' but got '${kind}'`);
        return;
      }

      if (!this.inFlightPromises.has(reqId)) {
        console.error(`TileRpcClient: no promise for reqId=${reqId}`);
        return;
      }

      let p = this.inFlightPromises.get(reqId);
      if (success) {
        p.resolve(result);
      } else {
        p.reject(result);
      }
      this.inFlightPromises.delete(reqId);
    } catch (e) {
      console.error(e);
    }
  }
}

// Makes it easy to respond to async methods calls from a remote peer.
// All interactions are limited to JSON for now.
export class TileRpcServer extends EventTarget {
  constructor(channel) {
    super();
    this.channel = channel;

    this.messageListeners = new Set();

    this.channel.addEventListener("message", this);
  }

  async handleEvent(event) {
    try {
      let { kind, reqId, funcName, params, name } = JSON.parse(event.data);

      if (kind === "addMessageListener") {
        this.messageListeners.add(name);
        return;
      }

      if (kind === "removeMessageListener") {
        this.messageListeners.delete(name);
        return;
      }

      if (kind !== "request" || typeof this[funcName] !== "function") {
        console.error(`TileRpcServer: no ${funcName} method!`);
        return;
      }

      try {
        let result = await this[funcName].bind(this)(params);
        let response = { kind: "response", reqId, result, success: true };
        this.channel.send(JSON.stringify(response));
      } catch (e) {
        let response = { kind: "response", reqId, result: e, success: false };
        this.channel.send(JSON.stringify(response));
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Send a message if a listener is set for this message name.
  broadcastMessage({ name, detail }) {
    if (this.messageListeners.has(name)) {
      this.channel.send(JSON.stringify({ kind: "message", name, detail }));
    }
  }
}
