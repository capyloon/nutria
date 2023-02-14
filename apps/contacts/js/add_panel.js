// New contact panel

function elem(id) {
  return document.getElementById(`add-contact-${id}`);
}

const ALL_INPUTS = ["name", "phone", "email"];

class AddContactPanel {
  constructor() {
    this.log("constructor");
    this.panel = document.getElementById("add-panel");
    this.ready = false;
    this.panel.addEventListener("panel-ready", () => {
      this.init();
    });
    this.panel.addEventListener("edit-contact", (event) => {
      this.editContact(event.detail);
    });
    this.inputs = [];
    this.photo = null;
    this.photoUrl = null;

    this.contactsManager = contentManager.getContactsManager();
  }

  log(msg) {
    console.log(`AddContactPanel: ${msg}`);
  }

  error(msg) {
    console.error(`AddContactPanel: ${msg}`);
  }

  goToMainScreen() {
    this.clear();
    history.back();
  }

  async editContact(contact) {
    this.contactId = contact.id;
    this.inputs["name"].value = contact.name || "";
    this.inputs["phone"].value = contact.phone[0] || "";
    this.inputs["email"].value = contact.email[0] || "";
    if (contact.photo) {
      this.photo = contact.photo;
      this.setAvatar();
    } else if (contact.photoUrl) {
      let response = await fetch(contact.photoUrl);
      this.photo = await response.blob();
      this.setAvatar();
    }
    this.updateDidList(contact.did || []);

    this.cardSwitch.checked = contact.isOwn;
    if (this.cardSwitch.checked) {
      elem("did-section").classList.remove("hidden");
    } else {
      elem("did-section").classList.add("hidden");
      elem("did-list").innerHTML = "";
    }
  }

  setAvatar() {
    if (this.photo) {
      this.photoUrl = URL.createObjectURL(this.photo);
      this.avatar.setAttribute("image", this.photoUrl);
    }
  }

  async handleEvent(event) {
    if (event.target == this.btnCancel) {
      this.goToMainScreen();
    } else if (event.target == this.btnOk) {
      let contact = this.contactsManager.newContact();
      contact.isOwn = this.cardSwitch.checked;
      contact.name = this.inputs["name"].value;
      contact.phone = [this.inputs["phone"].value];
      contact.email = [this.inputs["email"].value];
      contact.photo = this.photo;
      contact.did = [];
      elem("did-list")
        .querySelectorAll("li")
        .forEach((item) => {
          contact.did.push(item.did);
        });

      if (this.contactId) {
        await this.contactsManager.update(this.contactId, contact);
      } else {
        await this.contactsManager.add(contact);
      }
      this.goToMainScreen();
    } else if (event.target == this.avatar) {
      // Trigger a 'pick image' activity.
      let picker = new WebActivity("pick", { type: "image" });
      try {
        this.photo = await picker.start();
        this.setAvatar();
      } catch (e) {}
    } else if (event.target == this.cardSwitch) {
      if (this.cardSwitch.checked) {
        elem("did-section").classList.remove("hidden");
      } else {
        elem("did-section").classList.add("hidden");
        elem("did-list").innerHTML = "";
      }
    } else if (event.target == this.btnUpdateDid) {
      await this.updateIdentity();
    }
  }

  updateDidList(dids) {
    let list = elem("did-list");
    list.innerHTML = "";
    dids.forEach((did) => {
      if (did.name == "superuser") {
        return;
      }
      let item = document.createElement("li");
      item.did = did;
      item.textContent = `${did.name} | ${did.uri}`;
      list.append(item);
    });
  }

  async updateIdentity() {
    let dweb = await apiDaemon.getDwebService();
    let dids = await dweb.getDids();
    this.updateDidList(dids);
  }

  clear() {
    if (this.photoUrl) {
      URL.revokeObjectURL(this.photoUrl);
    }
    this.photo = null;
    this.photoUrl = null;
    this.contactId = null;
    this.avatar.removeAttribute("image");
    elem("form").reset();
  }

  async init() {
    this.log("init");
    if (this.ready) {
      return;
    }

    this.btnOk = elem("ok");
    this.btnOk.addEventListener("click", this);

    this.btnCancel = elem("cancel");
    this.btnCancel.addEventListener("click", this);

    this.avatar = elem("avatar");
    this.avatar.addEventListener("click", this);

    this.cardSwitch = elem("personnal-card-switch");
    this.cardSwitch.addEventListener("sl-change", this);

    this.btnUpdateDid = elem("update-dids");
    this.btnUpdateDid.addEventListener("click", this);

    ALL_INPUTS.forEach((item) => {
      this.inputs[item] = elem(item);
    });

    this.ready = true;
  }
}

const addContactPanel = new AddContactPanel();
