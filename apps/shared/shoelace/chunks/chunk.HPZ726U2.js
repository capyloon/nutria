import {
  LocalizeController
} from "./chunk.EBGTCCKY.js";
import {
  e,
  n
} from "./chunk.72DLNKYZ.js";
import {
  s
} from "./chunk.PEQICPKO.js";
import {
  __decorateClass
} from "./chunk.ICGTMF5Z.js";

// src/components/format-bytes/format-bytes.ts
var SlFormatBytes = class extends s {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.value = 0;
    this.unit = "byte";
    this.display = "short";
  }
  render() {
    if (isNaN(this.value)) {
      return "";
    }
    const bitPrefixes = ["", "kilo", "mega", "giga", "tera"];
    const bytePrefixes = ["", "kilo", "mega", "giga", "tera", "peta"];
    const prefix = this.unit === "bit" ? bitPrefixes : bytePrefixes;
    const index = Math.max(0, Math.min(Math.floor(Math.log10(this.value) / 3), prefix.length - 1));
    const unit = prefix[index] + this.unit;
    const valueToFormat = parseFloat((this.value / Math.pow(1e3, index)).toPrecision(3));
    return this.localize.number(valueToFormat, {
      style: "unit",
      unit,
      unitDisplay: this.display
    });
  }
};
__decorateClass([
  e({ type: Number })
], SlFormatBytes.prototype, "value", 2);
__decorateClass([
  e()
], SlFormatBytes.prototype, "unit", 2);
__decorateClass([
  e()
], SlFormatBytes.prototype, "display", 2);
__decorateClass([
  e()
], SlFormatBytes.prototype, "lang", 2);
SlFormatBytes = __decorateClass([
  n("sl-format-bytes")
], SlFormatBytes);

export {
  SlFormatBytes
};
