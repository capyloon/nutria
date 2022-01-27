// Toaster component.

class ToasterContainer extends LitElement {
  constructor() {
    super();
  }

  static get properties() {
    return {
      kind: { type: String },
      text: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
        top: 1em;
        width: 100%;

        transition: transform 0.25s;
        z-index: 50000;
      }

      :host div.container {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bolder;
      }

      :host div.item {
        padding: 0.75em;
        border-radius: 5px;
        background-color: var(--dialog-background);
        color: var(--dialog-text);
        max-width: 80vw;
      }

      :host div.item.kind-error {
        background-color: darkred;
        color: white;
      }

      :host(.offscreen) {
        transform: translateY(-200%);
        transition: transform 0.25s, opacity 0.25s;
        opacity: 0.5;
      }
    `;
  }

  render() {
    return html`<div class="container">
      <div class="item kind-${this.kind}">${this.text}</div>
    </div>`;
  }

  // Shows a message in the toaster.
  // Valid values for `kind` are: `info`, `error`.
  show(text, kind = "info") {
    if (this.hasAttribute("hidden")) {
      this.removeAttribute("hidden");
    }

    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    this.timer = window.setTimeout(() => {
      this.timer = null;
      this.classList.add("offscreen");
    }, 2000);
    this.classList.remove("offscreen");

    this.text = text;
    this.kind = kind;
  }
}

customElements.define("toaster-container", ToasterContainer);
