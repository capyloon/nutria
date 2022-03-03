import {
  badge_styles_default
} from "./chunk.7PNSFSF6.js";
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

// src/components/badge/badge.ts
var SlBadge = class extends s {
  constructor() {
    super(...arguments);
    this.variant = "primary";
    this.pill = false;
    this.pulse = false;
  }
  render() {
    return $`
      <span
        part="base"
        class=${o({
      badge: true,
      "badge--primary": this.variant === "primary",
      "badge--success": this.variant === "success",
      "badge--neutral": this.variant === "neutral",
      "badge--warning": this.variant === "warning",
      "badge--danger": this.variant === "danger",
      "badge--pill": this.pill,
      "badge--pulse": this.pulse
    })}
        role="status"
      >
        <slot></slot>
      </span>
    `;
  }
};
SlBadge.styles = badge_styles_default;
__decorateClass([
  e({ reflect: true })
], SlBadge.prototype, "variant", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlBadge.prototype, "pill", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlBadge.prototype, "pulse", 2);
SlBadge = __decorateClass([
  n("sl-badge")
], SlBadge);

export {
  SlBadge
};
