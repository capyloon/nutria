import {
  input_styles_default
} from "./chunk.WVVUWAAN.js";
import {
  LocalizeController
} from "./chunk.H2OTHIKD.js";
import {
  l as l2
} from "./chunk.O2TDYW3A.js";
import {
  FormSubmitController
} from "./chunk.JXDWIUZF.js";
import {
  HasSlotController
} from "./chunk.3IYPB6RR.js";
import {
  o
} from "./chunk.7BXY5XRG.js";
import {
  watch
} from "./chunk.PQ5VRVXF.js";
import {
  emit
} from "./chunk.CDTZZV7W.js";
import {
  l
} from "./chunk.R37SUKY2.js";
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

// src/components/input/input.ts
var SlInput = class extends s {
  constructor() {
    super(...arguments);
    this.formSubmitController = new FormSubmitController(this);
    this.hasSlotController = new HasSlotController(this, "help-text", "label");
    this.localize = new LocalizeController(this);
    this.hasFocus = false;
    this.isPasswordVisible = false;
    this.type = "text";
    this.size = "medium";
    this.value = "";
    this.filled = false;
    this.pill = false;
    this.label = "";
    this.helpText = "";
    this.clearable = false;
    this.togglePassword = false;
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.invalid = false;
  }
  get valueAsDate() {
    var _a, _b;
    return (_b = (_a = this.input) == null ? void 0 : _a.valueAsDate) != null ? _b : null;
  }
  set valueAsDate(newValue) {
    this.updateComplete.then(() => {
      this.input.valueAsDate = newValue;
      this.value = this.input.value;
    });
  }
  get valueAsNumber() {
    var _a, _b;
    return (_b = (_a = this.input) == null ? void 0 : _a.valueAsNumber) != null ? _b : parseFloat(this.value);
  }
  set valueAsNumber(newValue) {
    this.updateComplete.then(() => {
      this.input.valueAsNumber = newValue;
      this.value = this.input.value;
    });
  }
  firstUpdated() {
    this.invalid = !this.input.checkValidity();
  }
  focus(options) {
    this.input.focus(options);
  }
  blur() {
    this.input.blur();
  }
  select() {
    this.input.select();
  }
  setSelectionRange(selectionStart, selectionEnd, selectionDirection = "none") {
    this.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
  }
  setRangeText(replacement, start, end, selectMode = "preserve") {
    this.input.setRangeText(replacement, start, end, selectMode);
    if (this.value !== this.input.value) {
      this.value = this.input.value;
      emit(this, "sl-input");
      emit(this, "sl-change");
    }
  }
  reportValidity() {
    return this.input.reportValidity();
  }
  setCustomValidity(message) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }
  handleBlur() {
    this.hasFocus = false;
    emit(this, "sl-blur");
  }
  handleChange() {
    this.value = this.input.value;
    emit(this, "sl-change");
  }
  handleClearClick(event) {
    this.value = "";
    emit(this, "sl-clear");
    emit(this, "sl-input");
    emit(this, "sl-change");
    this.input.focus();
    event.stopPropagation();
  }
  handleDisabledChange() {
    this.input.disabled = this.disabled;
    this.invalid = !this.input.checkValidity();
  }
  handleFocus() {
    this.hasFocus = true;
    emit(this, "sl-focus");
  }
  handleInput() {
    this.value = this.input.value;
    emit(this, "sl-input");
  }
  handleInvalid() {
    this.invalid = true;
  }
  handleKeyDown(event) {
    const hasModifier = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (event.key === "Enter" && !hasModifier) {
      this.formSubmitController.submit();
    }
  }
  handlePasswordToggle() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  handleValueChange() {
    this.invalid = !this.input.checkValidity();
  }
  render() {
    const hasLabelSlot = this.hasSlotController.test("label");
    const hasHelpTextSlot = this.hasSlotController.test("help-text");
    const hasLabel = this.label ? true : !!hasLabelSlot;
    const hasHelpText = this.helpText ? true : !!hasHelpTextSlot;
    return $`
      <div
        part="form-control"
        class=${o({
      "form-control": true,
      "form-control--small": this.size === "small",
      "form-control--medium": this.size === "medium",
      "form-control--large": this.size === "large",
      "form-control--has-label": hasLabel,
      "form-control--has-help-text": hasHelpText
    })}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${hasLabel ? "false" : "true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${o({
      input: true,
      "input--small": this.size === "small",
      "input--medium": this.size === "medium",
      "input--large": this.size === "large",
      "input--pill": this.pill,
      "input--standard": !this.filled,
      "input--filled": this.filled,
      "input--disabled": this.disabled,
      "input--focused": this.hasFocus,
      "input--empty": this.value.length === 0,
      "input--invalid": this.invalid
    })}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>

            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type === "password" && this.isPasswordVisible ? "text" : this.type}
              name=${l(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${l(this.placeholder)}
              minlength=${l(this.minlength)}
              maxlength=${l(this.maxlength)}
              min=${l(this.min)}
              max=${l(this.max)}
              step=${l(this.step)}
              .value=${l2(this.value)}
              autocapitalize=${l(this.autocapitalize)}
              autocomplete=${l(this.autocomplete)}
              autocorrect=${l(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${l(this.spellcheck)}
              pattern=${l(this.pattern)}
              enterkeyhint=${l(this.enterkeyhint)}
              inputmode=${l(this.inputmode)}
              aria-describedby="help-text"
              aria-invalid=${this.invalid ? "true" : "false"}
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${this.clearable && this.value.length > 0 ? $`
                  <button
                    part="clear-button"
                    class="input__clear"
                    type="button"
                    aria-label=${this.localize.term("clearEntry")}
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      <sl-icon name="x-circle-fill" library="system"></sl-icon>
                    </slot>
                  </button>
                ` : ""}
            ${this.togglePassword ? $`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.isPasswordVisible ? "hidePassword" : "showPassword")}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.isPasswordVisible ? $`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        ` : $`
                          <slot name="hide-password-icon">
                            <sl-icon name="eye" library="system"></sl-icon>
                          </slot>
                        `}
                  </button>
                ` : ""}

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${hasHelpText ? "false" : "true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `;
  }
};
SlInput.styles = input_styles_default;
__decorateClass([
  i(".input__control")
], SlInput.prototype, "input", 2);
__decorateClass([
  t()
], SlInput.prototype, "hasFocus", 2);
__decorateClass([
  t()
], SlInput.prototype, "isPasswordVisible", 2);
__decorateClass([
  e({ reflect: true })
], SlInput.prototype, "type", 2);
__decorateClass([
  e({ reflect: true })
], SlInput.prototype, "size", 2);
__decorateClass([
  e()
], SlInput.prototype, "name", 2);
__decorateClass([
  e()
], SlInput.prototype, "value", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlInput.prototype, "filled", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlInput.prototype, "pill", 2);
__decorateClass([
  e()
], SlInput.prototype, "label", 2);
__decorateClass([
  e({ attribute: "help-text" })
], SlInput.prototype, "helpText", 2);
__decorateClass([
  e({ type: Boolean })
], SlInput.prototype, "clearable", 2);
__decorateClass([
  e({ attribute: "toggle-password", type: Boolean })
], SlInput.prototype, "togglePassword", 2);
__decorateClass([
  e()
], SlInput.prototype, "placeholder", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlInput.prototype, "disabled", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlInput.prototype, "readonly", 2);
__decorateClass([
  e({ type: Number })
], SlInput.prototype, "minlength", 2);
__decorateClass([
  e({ type: Number })
], SlInput.prototype, "maxlength", 2);
__decorateClass([
  e()
], SlInput.prototype, "min", 2);
__decorateClass([
  e()
], SlInput.prototype, "max", 2);
__decorateClass([
  e({ type: Number })
], SlInput.prototype, "step", 2);
__decorateClass([
  e()
], SlInput.prototype, "pattern", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlInput.prototype, "required", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlInput.prototype, "invalid", 2);
__decorateClass([
  e()
], SlInput.prototype, "autocapitalize", 2);
__decorateClass([
  e()
], SlInput.prototype, "autocorrect", 2);
__decorateClass([
  e()
], SlInput.prototype, "autocomplete", 2);
__decorateClass([
  e({ type: Boolean })
], SlInput.prototype, "autofocus", 2);
__decorateClass([
  e()
], SlInput.prototype, "enterkeyhint", 2);
__decorateClass([
  e({ type: Boolean })
], SlInput.prototype, "spellcheck", 2);
__decorateClass([
  e()
], SlInput.prototype, "inputmode", 2);
__decorateClass([
  watch("disabled", { waitUntilFirstUpdate: true })
], SlInput.prototype, "handleDisabledChange", 1);
__decorateClass([
  watch("value", { waitUntilFirstUpdate: true })
], SlInput.prototype, "handleValueChange", 1);
SlInput = __decorateClass([
  n("sl-input")
], SlInput);

export {
  SlInput
};
