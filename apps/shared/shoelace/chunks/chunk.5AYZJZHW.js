import {
  tag_styles_default
} from "./chunk.4RNZLG33.js";
import {
  LocalizeController
} from "./chunk.BWLRNN6E.js";
import {
  o
} from "./chunk.ORW72H2K.js";
import {
  ShoelaceElement,
  e,
  e2
} from "./chunk.ROLL4627.js";
import {
  y
} from "./chunk.DUT32TWM.js";
import {
  __decorateClass
} from "./chunk.LKA3TPUC.js";

// src/components/tag/tag.ts
var SlTag = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.variant = "neutral";
    this.size = "medium";
    this.pill = false;
    this.removable = false;
  }
  handleRemoveClick() {
    this.emit("sl-remove");
  }
  render() {
    return y`
      <span
        part="base"
        class=${o({
      tag: true,
      // Types
      "tag--primary": this.variant === "primary",
      "tag--success": this.variant === "success",
      "tag--neutral": this.variant === "neutral",
      "tag--warning": this.variant === "warning",
      "tag--danger": this.variant === "danger",
      "tag--text": this.variant === "text",
      // Sizes
      "tag--small": this.size === "small",
      "tag--medium": this.size === "medium",
      "tag--large": this.size === "large",
      // Modifiers
      "tag--pill": this.pill,
      "tag--removable": this.removable
    })}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable ? y`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("remove")}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></sl-icon-button>
            ` : ""}
      </span>
    `;
  }
};
SlTag.styles = tag_styles_default;
__decorateClass([
  e2({ reflect: true })
], SlTag.prototype, "variant", 2);
__decorateClass([
  e2({ reflect: true })
], SlTag.prototype, "size", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlTag.prototype, "pill", 2);
__decorateClass([
  e2({ type: Boolean })
], SlTag.prototype, "removable", 2);
SlTag = __decorateClass([
  e("sl-tag")
], SlTag);

export {
  SlTag
};
