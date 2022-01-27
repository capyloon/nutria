// UI to manage <select> elements.
// The data passed to the constructor looks like:
// {
//   "isFocus": true,
//   "type": "SELECT",
//   "inputType": null,
//   "inputMode": null,
//   "value": "",
//   "selectionStart": 0,
//   "selectionEnd": 0,
//   "max": null,
//   "min": null,
//   "lang": null,
//   "voiceInputSupported": false,
//   "name": "pets",
//   "choices": {
//     "multiple": false,
//     "choices": [
//       {
//         "group": false,
//         "inGroup": false,
//         "disabled": false,
//         "selected": true,
//         "defaultSelected": false,
//         "text": "--Please choose an option--",
//         "label": "",
//         "value": "--Please choose an option--",
//         "optionIndex": 0
//       },
//       {
//         "group": false,
//         "inGroup": false,
//         "disabled": false,
//         "selected": false,
//         "defaultSelected": false,
//         "text": "Dog",
//         "label": "",
//         "value": "Dog",
//         "optionIndex": 1
//       },
//       {
//         "group": false,
//         "inGroup": false,
//         "disabled": false,
//         "selected": false,
//         "defaultSelected": false,
//         "text": "Cat",
//         "label": "",
//         "value": "Cat",
//         "optionIndex": 2
//       }
//     ]
//   },
//   "maxLength": null,
//   "activeEditable": { "native": {} }
// }

export class SelectUi extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    <link rel="stylesheet" href="components/select_ui.css">
    <h4></h4>
    <ul></ul>
    <div class="button-ok" data-l10n-id="button-ok"></div>
    `;

    document.l10n.translateFragment(shadow);

    shadow.querySelector(".button-ok").addEventListener(
      "click",
      (event) => {
        console.log(`SelectUi: closing UI`);
        event.preventDefault();
        if (this.selected.size && this.data.activeEditable) {
          // Collect selected items in an array.
          let result = [];
          this.selected.forEach((item) => {
            result.push(item);
          });
          if (this.data.multiple) {
            console.log(`SelectUi: setSelectedOptions ${result}`);
            this.data.activeEditable.setSelectedOptions(result);
          } else {
            console.log(`SelectUi: setSelectedOption ${result[0]}`);
            this.data.activeEditable.setSelectedOption(result[0]);
          }
          this.data.activeEditable.removeFocus();
        }
        this.dispatchEvent(new Event("close"));
      },
      { capture: true }
    );
  }

  setData(data) {
    this.reset();
    this.selected = new Set();
    this.data = data;

    let shadow = this.shadowRoot;
    let list = shadow.querySelector("ul");
    data.choices.choices.forEach((choice) => {
      let item = document.createElement("li");
      item.textContent = choice.text;
      let optionIndex = choice.optionIndex;
      item.classList.add(`item-${optionIndex}`);
      if (choice.selected) {
        item.classList.add("selected");
        this.selected.add(optionIndex);
      }

      item.onclick = () => {
        item.classList.toggle("selected");

        // In single selection mode, reset the set of selected items.
        if (!this.data.multiple) {
          this.selected.forEach((index) => {
            list.querySelector(`.item-${index}`).classList.remove("selected");
          });
          this.selected.clear();
        }

        if (this.selected.has(optionIndex)) {
          this.selected.delete(optionIndex);
        } else {
          this.selected.add(optionIndex);
        }
      };
      list.append(item);
    });

    shadow.querySelector("h4").textContent = data.name;

    // this.data.activeEditable.removeFocus();
  }

  reset() {
    let shadow = this.shadowRoot;
    let list = shadow.querySelector("ul");
    list.innerHTML = "";

    shadow.querySelector("h4").textContent = null;
    this.data = null;
  }
}

customElements.define("select-ui", SelectUi);

console.log(`SelectUi module loaded`);
