import {
  carousel_item_styles_default
} from "./chunk.NNN7KQVN.js";
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

// src/components/carousel-item/carousel-item.ts
var SlCarouselItem = class extends ShoelaceElement {
  static isCarouselItem(node) {
    return node instanceof Element && node.getAttribute("aria-roledescription") === "slide";
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "group");
  }
  render() {
    return y` <slot></slot> `;
  }
};
SlCarouselItem.styles = carousel_item_styles_default;
SlCarouselItem = __decorateClass([
  e("sl-carousel-item")
], SlCarouselItem);

export {
  SlCarouselItem
};
