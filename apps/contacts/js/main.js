function elem(id) {
  return document.getElementById(id);
}

// A wrapper for a <sl-drawer> that adds common behavior:
// - lazy load the content from a <template>
// - load the dependencies for the panel
// - hook up the footer [back], [ok] and [done] buttons.
// - disable panel closing.
// - set initial focus to the element with the ".initial-focus" class.
class PanelWrapper {
  constructor(node, graph) {
    this.panel = node;
    this.name = node.getAttribute("id");
    this.loaded = false;
    this.graph = graph;

    const events = ["sl-show", "sl-initial-focus", "sl-request-close"];
    events.forEach((eventName) => this.panel.addEventListener(eventName, this));
  }

  sendByEvent(eventName, detail) {
    this.panel.addEventListener(
      "sl-after-show",
      () => {
        this.panel.dispatchEvent(new CustomEvent(eventName, { detail }));
      },
      { once: true }
    );
  }

  editContact(contact) {
    this.sendByEvent("edit-contact", contact);
  }

  fromContact(contact) {
    // When contact.id is null, Edit mode turns into Add mode so
    // we can reuse the same event.
    this.sendByEvent("edit-contact", contact);
  }

  async handleEvent(event) {
    // Load the template in the panel, and manage Ok / Back buttons.
    if (!this.loaded && event.type === "sl-show") {
      await this.graph.waitForDeps(this.name);

      let template = elem(`${this.name}-tmpl`);
      this.panel.append(template.content.cloneNode(true));

      this.loaded = true;
      this.panel.dispatchEvent(new CustomEvent("panel-ready"));
    }

    if (event.type === "sl-initial-focus") {
      let toFocus = this.panel.querySelector(".initial-focus");
      if (toFocus) {
        event.preventDefault();
        toFocus.focus();
      }
    } else if (event.type === "sl-request-close") {
      event.preventDefault();
    }
  }
}

class PeerWatcher {
  constructor() {
    this.peers = new Map(); // Maps peer key to Peer
    this.sessions = new Map(); // Maps sessionId to session

    this.watchers = new Map(); // Maps did to [ContactInfo]
  }

  peerKey(peer) {
    return `${peer.did}-${peer.deviceId}`;
  }

  log(msg) {
    console.log(`PeerWatcher: ${msg}`);
  }

  async init() {
    this.dweb = await apiDaemon.getDwebService();
    let peers = await this.dweb.knownPeers();
    peers.forEach((peer) => {
      this.peers.set(this.peerKey(peer), peer);
    });
    let sessions = await this.dweb.getSessions();
    sessions.forEach((session) => {
      this.sessions.set(session.id, session);
    });

    this.dweb.addEventListener(
      this.dweb.PEERFOUND_EVENT,
      this.onPeerFound.bind(this)
    );
    this.dweb.addEventListener(
      this.dweb.PEERLOST_EVENT,
      this.onPeerLost.bind(this)
    );
    this.dweb.addEventListener(
      this.dweb.SESSIONADDED_EVENT,
      this.onSessionAdded.bind(this)
    );
    this.dweb.addEventListener(
      this.dweb.SESSIONREMOVED_EVENT,
      this.onSessionRemoved.bind(this)
    );
  }

  clearWatchers() {
    this.watchers.clear();
  }

  getInfo(did) {
    let known = [];
    let paired = [];
    for (let peer of this.peers.values()) {
      if (peer.did === did) {
        known.push(peer);
      }
    }
    for (let session of this.sessions.values()) {
      if (session.peer.did === did) {
        paired.push(session);
      }
    }
    return { known, paired };
  }

  addWatcher(did, contact) {
    let current = this.watchers.get(did);
    if (current) {
      current.push(contact);
      this.watchers.set(did, current);
    } else {
      this.watchers.set(did, [contact]);
    }

    // Set the proper contact state.
    let { known, paired } = this.getInfo(did);
    contact.updatePeerInfo(known, paired);
  }

  updateContactsFor(did) {
    let contacts = this.watchers.get(did) || [];
    let { known, paired } = this.getInfo(did);
    contacts.forEach((contact) => {
      contact.updatePeerInfo(known, paired);
    });
  }

  onPeerFound(peer) {
    this.peers.set(this.peerKey(peer), peer);
    this.updateContactsFor(peer.did);
  }

  onPeerLost(peer) {
    this.peers.delete(this.peerKey(peer));
    this.updateContactsFor(peer.did);
  }

  onSessionAdded(session) {
    this.sessions.set(session.id, session);
    this.updateContactsFor(session.peer.did);
  }

  onSessionRemoved(sessionId) {
    let session = this.sessions.get(sessionId);
    if (session) {
      let did = session.peer.did;
      this.sessions.delete(sessionId);
      this.updateContactsFor(did);
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await depGraphLoaded;

  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));

  const steps = ["shared-fluent", "setup", "intro"];
  await Promise.all(steps.map((dep) => graph.waitForDeps(dep)));

  // Get the list of drawers based on the set of templates.
  let templates = Array.from(document.querySelectorAll("template")).map(
    (template) => template.getAttribute("id").split("-")[0]
  );

  let wrappers = new Map();

  // Configure activity handlers.
  let activities = new ActivityManager({
    "new-contact": (data) => {
      onNewContact(wrappers, data);
    },
  });

  // Create the <sl-drawer> elements.
  let prev = null;
  templates.forEach((name) => {
    let node = document.createElement("sl-drawer");
    node.setAttribute("id", `${name}-panel`);
    node.setAttribute("no-header", "true");
    if (prev) {
      prev.setAttribute("next", name);
    }
    prev = node;
    document.body.append(node);
    let wrapper = new PanelWrapper(node, graph);
    wrappers.set(name, wrapper);
  });

  let drawerLoaded = false;
  async function ensureDrawer() {
    if (!drawerLoaded) {
      await graph.waitForDeps("shoelace-drawer");
      drawerLoaded = true;
    }
  }

  window.requestIdleCallback(async () => {
    await ensureDrawer();
  });

  // Will open only the panel for that #hash
  window.addEventListener(
    "hashchange",
    async () => {
      let hash = window.location.hash;
      let name = hash === "" ? "" : hash.substring(1) + "-panel";

      await ensureDrawer();

      let toShow, toHide;

      for (let wrapper of wrappers.values()) {
        if (wrapper.name === name) {
          toShow = wrapper.panel;
        } else if (wrapper.panel.open) {
          toHide = wrapper.panel;
        }
      }

      // Start by showing the target panel, then hide the previous one.
      // TODO: disable the "hide" animation when toShow is no null.
      if (toShow) {
        toShow.addEventListener(
          "sl-after-show",
          () => {
            toHide?.hide();
          },
          { once: true }
        );
        toShow.show();
      } else {
        // Going back to the first screen, just hide the previous panel.
        toHide?.hide();
      }
    },
    false
  );

  document.body.classList.add("ready");

  await contentManager.as_superuser();

  manageList(wrappers);
});

async function manageList(wrappers) {
  let didWatcher = new PeerWatcher();
  await didWatcher.init();

  let manager = contentManager.getContactsManager(async (contacts) => {
    await graph.waitForDeps("contact info");
    console.log(`Contacts list updated: ${contacts.length} contacts`);
    elem("main-title").dataset.l10nArgs = JSON.stringify({
      count: contacts.length,
    });

    didWatcher.clearWatchers();

    let list = elem("contact-list");
    list.innerHTML = "";
    for (let contact of contacts) {
      let el = list.appendChild(new ContactInfo(contact));
      let dids = contact.did || [];
      dids.forEach((did) => {
        didWatcher.addWatcher(did.uri, el);
      });
      el.classList.add("sl-box");
      el.addEventListener("delete-contact", () => {
        manager.deleteContact(contact);
      });

      el.addEventListener("publish-contact", () => {
        publishContact(contact);
      });

      el.addEventListener("edit-contact", () => {
        editContact(wrappers, contact);
      });
    }
  });

  // Hook up the "New contact" button.
  elem("action-add-contact").addEventListener("click", () => {
    window.location.hash = `#add`;
  });

  // Hook up the "Scan" button.
  elem("action-scan").addEventListener("click", () => {
    importContact(manager);
  });

  await manager.init();
}

// TODO: move to /shared/ and re-use with system/js/ipfs_publisher.js
class PasswordBasedSecret {
  constructor(password) {
    if (!password) {
      // Generate a pseudo-random password.
      password = "";
      for (let i = 0; i < 32; i++) {
        // random in a..z
        password += String.fromCharCode(97 + Math.floor(Math.random() * 26));
      }
    }
    this.password = password;
  }

  async getKeyMaterial() {
    let enc = new TextEncoder();
    return await window.crypto.subtle.importKey(
      "raw",
      enc.encode(this.password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );
  }

  async getSymKey() {
    let keyMaterial = await this.getKeyMaterial(this.password);
    let enc = new TextEncoder();
    return await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode("capyloon-salt"),
        iterations: 400000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  async encrypt(plaintext) {
    return await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(1),
      },
      await this.getSymKey(this.password),
      plaintext
    );
  }

  async decrypt(ciphertext) {
    return await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(1),
      },
      await this.getSymKey(this.password),
      ciphertext
    );
  }
}

async function publishContact(contact) {
  await graph.waitForDeps("qr dialog");

  let dialog = elem("publish-dialog");
  let okBtn = elem("publish-btn-ok");
  okBtn.onclick = () => {
    dialog.hide();
  };
  let qrCode = elem("publish-qr");
  qrCode.classList.add("hidden");
  let progress = elem("publish-progress");
  progress.classList.remove("hidden");
  dialog.classList.remove("hidden");
  dialog.show();

  let encrypter = new PasswordBasedSecret();
  const postUrl = "ipfs://localhost/ipfs";
  try {
    let data = { contact: contact.asDefaultVariant() };
    // If the contact has a photo, encrypt and publish it.
    if (contact.photoUrl) {
      let response = await fetch(contact.photoUrl);
      let buffer = await response.arrayBuffer();
      let encrypted = await encrypter.encrypt(buffer);

      response = await fetch(postUrl, {
        method: "POST",
        body: encrypted,
      });
      data.photo = response.headers.get("location");
    }

    // Now publish the full data.
    let blob = new Blob([JSON.stringify(data)]);
    let buffer = await blob.arrayBuffer();
    let encrypted = await encrypter.encrypt(buffer);
    response = await fetch(postUrl, {
      method: "POST",
      body: encrypted,
    });
    let url = response.headers.get("location");
    // Share the password and url in the qr code.
    qrCode.value = JSON.stringify({ url, password: encrypter.password });
    progress.classList.add("hidden");
    qrCode.classList.remove("hidden");
  } catch (e) {
    // TODO: error management / UI.
  }
}

async function importContact(manager) {
  let qr = new WebActivity("scan-qr-code");
  try {
    let text = await qr.start();
    let { url, password } = JSON.parse(text);
    let decrypter = new PasswordBasedSecret(password);
    let response = await fetch(url);
    let buffer = await response.arrayBuffer();
    let decoder = new TextDecoder();
    clearText = decoder.decode(await decrypter.decrypt(buffer));
    let data = JSON.parse(clearText);

    let contact = data.contact;
    if (data.photo) {
      let response = await fetch(data.photo);
      let buffer = await response.arrayBuffer();
      contact.photo = new Blob([await decrypter.decrypt(buffer)]);
    }
    await manager.add(manager.newContact(contact));
  } catch (e) {
    console.error(`Failed to import contact: ${e}`);
  }
}

function editContact(wrappers, contact) {
  window.location.hash = `#add`;
  // Notify the panel to switch to Edit mode.
  let panel = wrappers.get("add");
  panel.editContact(contact);
}

function onNewContact(wrappers, data) {
  window.location.hash = `#add`;
  // Notify the panel to add initial data
  let contact = { name: data.name, phone: [], email: [] };
  if (data.phone) {
    contact.phone = [data.phone];
  }
  if (data.email) {
    contact.email = [data.email];
  }
  let panel = wrappers.get("add");
  panel.fromContact(contact);
}
