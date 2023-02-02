// Manages the p2p discovery and pairing functionnality.
// Settings used:
// - p2p.discovery.enabled
// - p2p.discovery.local-only
// - p2p.device.id
// - p2p.device.desc

class Webrtc {
  constructor() {
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
    ["message", "open", "close", "error"].forEach((event) =>
      this.channel.addEventListener(event, this)
    );
  }

  handleEvent(event) {
    console.log(`dweb webrtc: event ${event.type}`);

    if (event.type === "signalingstatechange") {
      console.log(`dweb webrtc: signalingState is ${this.pc.signalingState}`);
      console.log(`dweb ${JSON.stringify(this.pc.localDescription)}`);
    }

    if (event.type === "icegatheringstatechange") {
      console.log(
        `dweb webrtc: gatheringState is ${this.pc.iceGatheringState}`
      );
      if (this.pc.iceGatheringState === "complete") {
        this._iceGatheringDone();
      }
    }

    if (event.type === "datachannel") {
      this.setupChannel(event.channel);
    }

    if (event.type === "open") {
      this.channel.send("HELLO WORLD!");
    }
  }

  async offer() {
    this.setupChannel(this.pc.createDataChannel("one-two"));

    let offer = await this.pc.createOffer();
    this.pc.setLocalDescription(offer);
    await this.iceGatheringReady;
    return this.pc.localDescription;
  }

  async answer() {
    let answer = await this.pc.createAnswer();
    this.pc.setLocalDescription(answer);
    await this.iceGatheringReady;
    return this.pc.localDescription;
  }

  setRemoteDescription(answer) {
    this.pc.setRemoteDescription(answer);
  }
}

// Mapping of ConnectErrorKind to strings usable in l10n contexts.
const CONNECT_ERROR_KIND = ["not-connected", "denied", "other"];

class P2pDiscovery {
  constructor() {
    this.log("constructor");

    this.dweb = null;
    this.settings = null;

    this.enabled = false;
    this.localOnly = true;

    this.deviceDesc = `Capyloon: ${embedder.sessionType}`;
    this.deviceId = null;
    this.did = `did:key:${Math.round(Math.random() * 1000000)}`;

    this.init().then(() => {
      this.log(`ready, device is ${embedder.sessionType}`);
      this.log(`enabled=${this.enabled} localOnly=${this.localOnly}`);
    });
  }

  log(msg) {
    console.log(`p2p: dweb: ${msg}`);
  }

  async getSetting(name, defaultValue) {
    try {
      let setting = await this.settings.get(name);
      return setting.value;
    } catch (e) {
      return defaultValue;
    }
  }

  async init() {
    this.dweb = await apiDaemon.getDwebService();
    this.settings = await apiDaemon.getSettings();

    let lib = apiDaemon.getLibraryFor("DwebService");
    this.webrtc = new Webrtc();

    class WebrtcProvider extends lib.WebrtcProviderBase {
      constructor(webrtc, serviceId, session) {
        super(serviceId, session);
        this.webrtc = webrtc;
      }

      log(msg) {
        console.log(`p2p: dweb: WebrtcProvider: ${msg}`);
      }

      hello(peer) {
        this.log(`Hello from ${JSON.stringify(peer)}`);
        return Promise.resolve(true);
      }

      async provideAnswer(peer, offer) {
        try {
          this.log(
            `provideAnswer to ${JSON.stringify(peer)}, offer: ${offer.substring(
              0,
              80
            )}`
          );
          this.webrtc.setRemoteDescription(JSON.parse(offer));
          let answer = await this.webrtc.answer();
          return JSON.stringify(answer);
        } catch (e) {
          this.log(e);
        }
      }
    }

    await this.dweb.setWebrtcProvider(
      new WebrtcProvider(this.webrtc, this.dweb.service_id, this.dweb.session)
    );

    // Get the initial settings values.
    this.enabled = await this.getSetting("p2p.discovery.enabled", false);
    this.localOnly = await this.getSetting("p2p.discovery.local-only", true);
    this.deviceDesc = await this.getSetting("p2p.device.desc", this.deviceDesc);

    try {
      let setting = await this.settings.get("p2p.device.id");
      this.deviceId = setting.value;
    } catch (e) {
      // Generate a random ID. This creates a 32 hex char string which fit into
      // the limit for DNS Names used in mDNS.
      const random = new Uint8Array(16);
      window.crypto.getRandomValues(random);
      this.deviceId =
        "capyloon-" +
        random.reduce(
          (output, elem) => output + ("0" + elem.toString(16)).slice(-2),
          ""
        );
      await this.settings.set([
        { name: "p2p.device.id", value: this.deviceId },
      ]);
    }

    // Install setting observers.
    this.settings.addObserver("p2p.discovery.enabled", async (setting) => {
      this.enabled = setting.value;
      await this.updateDiscovery();
    });

    this.settings.addObserver("p2p.discovery.local-only", async (setting) => {
      this.localOnly = setting.value;
      await this.updateDiscovery();
    });

    // Install dweb event listeners.
    this.dweb.addEventListener(
      this.dweb.PEERFOUND_EVENT,
      this.onPeerFound.bind(this)
    );
    this.dweb.addEventListener(
      this.dweb.PEERLOST_EVENT,
      this.onPeerLost.bind(this)
    );

    await this.updateDiscovery();
  }

  async onPeerFound(peer) {
    if (peer.did == this.did) {
      return;
    }
    this.log(`peer found: ${JSON.stringify(peer)}`);
    let msg = await window.utils.l10n("p2p-peer-found", {
      name: peer.deviceDesc,
    });
    window.toaster.show(msg);
    document.querySelector("quick-settings").addPeer(peer, () => {
      this.log(`dweb Will connect to ${JSON.stringify(peer)}`);
      this.initiateConnection(peer);
    });
  }

  async initiateConnection(peer) {
    try {
      let offer = await this.webrtc.offer();
      this.log(`dweb offer is ${JSON.stringify(offer)}`);
      let answer = await this.dweb.pairWith(peer, JSON.stringify(offer));
      this.webrtc.setRemoteDescription(JSON.parse(answer));
      await this.toasterMessage(`p2p-connect-success`, true, {
        desc: peer.deviceDesc,
      });
    } catch (e) {
      this.log(`dweb connect failed: ${JSON.stringify(e)}`);
      let errorKind = e.value.kind;
      await this.toasterMessage(
        `p2p-connect-error-${CONNECT_ERROR_KIND[errorKind]}`,
        false,
        { desc: peer.deviceDesc }
      );
    }
  }

  async onPeerLost(peer) {
    this.log(`peer lost: ${JSON.stringify(peer)}`);
    document.querySelector("quick-settings").removePeer(peer);
  }

  async toasterMessage(msg, success = true, params = {}) {
    try {
      window.toaster.show(
        await window.utils.l10n(msg, params),
        success ? "success" : "danger"
      );
    } catch (e) {
      this.log(`oops ${e}`);
    }
  }

  // Starts / stop the dweb discovery based on the current configuration.
  async updateDiscovery() {
    this.log(
      `updateDiscovery enabled=${this.enabled} localOnly=${this.localOnly}`
    );

    if (this.enabled) {
      this.log(`Enabling discovery`);
      try {
        this.dweb.enableDiscovery(this.localOnly, {
          did: this.did,
          deviceId: this.deviceId,
          deviceDesc: this.deviceDesc,
        });
        await this.toasterMessage("p2p-enable-discovery-success");
      } catch (e) {
        await this.toasterMessage("p2p-enable-discovery-failure", false);
      }
    } else {
      this.log(`Disabling discovery`);
      try {
        this.dweb.disableDiscovery();
        await this.toasterMessage("p2p-disable-discovery-success");
      } catch (e) {
        await this.toasterMessage("p2p-disable-discovery-failure", false);
      }
    }
  }
}

(function p2p() {
  const instance = new P2pDiscovery();
})();
