// A component encapsulating display and management of an extension.

function log(msg) {
  console.log(`ExtensionsPanel: ${msg}`);
}

class WebExtension extends HTMLElement {
  constructor(addon) {
    super();
    this.addon = addon;
    // log(`Creating web-extension ${addon.name}`);
  }

  connectedCallback() {
    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <link rel="stylesheet" href="style/web_extension.css">
      <link rel="stylesheet" href="http://shared.localhost:${location.port}/style/elements.css">
      <input type="checkbox" class="switch" />
      <img class="icon"/>
      <span class="name"></span>
      <button data-l10n-id="web-extension-remove"></button>
    `;

    shadow.querySelector("img").src = URL.createObjectURL(this.addon.icon);
    shadow.querySelector(".name").textContent = this.addon.name;

    document.l10n.translateFragment(shadow);
    this.checkbox = shadow.querySelector("input");

    this.checkbox.onchange = async () => {
      // log(`calling ${this.addon.id}.setEnabled(${this.checkbox.checked})`);
      await this.addon.setEnabled(this.checkbox.enabled);

      // Refresh our state.
      this.addon = await navigator.mozAddonManager.getAddonByID(this.addon.id);
      this.updateUI();
    };

    shadow.querySelector("button").onclick = async () => {
      if (await this.addon.uninstall()) {
        this.remove();
      }
    };

    this.updateUI();
  }

  updateUI() {
    // log(`updateUI enabled=${this.addon.isEnabled}`);
    this.checkbox.checked = this.addon.isEnabled;
  }
}

customElements.define("web-extension", WebExtension);

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    await depGraphLoaded;
    await getSharedDeps(["shared-fluent", "shared-icons"]);

    // Run code that depends on localization and icons being ready.

    let addons = await navigator.mozAddonManager.getAllAddons();
    let list = document.getElementById("list");
    addons
      .filter((addon) => addon.type == "extension")
      .forEach((addon) => {
        let li = document.createElement("li");
        li.append(new WebExtension(addon));
        list.append(li);
      });
  },
  { once: true }
);
