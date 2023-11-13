import {
  badge_styles_default
} from "./chunk.XZMYMJVO.js";
import {
  e
} from "./chunk.DOYC4G7X.js";
import {
  ShoelaceElement,
  n
} from "./chunk.URBIOJXY.js";
import {
  x2 as x
} from "./chunk.27ILGUWR.js";
import {
  __decorateClass
} from "./chunk.YZETUBD6.js";

// src/components/badge/badge.component.ts
var SlBadge = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.variant = "primary";
    this.pill = false;
    this.pulse = false;
  }
  render() {
    return x`
      <span
        part="base"
        class=${e({
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
  n({ reflect: true })
], SlBadge.prototype, "variant", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlBadge.prototype, "pill", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlBadge.prototype, "pulse", 2);

export {
  SlBadge
};
