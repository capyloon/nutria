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

  setContactsManager(manager) {
    this.contactsManager = manager;
  }

  editContact(contact) {
    this.panel.addEventListener(
      "sl-after-show",
      () => {
        this.panel.dispatchEvent(
          new CustomEvent("edit-contact", { detail: contact })
        );
      },
      { once: true }
    );
  }

  async handleEvent(event) {
    // Load the template in the panel, and manage Ok / Back buttons.
    if (!this.loaded && event.type === "sl-show") {
      await this.graph.waitForDeps(this.name);

      let template = elem(`${this.name}-tmpl`);
      this.panel.append(template.content.cloneNode(true));

      this.loaded = true;
      this.panel.dispatchEvent(
        new CustomEvent("panel-ready", { detail: this.contactsManager })
      );
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

document.addEventListener("DOMContentLoaded", async () => {
  await depGraphLoaded;

  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));
  await Promise.all(
    ["shared-api-daemon", "shared-fluent", "intro"].map((dep) =>
      graph.waitForDeps(dep)
    )
  );

  // Get the list of drawers based on the set of templates.
  let templates = Array.from(document.querySelectorAll("template")).map(
    (template) => template.getAttribute("id").split("-")[0]
  );

  let wrappers = new Map();

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

  manageList(wrappers);
});

async function manageList(wrappers) {
  await contentManager.as_superuser();

  let manager = contentManager.getContactsManager((contacts) => {
    console.log(`Contacts list updated: ${contacts.length} contacts`);
    elem("main-title").setAttribute(
      "data-l10n-args",
      JSON.stringify({ count: contacts.length })
    );

    let list = elem("contact-list");
    list.innerHTML = "";
    for (let contact of contacts) {
      let el = list.appendChild(new ContactInfo(contact));
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

    document.body.classList.add("ready");
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

  for (let wrapper of wrappers.values()) {
    wrapper.setContactsManager(manager);
  }
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
  let dialog = elem("publish-dialog");
  let okBtn = elem("publish-btn-ok");
  okBtn.onclick = () => {
    dialog.hide();
  };
  let qrCode = elem("publish-qr");
  qrCode.classList.add("hidden");
  let progress = elem("publish-progress");
  progress.classList.remove("hidden");
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
