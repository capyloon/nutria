// Encapsulate a Lucide icon definition

import { html, css, LitElement } from "./lit.js";

class LucideIcon extends LitElement {
  constructor() {
    super();
  }

  static get properties() {
    return {
      kind: { type: String },
    };
  }

  static get styles() {
    return css`
      :host(lucide-icon) div {
        width: 1em;
        margin-left: 0.125em;
        margin-right: 0.125em;
      }
    `;
  }

  render() {
    let css = `http://shared.localhost:${window.config.port}/lucide/Lucide.css`;

    return html`<div>
      <link rel="stylesheet" href="${css}" />
      <i class="icon-${this.kind}"></i>
    </div>`;
  }
}

customElements.define("lucide-icon", LucideIcon);
