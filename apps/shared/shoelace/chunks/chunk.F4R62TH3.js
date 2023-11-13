import {
  carousel_item_styles_default
} from "./chunk.NT6GBT3X.js";
import {
  ShoelaceElement
} from "./chunk.URBIOJXY.js";
import {
  x2 as x
} from "./chunk.27ILGUWR.js";

// src/components/carousel-item/carousel-item.component.ts
var SlCarouselItem = class extends ShoelaceElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "group");
  }
  render() {
    return x` <slot></slot> `;
  }
};
SlCarouselItem.styles = carousel_item_styles_default;

export {
  SlCarouselItem
};
