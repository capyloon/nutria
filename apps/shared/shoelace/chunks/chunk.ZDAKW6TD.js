import {
  divider_styles_default
} from "./chunk.PCNTRSPK.js";
import {
  watch
} from "./chunk.XAOA43RZ.js";
import {
  ShoelaceElement,
  n
} from "./chunk.URBIOJXY.js";
import {
  __decorateClass
} from "./chunk.YZETUBD6.js";

// src/components/divider/divider.component.ts
var SlDivider = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.vertical = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "separator");
  }
  handleVerticalChange() {
    this.setAttribute("aria-orientation", this.vertical ? "vertical" : "horizontal");
  }
};
SlDivider.styles = divider_styles_default;
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlDivider.prototype, "vertical", 2);
__decorateClass([
  watch("vertical")
], SlDivider.prototype, "handleVerticalChange", 1);

export {
  SlDivider
};
