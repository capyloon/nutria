import {
  card_styles_default
} from "./chunk.BZVXMWBD.js";
import {
  HasSlotController
} from "./chunk.NYIIDP5N.js";
import {
  o
} from "./chunk.ORW72H2K.js";
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

// src/components/card/card.ts
var SlCard = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.hasSlotController = new HasSlotController(this, "footer", "header", "image");
  }
  render() {
    return y`
      <div
        part="base"
        class=${o({
      card: true,
      "card--has-footer": this.hasSlotController.test("footer"),
      "card--has-image": this.hasSlotController.test("image"),
      "card--has-header": this.hasSlotController.test("header")
    })}
      >
        <slot name="image" part="image" class="card__image"></slot>
        <slot name="header" part="header" class="card__header"></slot>
        <slot part="body" class="card__body"></slot>
        <slot name="footer" part="footer" class="card__footer"></slot>
      </div>
    `;
  }
};
SlCard.styles = card_styles_default;
SlCard = __decorateClass([
  e("sl-card")
], SlCard);

export {
  SlCard
};
