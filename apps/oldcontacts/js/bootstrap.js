const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: ["contact info"],
  },
  {
    name: "contact info",
    kind: "script",
    param: "/components/contact_info.js",
  },
];

function defaultContact() {
  return {
    id: "",
    published: new Date(),
    updated: new Date(),
    bday: new Date(),
    anniversary: new Date(),
    sex: "",
    genderIdentity: "",
    ringtone: "",
    photoType: "",
    photoBlob: new Uint8Array(),
    addresses: [],
    email: [],
    url: [],
    name: "",
    tel: [],
    honorificPrefix: [],
    givenName: "",
    phoneticGivenName: "",
    additionalName: [],
    familyName: "",
    phoneticFamilyName: "",
    honorificSuffix: [],
    nickname: [],
    category: [],
    org: [],
    jobTitle: [],
    note: [],
    groups: [],
  };
}

class ContactManager {
  constructor(node) {
    this.container = node;
    this.contacts = window.apiDaemon.getContactsManager();
    this.contacts.then((service) => {
      // Listen for contact changes.
      service.addEventListener(service.CONTACTS_CHANGE_EVENT, (event) => {
        // console.log(`ContactChangeEvent: ${JSON.stringify(event)}`);
        if (event.reason == this.lib.ChangeReason.CREATE) {
          event.contacts.forEach((contact) => {
            let node = new ContactInfo(contact);
            this.container.appendChild(node);
          });
        } else if (event.reason == this.lib.ChangeReason.UPDATE) {
          event.contacts.forEach((contact) => {
            let node = this.container.querySelector(`#contact-${contact.id}`);
            if (node) {
              let newNode = new ContactInfo(contact, true);
              node.replaceWith(newNode);
            }
          });
        } else if (event.reason == this.lib.ChangeReason.REMOVE) {
          event.contacts.forEach((contact) => {
            // Check if we have this contact displayed, and remove it.
            let node = this.container.querySelector(`#contact-${contact.id}`);
            if (node) {
              node.remove();
            }
          });
        }
      });
    });
  }

  get lib() {
    if (!this._lib) {
      this._lib = window.apiDaemon.getLibraryFor("ContactsManager");
    }
    return this._lib;
  }

  async addContact(contact) {
    let newContact = defaultContact();
    newContact.name = contact.name;
    newContact.tel = [
      { atype: "", value: contact.phone, pref: false, carrier: "" },
    ];
    newContact.email = [{ atype: "", value: contact.email, pref: false }];
    let service = await this.contacts;
    await service.add([newContact]);
  }

  async updateContact(id, contact) {
    let newContact = defaultContact();
    newContact.name = contact.name;
    newContact.tel = [
      { atype: "", value: contact.phone, pref: false, carrier: "" },
    ];
    newContact.email = [{ atype: "", value: contact.email, pref: false }];
    newContact.id = id;
    let service = await this.contacts;
    await service.update([newContact]);
  }

  async removeContact(id) {
    let service = await this.contacts;
    await service.remove([id]);
  }

  // Update the UI.
  async updateList() {
    // Naive way: start from scratch.
    let service = await this.contacts;
    let options = {
      sortBy: this.lib.SortOption.NAME,
      sortOrder: this.lib.Order.ASCENDING,
    };
    let cursor = await service.getAll(options, 20, false);

    let done = false;
    this.container.innerHTML = "";
    let total = 0;
    while (!done) {
      try {
        let results = await cursor.next();
        done = results.length === 0;
        results.forEach((contact) => {
          let node = new ContactInfo(contact);
          this.container.appendChild(node);
          total += 1;
        });
      } catch (e) {
        console.error(`Contacts error: ${e}`);
        done = true;
      }
    }
    cursor.release();
  }
}

function hideElem(node) {
  node.addEventListener(
    "transitionend",
    () => {
      node.classList.add("hidden");
    },
    { once: true }
  );
  node.classList.add("fading");
}

function showElem(node) {
  node.classList.remove("hidden");
  node.classList.remove("fading");
}

class EditDialog extends EventTarget {
  constructor() {
    super();

    this.floatingMenu = window["floating-menu"];
    this.dialog = window["edit-dialog"];

    let buttonOk = window["button-ok"];
    let buttonCancel = window["button-cancel"];
    let createIcon = window["create-icon"];

    buttonOk.addEventListener("click", () => {
      this.close();
      let detail = {};
      ["name", "phone", "email"].forEach((item) => {
        detail[item] = window[`${item}-input`].value.trim();
      });
      detail.mode = this.mode;

      this.dispatchEvent(new CustomEvent("edit-ok", { detail }));
    });

    buttonCancel.addEventListener("click", () => {
      this.close();
      this.dispatchEvent(new Event("edit-cancel"));
    });

    createIcon.addEventListener("click", () => {
      this.openWith(null, "add");
    });
  }

  openWith(contact, mode = "edit") {
    // Normalize the contact.
    if (!contact) {
      contact = {};
    }
    if (!contact.name) {
      contact.name = "";
    }
    if (!contact.tel || !contact.tel[0]) {
      contact.tel = [{ value: "" }];
    }
    if (!contact.email || !contact.email[0]) {
      contact.email = [{ value: "" }];
    }
    window["phone-input"].value = contact.tel[0].value;
    window["email-input"].value = contact.email[0].value;
    window["name-input"].value = contact.name;

    this.mode = mode;
    this.open();
  }

  open() {
    hideElem(this.floatingMenu);
    showElem(this.dialog);
    window["name-input"].focus();
  }

  close() {
    showElem(this.floatingMenu);
    hideElem(this.dialog);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    console.log(`DOMContentLoaded`);
    await depGraphLoaded;

    let graph = new ParallelGraphLoader(kDeps);
    await Promise.all([getSharedDeps("shared-all"), graph.waitForDeps("main")]);

    let manager = new ContactManager(window.contacts);
    let editDialog = new EditDialog();
    // The id of the currently opened contact.
    let openContact = null;

    editDialog.addEventListener("edit-ok", async (event) => {
      let detail = event.detail;
      if (detail.mode == "add") {
        await manager.addContact(detail);
      } else if (detail.mode == "edit") {
        await manager.updateContact(openContact, detail);
      } else {
        console.error(`Unexpected contact editing mode: ${detail.mode}`);
      }
    });

    window["trash-icon"].addEventListener("click", async () => {
      await manager.removeContact(openContact);
    });

    window["edit-icon"].addEventListener("click", async () => {
      editDialog.openWith(
        window.contacts.querySelector(`#contact-${openContact}`).contact
      );
    });

    window.contacts.addEventListener("contact-open", (event) => {
      let floatingMenu = window["floating-menu"];
      let detail = event.detail;
      if (detail.open) {
        // close previous contact if any is open.
        if (openContact) {
          window[`contact-${openContact}`].close();
        }
        openContact = detail.id;
        floatingMenu.classList.add("selecting");
      } else {
        openContact = null;
        floatingMenu.classList.remove("selecting");
      }
    });

    // Listen to messages from the service worker.
    navigator.serviceWorker.onmessage = (event) => {
      let data = event.data;
      // for (let prop in data) {
      //   console.log(`ZZZ   ${prop}: ${data[prop]}`);
      // }
      window.setTimeout(() => {
        editDialog.openWith(
          {
            name: data.name,
            tel: [{ value: data.number || "" }],
            email: [{ value: data.email || "" }],
          },
          "add"
        );
      }, 10);
    };

    await manager.updateList();
  },
  { once: true }
);
