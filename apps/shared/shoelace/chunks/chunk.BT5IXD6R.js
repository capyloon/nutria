import {
  progress_bar_styles_default
} from "./chunk.DOJPHVG6.js";
import {
  o as o2
} from "./chunk.XKOG42H3.js";
import {
  LocalizeController
} from "./chunk.NH3SRVOC.js";
import {
  o
} from "./chunk.PNPJ7KDG.js";
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

// src/components/progress-bar/progress-bar.component.ts
var SlProgressBar = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.value = 0;
    this.indeterminate = false;
    this.label = "";
  }
  render() {
    return x`
      <div
        part="base"
        class=${e({
      "progress-bar": true,
      "progress-bar--indeterminate": this.indeterminate,
      "progress-bar--rtl": this.localize.dir() === "rtl"
    })}
        role="progressbar"
        title=${o(this.title)}
        aria-label=${this.label.length > 0 ? this.label : this.localize.term("progress")}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${this.indeterminate ? 0 : this.value}
      >
        <div part="indicator" class="progress-bar__indicator" style=${o2({ width: `${this.value}%` })}>
          ${!this.indeterminate ? x` <slot part="label" class="progress-bar__label"></slot> ` : ""}
        </div>
      </div>
    `;
  }
};
SlProgressBar.styles = progress_bar_styles_default;
__decorateClass([
  n({ type: Number, reflect: true })
], SlProgressBar.prototype, "value", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlProgressBar.prototype, "indeterminate", 2);
__decorateClass([
  n()
], SlProgressBar.prototype, "label", 2);

export {
  SlProgressBar
};
