import {
  visually_hidden_styles_default
} from "./chunk.UFTP7SAL.js";
import {
  ShoelaceElement,
  e
} from "./chunk.ROLL4627.js";
import {
  y
} from "./chunk.DUT32TWM.js";
import {
  __decorateClass
} from "./chunk.LKA3TPUC.js";

// src/components/visually-hidden/visually-hidden.ts
var SlVisuallyHidden = class extends ShoelaceElement {
  render() {
    return y` <slot></slot> `;
  }
};
SlVisuallyHidden.styles = visually_hidden_styles_default;
SlVisuallyHidden = __decorateClass([
  e("sl-visually-hidden")
], SlVisuallyHidden);

export {
  SlVisuallyHidden
};
