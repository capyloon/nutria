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
      await this.contactsManager.add(contact);
      this.goToMainScreen();
    }
  }

  clear() {
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
    this.log(event.detail);

    this.btnOk = elem("ok");
    this.btnOk.addEventListener("click", this);

    this.btnCancel = elem("cancel");
    this.btnCancel.addEventListener("click", this);

    ALL_INPUTS.forEach((item) => {
      this.inputs[item] = elem(item);
    });

    this.ready = true;
  }
}

const addContactPanel = new AddContactPanel();
