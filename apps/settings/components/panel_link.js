// Encapsulate displaying the link to a panel.

class PanelLink extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.name = this.getAttribute("name");
    let icon = this.getAttribute("icon");
    if (this.hasAttribute("disabled")) {
      this.classList.add("disabled");
    }

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <link rel="stylesheet" href="components/panel_link.css">
      <lucide-icon kind="${icon}"></lucide-icon>
      <span data-l10n-id="${this.name.replace("_", "-")}"></span>
      <lucide-icon kind="chevron-right"></lucide-icon>
    `;

    shadow.addEventListener("click", this, true);
  }

  translate() {
    document.l10n.translateFragment(this.shadowRoot);
  }

  handleEvent(event) {
    if (event.type !== "click") {
      console.error(`Unexpected event on <panel-link> : ${event.type}`);
      return;
    }
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent("open", { detail: { name: this.name } })
    );
  }
}

customElements.define("panel-link", PanelLink);
