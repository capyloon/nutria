import {
  progress_ring_styles_default
} from "./chunk.QGKYNSKB.js";
import {
  LocalizeController
} from "./chunk.NH3SRVOC.js";
import {
  ShoelaceElement,
  e,
  n,
  r
} from "./chunk.URBIOJXY.js";
import {
  x2 as x
} from "./chunk.27ILGUWR.js";
import {
  __decorateClass
} from "./chunk.YZETUBD6.js";

// src/components/progress-ring/progress-ring.component.ts
var SlProgressRing = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.value = 0;
    this.label = "";
  }
  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has("value")) {
      const radius = parseFloat(getComputedStyle(this.indicator).getPropertyValue("r"));
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - this.value / 100 * circumference;
      this.indicatorOffset = `${offset}px`;
    }
  }
  render() {
    return x`
      <div
        part="base"
        class="progress-ring"
        role="progressbar"
        aria-label=${this.label.length > 0 ? this.label : this.localize.term("progress")}
        aria-describedby="label"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${this.value}"
        style="--percentage: ${this.value / 100}"
      >
        <svg class="progress-ring__image">
          <circle class="progress-ring__track"></circle>
          <circle class="progress-ring__indicator" style="stroke-dashoffset: ${this.indicatorOffset}"></circle>
        </svg>

        <slot id="label" part="label" class="progress-ring__label"></slot>
      </div>
    `;
  }
};
SlProgressRing.styles = progress_ring_styles_default;
__decorateClass([
  e(".progress-ring__indicator")
], SlProgressRing.prototype, "indicator", 2);
__decorateClass([
  r()
], SlProgressRing.prototype, "indicatorOffset", 2);
__decorateClass([
  n({ type: Number, reflect: true })
], SlProgressRing.prototype, "value", 2);
__decorateClass([
  n()
], SlProgressRing.prototype, "label", 2);

export {
  SlProgressRing
};
