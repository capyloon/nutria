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
    this.panel.addEventListener("panel-ready", (event) => {
      this.init(event);
    });
    this.inputs = [];
    this.photo = null;
    this.photoUrl = null;
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

  async handleEvent(event) {
    if (event.target == this.btnCancel) {
      this.goToMainScreen();
    } else if (event.target == this.btnOk) {
      let contact = this.contactsManager.newContact();
      contact.name = this.inputs["name"].value;
      contact.phone = [this.inputs["phone"].value];
      contact.email = [this.inputs["email"].value];
      contact.photo = this.photo;
      await this.contactsManager.add(contact);
      this.goToMainScreen();
    } else if (event.target == this.avatar) {
      // Trigger a 'pick image' activity.
      let picker = new WebActivity("pick", { type: "image" });
      try {
        this.photo = await picker.start();
        this.photoUrl = URL.createObjectURL(this.photo);
        this.avatar.setAttribute("image", this.photoUrl);
      } catch (e) {}
    }
  }

  clear() {
    if (this.photoUrl) {
      URL.revokeObjectURL(this.photoUrl);
    }
    this.avatar.removeAttribute("image");
    ALL_INPUTS.forEach((item) => {
      this.inputs[item].value = "";
    });
  }

  async init(event) {
    this.log("init");
    if (this.ready) {
      return;
    }

    this.contactsManager = event.detail;

    this.btnOk = elem("ok");
    this.btnOk.addEventListener("click", this);

    this.btnCancel = elem("cancel");
    this.btnCancel.addEventListener("click", this);

    this.avatar = elem("avatar");
    this.avatar.addEventListener("click", this);

    ALL_INPUTS.forEach((item) => {
      this.inputs[item] = elem(item);
    });

    this.ready = true;
  }
}

const addContactPanel = new AddContactPanel();
