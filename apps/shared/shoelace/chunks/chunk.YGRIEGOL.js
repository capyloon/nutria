import {
  radio_button_styles_default
} from "./chunk.XXI6D7OY.js";
import {
  n
} from "./chunk.IJY6XTKC.js";
import {
  l
} from "./chunk.V47DPYLL.js";
import {
  HasSlotController
} from "./chunk.NYIIDP5N.js";
import {
  o
} from "./chunk.ORW72H2K.js";
import {
  watch
} from "./chunk.VQ3XOPCT.js";
import {
  ShoelaceElement,
  e,
  e2,
  i,
  t
} from "./chunk.ROLL4627.js";
import {
  __decorateClass
} from "./chunk.LKA3TPUC.js";

// src/components/radio-button/radio-button.ts
var SlRadioButton = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.hasSlotController = new HasSlotController(this, "[default]", "prefix", "suffix");
    this.hasFocus = false;
    this.checked = false;
    this.disabled = false;
    this.size = "medium";
    this.pill = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "presentation");
  }
  handleBlur() {
    this.hasFocus = false;
    this.emit("sl-blur");
  }
  handleClick(e3) {
    if (this.disabled) {
      e3.preventDefault();
      e3.stopPropagation();
      return;
    }
    this.checked = true;
  }
  handleFocus() {
    this.hasFocus = true;
    this.emit("sl-focus");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  /** Sets focus on the radio button. */
  focus(options) {
    this.input.focus(options);
  }
  /** Removes focus from the radio button. */
  blur() {
    this.input.blur();
  }
  render() {
    return n`
      <div part="base" role="presentation">
        <button
          part="${`button${this.checked ? " button--checked" : ""}`}"
          role="radio"
          aria-checked="${this.checked}"
          class=${o({
      button: true,
      "button--default": true,
      "button--small": this.size === "small",
      "button--medium": this.size === "medium",
      "button--large": this.size === "large",
      "button--checked": this.checked,
      "button--disabled": this.disabled,
      "button--focused": this.hasFocus,
      "button--outline": true,
      "button--pill": this.pill,
      "button--has-label": this.hasSlotController.test("[default]"),
      "button--has-prefix": this.hasSlotController.test("prefix"),
      "button--has-suffix": this.hasSlotController.test("suffix")
    })}
          aria-disabled=${this.disabled}
          type="button"
          value=${l(this.value)}
          tabindex="${this.checked ? "0" : "-1"}"
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @click=${this.handleClick}
        >
          <slot name="prefix" part="prefix" class="button__prefix"></slot>
          <slot part="label" class="button__label"></slot>
          <slot name="suffix" part="suffix" class="button__suffix"></slot>
        </button>
      </div>
    `;
  }
};
SlRadioButton.styles = radio_button_styles_default;
__decorateClass([
  i(".button")
], SlRadioButton.prototype, "input", 2);
__decorateClass([
  i(".hidden-input")
], SlRadioButton.prototype, "hiddenInput", 2);
__decorateClass([
  t()
], SlRadioButton.prototype, "hasFocus", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlRadioButton.prototype, "checked", 2);
__decorateClass([
  e2()
], SlRadioButton.prototype, "value", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlRadioButton.prototype, "disabled", 2);
__decorateClass([
  e2({ reflect: true })
], SlRadioButton.prototype, "size", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlRadioButton.prototype, "pill", 2);
__decorateClass([
  watch("disabled", { waitUntilFirstUpdate: true })
], SlRadioButton.prototype, "handleDisabledChange", 1);
SlRadioButton = __decorateClass([
  e("sl-radio-button")
], SlRadioButton);

export {
  SlRadioButton
};
