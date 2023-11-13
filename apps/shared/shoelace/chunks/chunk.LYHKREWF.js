import {
  menu_label_styles_default
} from "./chunk.UUPFKID5.js";
import {
  ShoelaceElement
} from "./chunk.URBIOJXY.js";
import {
  x2 as x
} from "./chunk.27ILGUWR.js";

// src/components/menu-label/menu-label.component.ts
var SlMenuLabel = class extends ShoelaceElement {
  render() {
    return x` <slot part="base" class="menu-label"></slot> `;
  }
};
SlMenuLabel.styles = menu_label_styles_default;

export {
  SlMenuLabel
};
