// Helper class to manage the Name Editor dialog

class NameEditorDialog {
  constructor() {
    this.dialog = document.getElementById("name-editor");
    this.dialog.addEventListener("sl-after-hide", this);
    document.getElementById("name-editor-ok").addEventListener("click", this);
    document
      .getElementById("name-editor-cancel")
      .addEventListener("click", this);
    this.promise = null;
  }

  handleEvent(event) {
    if (this.promiseDone) {
      return;
    }

    if (event.type === "sl-after-hide") {
      // sl-after-hide is also dispatched when "closing" the sl-select drop down,
      // but we should not do anything in that case.
      if (event.target !== this) {
        return;
      }

      this.promiseDone = true;
      this.promise?.reject();
      return;
    }

    let id = event.target.getAttribute("id");
    if (id === "name-editor-ok") {
      let input = this.dialog.querySelector("#name-editor-input").value.trim();
      this.promiseDone = true;
      this.promise?.resolve(input);
    } else if (id === "name-editor-cancel") {
      this.promiseDone = true;
      this.promise?.reject();
    } else {
      console.error(
        `Unexpected event: ${event.type} from ${event.target.localName}#${id}`
      );
      return;
    }
    this.dialog.hide();
  }

  open(mode, initialValue = "") {
    this.dialog.querySelector("#name-editor-input").value = initialValue;
    this.dialog.querySelector(
      "#name-editor-title"
    ).dataset.l10nId = `name-editor-${mode}-title`;
    this.dialog.querySelector(
      "#name-editor-label"
    ).dataset.l10nId = `name-editor-${mode}-input-label`;

    this.promiseDone = false;
    return new Promise(async (resolve, reject) => {
      this.promise = { resolve, reject };
      this.dialog.show();
    });
  }
}
