// Manages the p2p discovery and pairing functionnality.
// Settings used:
// - p2p.discovery.enabled
// - p2p.discovery.local-only
// - p2p.device.id
// - device.name

// Mapping of ConnectErrorKind to strings usable in l10n contexts.
const CONNECT_ERROR_KIND = ["not-connected", "not-paired", "denied", "other"];

function peerKey(peer) {
  return `${peer.did}-${peer.deviceId}`;
}

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

    class WebrtcProvider extends lib.P2pProviderBase {
      constructor(serviceId, session) {
        super(serviceId, session);
      }

      log(msg) {
        console.log(`p2p: dweb: WebrtcProvider: ${msg}`);
      }

      async hello(peer) {
        this.log(`Hello from ${JSON.stringify(peer)}`);
        let dialog = document.querySelector("confirm-dialog");

        const [title, text, accept, reject] = await document.l10n.formatValues([
          "p2p-connect-request-title",
          { id: "p2p-connect-request-text", args: { desc: peer.did } },
          "p2p-connect-request-accept",
          "p2p-connect-request-reject",
        ]);

        let result = await dialog.open({
          title,
          text,
          buttons: [
            { id: "accept", label: accept, variant: "success" },
            { id: "reject", label: reject, variant: "danger" },
          ],
        });

        return Promise.resolve(result == "accept");
      }

      async onUrlAction(peer, url) {
        let dialog = document.querySelector("confirm-dialog");

        const [title, accept, reject] = await document.l10n.formatValues([
          {
            id: "p2p-open-url-request-title",
            args: { did: peer.did, device: peer.deviceDesc },
          },
          "p2p-open-url-accept",
          "p2p-open-url-reject",
        ]);

        let result = await dialog.open({
          title,
          text: url,
          buttons: [
            { id: "accept", label: accept, variant: "success" },
            { id: "reject", label: reject },
          ],
        });

        if (result == "accept") {
          window.wm.openFrame(url, { activate: true });
        }
      }

      async onTextAction(peer, text) {
        let dialog = document.querySelector("confirm-dialog");

        const [title, accept, reject] = await document.l10n.formatValues([
          {
            id: "p2p-copy-text-request-title",
            args: { did: peer.did, device: peer.deviceDesc },
          },
          "p2p-copy-text-accept",
          "p2p-copy-text-reject",
        ]);

        let result = await dialog.open({
          title,
          text,
          buttons: [
            { id: "accept", label: accept, variant: "success" },
            { id: "reject", label: reject },
          ],
        });

        if (result == "accept") {
          navigator.clipboard.writeText(text).then(
            async () => {
              let msg = await window.utils.l10n("text-share-copied");
              window.toaster.show(msg);
            },
            (err) => {
              this.error(`Failure copying '${text}' to the clipboard: ${err}`);
            }
          );
        }
      }

      async provideAnswer(peer, action, offer) {
        this.log(`provideAnswer for ${action} on ${JSON.stringify(peer)}`);
        this.log(`offer is ${offer}`);

        try {
          let webrtc = new Webrtc(peer);
          webrtc.setRemoteDescription(JSON.parse(offer));
          let answer = JSON.stringify(await webrtc.answer());

          this.log(`got answer: ${answer.substring(0, 80)}`);

          webrtc.addEventListener("channel-open", () => {
            this.log(`channel open!`);
            webrtc.channel.addEventListener("message", (event) => {
              let lib = apiDaemon.getLibraryFor("DwebService");
              this.log(`channel message: ${event.data}`);
              if (action === lib.PeerAction.URL) {
                this.onUrlAction(peer, event.data);
              } else if (action === lib.PeerAction.URL) {
                this.onTextAction(peer, event.data);
              } else {
                this.log(`Unsupported action: ${action}`);
              }
            });
          });

          return answer;
        } catch (e) {
          this.log(e);
        }
      }
    }

    await this.dweb.setP2pProvider(
      new WebrtcProvider(this.dweb.service_id, this.dweb.session)
    );

    // Get the initial settings values.
    this.enabled = await this.getSetting("p2p.discovery.enabled", false);
    this.localOnly = await this.getSetting("p2p.discovery.local-only", true);
    this.deviceDesc = await this.getSetting("device.name", this.deviceDesc);

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
    this.dweb.addEventListener(this.dweb.SESSIONADDED_EVENT, (session) => {
      this.log(`SESSIONADDED_EVENT: ${JSON.stringify(session)}`);
      this.quickSettings().peerPaired(session.peer);
    });
    this.dweb.addEventListener(this.dweb.SESSIONREMOVED_EVENT, (sessionId) => {
      this.log(`SESSIONREMOVED_EVENT: ${sessionId}`);
    });

    await this.updateDiscovery();
  }

  quickSettings() {
    if (!this._qsettings) {
      this._qsettings = document.querySelector("quick-settings");
    }
    return this._qsettings;
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
    this.quickSettings().addPeer(peer, () => {
      this.log(`dweb Will connect to ${JSON.stringify(peer)}`);
      this.initiateConnection(peer);
    });
  }

  onPeerLost(peer) {
    this.log(`peer lost: ${JSON.stringify(peer)}`);
    this.quickSettings().removePeer(peer);
  }

  async initiateConnection(peer) {
    try {
      let _session = await this.dweb.pairWith(peer);
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
