import {
  autoIncrement
} from "./chunk.KFR7NC2M.js";
import {
  tab_panel_styles_default
} from "./chunk.XGXDQT2J.js";
import {
  e,
  n
} from "./chunk.72DLNKYZ.js";
import {
  $,
  s
} from "./chunk.PEQICPKO.js";
import {
  __decorateClass
} from "./chunk.ICGTMF5Z.js";

// src/components/tab-panel/tab-panel.ts
var SlTabPanel = class extends s {
  constructor() {
    super(...arguments);
    this.attrId = autoIncrement();
    this.componentId = `sl-tab-panel-${this.attrId}`;
    this.name = "";
    this.active = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.id = this.id.length > 0 ? this.id : this.componentId;
  }
  render() {
    this.style.display = this.active ? "block" : "none";
    return $`
      <div part="base" class="tab-panel" role="tabpanel" aria-hidden=${this.active ? "false" : "true"}>
        <slot></slot>
      </div>
    `;
  }
};
SlTabPanel.styles = tab_panel_styles_default;
__decorateClass([
  e({ reflect: true })
], SlTabPanel.prototype, "name", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlTabPanel.prototype, "active", 2);
SlTabPanel = __decorateClass([
  n("sl-tab-panel")
], SlTabPanel);

export {
  SlTabPanel
};
