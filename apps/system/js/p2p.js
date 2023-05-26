// Manages the p2p discovery and pairing functionnality.
// Settings used:
// - p2p.discovery.enabled
// - p2p.discovery.local-only
// - p2p.device.id
// - p2p.user.did
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

    class P2pProvider extends lib.P2pProviderBase {
      constructor(serviceId, session) {
        super(serviceId, session);
      }

      log(msg) {
        console.log(`P2pProvider: ${msg}`);
      }

      async contactForDid(did) {
        // Use the contact name instead of the DID if possible.
        if (!this.contacts) {
          this.contacts = contentManager.getContactsManager();
          await this.contacts.init();
        }

        let contact = await this.contacts.contactWithDid(did);
        return contact;
      }

      async contactNameForDid(did) {
        let contact = await this.contactForDid(did);
        if (contact) {
          return contact.name;
        }
        return null;
      }

      async hello(peer) {
        this.log(`Hello from ${JSON.stringify(peer)}`);
        let dialog = document.querySelector("confirm-dialog");

        let source = peer.did;
        let contact = await this.contactForDid(peer.did);
        if (contact) {
          source = contact.name;
          // this.log(`contact=${JSON.stringify(contact)}`);
          if (contact.autoconnect === "accept") {
            return Promise.resolve(true);
          }

          if (contact.autoconnect === "reject") {
            return Promise.resolve(false);
          }
        }

        const [title, text, accept, reject] = await document.l10n.formatValues([
          "p2p-connect-request-title",
          { id: "p2p-connect-request-text", args: { source } },
          "p2p-connect-request-accept",
          "p2p-connect-request-reject",
        ]);

        let hasRememberMe = !!contact;

        let result = await dialog.open({
          title,
          text,
          buttons: [
            { id: "accept", label: accept, variant: "success" },
            { id: "reject", label: reject, variant: "danger" },
          ],
          rememberMe: hasRememberMe,
        });

        let rememberMe = false;
        let button = result;
        if (hasRememberMe) {
          rememberMe = result.rememberMe;
          button = result.button;
        }

        if (rememberMe) {
          // Update the contact autoconnect state.
          contact.autoconnect = button;
          await this.contacts.update(contact.id, contact);
        }

        return Promise.resolve(button == "accept");
      }

      async onUrlAction(peer, url) {
        let dialog = document.querySelector("confirm-dialog");

        let name = await this.contactNameForDid(peer.did);
        let source = name || peer.did;

        const [title, accept, reject] = await document.l10n.formatValues([
          {
            id: "p2p-open-url-title",
            args: { source, device: peer.deviceDesc },
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
          // Rewrite ticket: urls to local dweb/$ticket ones.
          if (url.startsWith("ticket:")) {
            url = `http://localhost:${config.port}/dweb/${url.substring(7)}`;
          }
          window.wm.openFrame(url, { activate: true });
        }
      }

      async onTextAction(peer, text) {
        let dialog = document.querySelector("confirm-dialog");

        let name = await this.contactNameForDid(peer.did);
        let source = name || peer.did;

        const [title, accept, reject] = await document.l10n.formatValues([
          {
            id: "p2p-copy-text-title",
            args: { source, device: peer.deviceDesc },
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

      async onDownloadAction(peer, data) {
        let dialog = document.querySelector("confirm-dialog");

        let name = await this.contactNameForDid(peer.did);
        let source = name || peer.did;

        const [title, text, accept, reject] = await document.l10n.formatValues([
          {
            id: "p2p-download-title",
            args: { source, device: peer.deviceDesc },
          },
          {
            id: "p2p-download-text",
            args: { name: data.name, size: data.size },
          },
          "p2p-download-accept",
          "p2p-download-reject",
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
          let link = document.createElement("a");
          link.href = data.url;
          link.setAttribute("download", data.name);
          link.click();
        }
      }

      async onTileAction(peer, data) {
        let dialog = document.querySelector("confirm-dialog");
        this.log(`onTileAction ${JSON.stringify(data)}`);

        let name = await this.contactNameForDid(peer.did);
        let source = name || peer.did;

        const [title, accept, reject] = await document.l10n.formatValues([
          {
            id: "p2p-tile-title",
            args: { source, device: peer.deviceDesc },
          },
          "p2p-tile-accept",
          "p2p-tile-reject",
        ]);

        let result = await dialog.open({
          title,
          text: data.desc,
          buttons: [
            { id: "accept", label: accept, variant: "success" },
            { id: "reject", label: reject },
          ],
        });

        if (result == "reject") {
          throw new Error("Denied");
        }

        // Register the tile if needed, then launch it indirectly with the `p2p-tile-called` activity.
        let manifestUrl = `tile://${data.cid}/manifest.webmanifest`;
        let registerResult = await registerTile(manifestUrl);
        if (registerResult) {
          let act = new WebActivity("p2p-tile-called", {
            peer,
            cid: data.cid,
            desc: data.desc,
            offer: data.offer,
          });
          let dialResult = await act.start();
          this.log(`Got dial result: ${JSON.stringify(dialResult)}`);
          return dialResult;
        } else {
          throw new Error("TileRegistationError");
        }
      }

      async onActivityAction(peer, activity) {
        let dialog = document.querySelector("confirm-dialog");

        let name = await this.contactNameForDid(peer.did);
        let source = name || peer.did;

        const [title, accept, reject] = await document.l10n.formatValues([
          {
            id: "p2p-activity-title",
            args: { source, device: peer.deviceDesc },
          },
          "p2p-activity-accept",
          "p2p-activity-reject",
        ]);

        let result = await dialog.open({
          title,
          text: activity.name,
          buttons: [
            { id: "accept", label: accept, variant: "success" },
            { id: "reject", label: reject },
          ],
        });

        if (result == "accept") {
          let act = new WebActivity(activity.name, activity.data);
          return await act.start();
        } else {
          throw new Error("Denied");
        }
      }

      async onRemoteControl(params) {
        console.log(`onRemoteControl ${JSON.stringify(params)}`);

        if (!!params.start) {
          const random = new Uint8Array(16);
          window.crypto.getRandomValues(random);
          this.controlId = random.reduce(
            (output, elem) => output + ("0" + elem.toString(16)).slice(-2),
            ""
          );
          return this.controlId;
        }

        console.log(`this.controlId=${this.controlId} params.controlId=${params.controlId}`);
        if (
          !params.controlId ||
          !this.controlId ||
          params.controlId !== this.controlId
        ) {
          console.error(`Invalid or missing controlId`);
          return;
        }

        if (params.keypress) {
          // Dispatch the keypress event to the active frame.
          let key = params.keypress;         
          let win = window.wm.currentFrame().webView.ownerGlobal;
          let keg = new win.KeyboardEventGenerator();
          keg.generate(new win.KeyboardEvent("keydown", { key }));
          keg.generate(new win.KeyboardEvent("keyup", { key }));
        }
        return true;
      }

      async onDialed(peer, params) {
        this.log(`onDialed with ${JSON.stringify(params)}`);

        if (params.action === "open-url") {
          this.onUrlAction(peer, params.url);
        } else if (params.action === "text") {
          this.onTextAction(peer, params.text);
        } else if (params.action === "download") {
          this.onDownloadAction(peer, params);
        } else if (params.action === "tile") {
          return this.onTileAction(peer, params);
        } else if (params.action === "activity") {
          return this.onActivityAction(peer, params.activity);
        } else if (params.action === "remote-control") {
          return this.onRemoteControl(params.params);
        } else {
          console.error(`Unsupported peer action: ${params.action}`);
          return false;
        }

        return true;
      }
    }

    await this.dweb.setP2pProvider(
      new P2pProvider(this.dweb.service_id, this.dweb.session)
    );

    // Get the initial settings values.
    this.enabled = await this.getSetting("p2p.discovery.enabled", false);
    this.localOnly = await this.getSetting("p2p.discovery.local-only", true);
    this.deviceDesc = await this.getSetting("device.name", this.deviceDesc);
    this.did = await this.getSetting("p2p.user.did", this.did);

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

    this.settings.addObserver("p2p.user.did", async (setting) => {
      this.did = setting.value;
      // Stop and restart the discovery to force the new DID to be broadcasted.
      if (this.enabled) {
        this.enabled = false;
        await this.updateDiscovery();
        this.enabled = true;
        await this.updateDiscovery();
      }
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
      this.quickSettings().peerPaired(session);
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
      `updateDiscovery enabled=${this.enabled} localOnly=${this.localOnly} did=${this.did}`
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
