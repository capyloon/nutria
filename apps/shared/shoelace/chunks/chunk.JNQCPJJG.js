import {
  range_styles_default
} from "./chunk.GY2VUPPM.js";
import {
  l as l2
} from "./chunk.O2TDYW3A.js";
import {
  autoIncrement
} from "./chunk.KFR7NC2M.js";
import {
  FormSubmitController,
  getLabelledBy,
  renderFormControl
} from "./chunk.IN6TNXRK.js";
import {
  HasSlotController
} from "./chunk.HQSLB26P.js";
import {
  o
} from "./chunk.7BXY5XRG.js";
import {
  l
} from "./chunk.R37SUKY2.js";
import {
  watch
} from "./chunk.PQ5VRVXF.js";
import {
  emit
} from "./chunk.CDTZZV7W.js";
import {
  e,
  i,
  n,
  t
} from "./chunk.72DLNKYZ.js";
import {
  $,
  s
} from "./chunk.PEQICPKO.js";
import {
  __decorateClass
} from "./chunk.ICGTMF5Z.js";

// src/components/range/range.ts
var SlRange = class extends s {
  constructor() {
    super(...arguments);
    this.formSubmitController = new FormSubmitController(this);
    this.hasSlotController = new HasSlotController(this, "help-text", "label");
    this.attrId = autoIncrement();
    this.inputId = `input-${this.attrId}`;
    this.helpTextId = `input-help-text-${this.attrId}`;
    this.labelId = `input-label-${this.attrId}`;
    this.hasFocus = false;
    this.hasTooltip = false;
    this.name = "";
    this.value = 0;
    this.label = "";
    this.helpText = "";
    this.disabled = false;
    this.invalid = false;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.tooltip = "top";
    this.tooltipFormatter = (value) => value.toString();
  }
  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => this.syncRange());
    if (!this.value) {
      this.value = this.min;
    }
    if (this.value < this.min) {
      this.value = this.min;
    }
    if (this.value > this.max) {
      this.value = this.max;
    }
    this.updateComplete.then(() => {
      this.syncRange();
      this.resizeObserver.observe(this.input);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.unobserve(this.input);
  }
  focus(options) {
    this.input.focus(options);
  }
  blur() {
    this.input.blur();
  }
  setCustomValidity(message) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }
  handleInput() {
    this.value = parseFloat(this.input.value);
    emit(this, "sl-change");
    this.syncRange();
  }
  handleBlur() {
    this.hasFocus = false;
    this.hasTooltip = false;
    emit(this, "sl-blur");
  }
  handleValueChange() {
    this.invalid = !this.input.checkValidity();
    this.input.value = this.value.toString();
    this.value = parseFloat(this.input.value);
    this.syncRange();
  }
  handleDisabledChange() {
    this.input.disabled = this.disabled;
    this.invalid = !this.input.checkValidity();
  }
  handleFocus() {
    this.hasFocus = true;
    this.hasTooltip = true;
    emit(this, "sl-focus");
  }
  handleThumbDragStart() {
    this.hasTooltip = true;
  }
  handleThumbDragEnd() {
    this.hasTooltip = false;
  }
  syncRange() {
    const percent = Math.max(0, (this.value - this.min) / (this.max - this.min));
    this.syncProgress(percent);
    if (this.tooltip !== "none") {
      this.syncTooltip(percent);
    }
  }
  syncProgress(percent) {
    this.input.style.background = `linear-gradient(to right, var(--track-color-active) 0%, var(--track-color-active) ${percent * 100}%, var(--track-color-inactive) ${percent * 100}%, var(--track-color-inactive) 100%)`;
  }
  syncTooltip(percent) {
    if (this.output !== null) {
      const inputWidth = this.input.offsetWidth;
      const tooltipWidth = this.output.offsetWidth;
      const thumbSize = getComputedStyle(this.input).getPropertyValue("--thumb-size");
      const x = `calc(${inputWidth * percent}px - calc(calc(${percent} * ${thumbSize}) - calc(${thumbSize} / 2)))`;
      this.output.style.transform = `translateX(${x})`;
      this.output.style.marginLeft = `-${tooltipWidth / 2}px`;
    }
  }
  render() {
    const hasLabelSlot = this.hasSlotController.test("label");
    const hasHelpTextSlot = this.hasSlotController.test("help-text");
    return renderFormControl({
      inputId: this.inputId,
      label: this.label,
      labelId: this.labelId,
      hasLabelSlot,
      helpTextId: this.helpTextId,
      helpText: this.helpText,
      hasHelpTextSlot,
      size: "medium"
    }, $`
        <div
          part="base"
          class=${o({
      range: true,
      "range--disabled": this.disabled,
      "range--focused": this.hasFocus,
      "range--tooltip-visible": this.hasTooltip,
      "range--tooltip-top": this.tooltip === "top",
      "range--tooltip-bottom": this.tooltip === "bottom"
    })}
          @mousedown=${this.handleThumbDragStart}
          @mouseup=${this.handleThumbDragEnd}
          @touchstart=${this.handleThumbDragStart}
          @touchend=${this.handleThumbDragEnd}
        >
          <input
            part="input"
            type="range"
            class="range__control"
            name=${l(this.name)}
            ?disabled=${this.disabled}
            min=${l(this.min)}
            max=${l(this.max)}
            step=${l(this.step)}
            .value=${l2(this.value.toString())}
            aria-labelledby=${l(getLabelledBy({
      label: this.label,
      labelId: this.labelId,
      hasLabelSlot,
      helpText: this.helpText,
      helpTextId: this.helpTextId,
      hasHelpTextSlot
    }))}
            @input=${this.handleInput}
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
          />
          ${this.tooltip !== "none" && !this.disabled ? $`
                <output part="tooltip" class="range__tooltip">
                  ${typeof this.tooltipFormatter === "function" ? this.tooltipFormatter(this.value) : this.value}
                </output>
              ` : ""}
        </div>
      `);
  }
};
SlRange.styles = range_styles_default;
__decorateClass([
  i(".range__control")
], SlRange.prototype, "input", 2);
__decorateClass([
  i(".range__tooltip")
], SlRange.prototype, "output", 2);
__decorateClass([
  t()
], SlRange.prototype, "hasFocus", 2);
__decorateClass([
  t()
], SlRange.prototype, "hasTooltip", 2);
__decorateClass([
  e()
], SlRange.prototype, "name", 2);
__decorateClass([
  e({ type: Number })
], SlRange.prototype, "value", 2);
__decorateClass([
  e()
], SlRange.prototype, "label", 2);
__decorateClass([
  e({ attribute: "help-text" })
], SlRange.prototype, "helpText", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlRange.prototype, "disabled", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlRange.prototype, "invalid", 2);
__decorateClass([
  e({ type: Number })
], SlRange.prototype, "min", 2);
__decorateClass([
  e({ type: Number })
], SlRange.prototype, "max", 2);
__decorateClass([
  e({ type: Number })
], SlRange.prototype, "step", 2);
__decorateClass([
  e()
], SlRange.prototype, "tooltip", 2);
__decorateClass([
  e({ attribute: false })
], SlRange.prototype, "tooltipFormatter", 2);
__decorateClass([
  watch("value", { waitUntilFirstUpdate: true })
], SlRange.prototype, "handleValueChange", 1);
__decorateClass([
  watch("disabled", { waitUntilFirstUpdate: true })
], SlRange.prototype, "handleDisabledChange", 1);
SlRange = __decorateClass([
  n("sl-range")
], SlRange);

export {
  SlRange
};
