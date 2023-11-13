import {
  tab_panel_styles_default
} from "./chunk.5HFAXYOW.js";
import {
  e
} from "./chunk.DOYC4G7X.js";
import {
  watch
} from "./chunk.XAOA43RZ.js";
import {
  ShoelaceElement,
  n
} from "./chunk.URBIOJXY.js";
import {
  x2 as x
} from "./chunk.27ILGUWR.js";
import {
  __decorateClass
} from "./chunk.YZETUBD6.js";

// src/components/tab-panel/tab-panel.component.ts
var id = 0;
var SlTabPanel = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.attrId = ++id;
    this.componentId = `sl-tab-panel-${this.attrId}`;
    this.name = "";
    this.active = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.id = this.id.length > 0 ? this.id : this.componentId;
    this.setAttribute("role", "tabpanel");
  }
  handleActiveChange() {
    this.setAttribute("aria-hidden", this.active ? "false" : "true");
  }
  render() {
    return x`
      <slot
        part="base"
        class=${e({
      "tab-panel": true,
      "tab-panel--active": this.active
    })}
      ></slot>
    `;
  }
};
SlTabPanel.styles = tab_panel_styles_default;
__decorateClass([
  n({ reflect: true })
], SlTabPanel.prototype, "name", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlTabPanel.prototype, "active", 2);
__decorateClass([
  watch("active")
], SlTabPanel.prototype, "handleActiveChange", 1);

export {
  SlTabPanel
};
