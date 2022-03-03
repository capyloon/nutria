import {
  divider_styles_default
} from "./chunk.6Q6RSBMS.js";
import {
  watch
} from "./chunk.PQ5VRVXF.js";
import {
  e,
  n
} from "./chunk.72DLNKYZ.js";
import {
  s
} from "./chunk.PEQICPKO.js";
import {
  __decorateClass
} from "./chunk.ICGTMF5Z.js";

// src/components/divider/divider.ts
var SlDivider = class extends s {
  constructor() {
    super(...arguments);
    this.vertical = false;
  }
  firstUpdated() {
    this.setAttribute("role", "separator");
  }
  handleVerticalChange() {
    this.setAttribute("aria-orientation", this.vertical ? "vertical" : "horizontal");
  }
};
SlDivider.styles = divider_styles_default;
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlDivider.prototype, "vertical", 2);
__decorateClass([
  watch("vertical")
], SlDivider.prototype, "handleVerticalChange", 1);
SlDivider = __decorateClass([
  n("sl-divider")
], SlDivider);

export {
  SlDivider
};
