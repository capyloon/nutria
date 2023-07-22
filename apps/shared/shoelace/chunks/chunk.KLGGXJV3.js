import {
  skeleton_styles_default
} from "./chunk.MQ7QFCHP.js";
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

// src/components/skeleton/skeleton.ts
var SlSkeleton = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.effect = "none";
  }
  render() {
    return y`
      <div
        part="base"
        class=${o({
      skeleton: true,
      "skeleton--pulse": this.effect === "pulse",
      "skeleton--sheen": this.effect === "sheen"
    })}
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `;
  }
};
SlSkeleton.styles = skeleton_styles_default;
__decorateClass([
  e2()
], SlSkeleton.prototype, "effect", 2);
SlSkeleton = __decorateClass([
  e("sl-skeleton")
], SlSkeleton);

export {
  SlSkeleton
};
