import {
  visually_hidden_styles_default
} from "./chunk.WCLQWUBK.js";
import {
  n
} from "./chunk.72DLNKYZ.js";
import {
  $,
  s
} from "./chunk.PEQICPKO.js";
import {
  __decorateClass
} from "./chunk.ICGTMF5Z.js";

// src/components/visually-hidden/visually-hidden.ts
var SlVisuallyHidden = class extends s {
  render() {
    return $` <slot></slot> `;
  }
};
SlVisuallyHidden.styles = visually_hidden_styles_default;
SlVisuallyHidden = __decorateClass([
  n("sl-visually-hidden")
], SlVisuallyHidden);

export {
  SlVisuallyHidden
};
