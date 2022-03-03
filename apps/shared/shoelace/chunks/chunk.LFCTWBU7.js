import {
  skeleton_styles_default
} from "./chunk.4SHATWZF.js";
import {
  o
} from "./chunk.7BXY5XRG.js";
import {
  e,
  n
} from "./chunk.72DLNKYZ.js";
import {
  $,
  s
} from "./chunk.PEQICPKO.js";
import {
  __decorateClass
} from "./chunk.ICGTMF5Z.js";

// src/components/skeleton/skeleton.ts
var SlSkeleton = class extends s {
  constructor() {
    super(...arguments);
    this.effect = "none";
  }
  render() {
    return $`
      <div
        part="base"
        class=${o({
      skeleton: true,
      "skeleton--pulse": this.effect === "pulse",
      "skeleton--sheen": this.effect === "sheen"
    })}
        aria-busy="true"
        aria-live="polite"
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `;
  }
};
SlSkeleton.styles = skeleton_styles_default;
__decorateClass([
  e()
], SlSkeleton.prototype, "effect", 2);
SlSkeleton = __decorateClass([
  n("sl-skeleton")
], SlSkeleton);

export {
  SlSkeleton
};
