import {
  FormControlController,
  validValidityState
} from "./chunk.OCAFZ6SL.js";
import {
  button_styles_default
} from "./chunk.6ASPYS6I.js";
import {
  i as i2,
  n
} from "./chunk.IJY6XTKC.js";
import {
  l
} from "./chunk.V47DPYLL.js";
import {
  HasSlotController
} from "./chunk.NYIIDP5N.js";
import {
  LocalizeController
} from "./chunk.BWLRNN6E.js";
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

// src/components/button/button.ts
var SlButton = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.formControlController = new FormControlController(this, {
      form: (input) => {
        if (input.hasAttribute("form")) {
          const doc = input.getRootNode();
          const formId = input.getAttribute("form");
          return doc.getElementById(formId);
        }
        return input.closest("form");
      },
      assumeInteractionOn: ["click"]
    });
    this.hasSlotController = new HasSlotController(this, "[default]", "prefix", "suffix");
    this.localize = new LocalizeController(this);
    this.hasFocus = false;
    this.invalid = false;
    this.title = "";
    this.variant = "default";
    this.size = "medium";
    this.caret = false;
    this.disabled = false;
    this.loading = false;
    this.outline = false;
    this.pill = false;
    this.circle = false;
    this.type = "button";
    this.name = "";
    this.value = "";
    this.href = "";
    this.rel = "noreferrer noopener";
  }
  /** Gets the validity state object */
  get validity() {
    if (this.isButton()) {
      return this.button.validity;
    }
    return validValidityState;
  }
  /** Gets the validation message */
  get validationMessage() {
    if (this.isButton()) {
      return this.button.validationMessage;
    }
    return "";
  }
  firstUpdated() {
    if (this.isButton()) {
      this.formControlController.updateValidity();
    }
  }
  handleBlur() {
    this.hasFocus = false;
    this.emit("sl-blur");
  }
  handleFocus() {
    this.hasFocus = true;
    this.emit("sl-focus");
  }
  handleClick() {
    if (this.type === "submit") {
      this.formControlController.submit(this);
    }
    if (this.type === "reset") {
      this.formControlController.reset(this);
    }
  }
  handleInvalid(event) {
    this.formControlController.setValidity(false);
    this.formControlController.emitInvalidEvent(event);
  }
  isButton() {
    return this.href ? false : true;
  }
  isLink() {
    return this.href ? true : false;
  }
  handleDisabledChange() {
    if (this.isButton()) {
      this.formControlController.setValidity(this.disabled);
    }
  }
  /** Simulates a click on the button. */
  click() {
    this.button.click();
  }
  /** Sets focus on the button. */
  focus(options) {
    this.button.focus(options);
  }
  /** Removes focus from the button. */
  blur() {
    this.button.blur();
  }
  /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
  checkValidity() {
    if (this.isButton()) {
      return this.button.checkValidity();
    }
    return true;
  }
  /** Gets the associated form, if one exists. */
  getForm() {
    return this.formControlController.getForm();
  }
  /** Checks for validity and shows the browser's validation message if the control is invalid. */
  reportValidity() {
    if (this.isButton()) {
      return this.button.reportValidity();
    }
    return true;
  }
  /** Sets a custom validation message. Pass an empty string to restore validity. */
  setCustomValidity(message) {
    if (this.isButton()) {
      this.button.setCustomValidity(message);
      this.formControlController.updateValidity();
    }
  }
  render() {
    const isLink = this.isLink();
    const tag = isLink ? i2`a` : i2`button`;
    return n`
      <${tag}
        part="base"
        class=${o({
      button: true,
      "button--default": this.variant === "default",
      "button--primary": this.variant === "primary",
      "button--success": this.variant === "success",
      "button--neutral": this.variant === "neutral",
      "button--warning": this.variant === "warning",
      "button--danger": this.variant === "danger",
      "button--text": this.variant === "text",
      "button--small": this.size === "small",
      "button--medium": this.size === "medium",
      "button--large": this.size === "large",
      "button--caret": this.caret,
      "button--circle": this.circle,
      "button--disabled": this.disabled,
      "button--focused": this.hasFocus,
      "button--loading": this.loading,
      "button--standard": !this.outline,
      "button--outline": this.outline,
      "button--pill": this.pill,
      "button--rtl": this.localize.dir() === "rtl",
      "button--has-label": this.hasSlotController.test("[default]"),
      "button--has-prefix": this.hasSlotController.test("prefix"),
      "button--has-suffix": this.hasSlotController.test("suffix")
    })}
        ?disabled=${l(isLink ? void 0 : this.disabled)}
        type=${l(isLink ? void 0 : this.type)}
        title=${this.title}
        name=${l(isLink ? void 0 : this.name)}
        value=${l(isLink ? void 0 : this.value)}
        href=${l(isLink ? this.href : void 0)}
        target=${l(isLink ? this.target : void 0)}
        download=${l(isLink ? this.download : void 0)}
        rel=${l(isLink ? this.rel : void 0)}
        role=${l(isLink ? void 0 : "button")}
        aria-disabled=${this.disabled ? "true" : "false"}
        tabindex=${this.disabled ? "-1" : "0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret ? n` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> ` : ""}
        ${this.loading ? n`<sl-spinner part="spinner"></sl-spinner>` : ""}
      </${tag}>
    `;
  }
};
SlButton.styles = button_styles_default;
__decorateClass([
  i(".button")
], SlButton.prototype, "button", 2);
__decorateClass([
  t()
], SlButton.prototype, "hasFocus", 2);
__decorateClass([
  t()
], SlButton.prototype, "invalid", 2);
__decorateClass([
  e2()
], SlButton.prototype, "title", 2);
__decorateClass([
  e2({ reflect: true })
], SlButton.prototype, "variant", 2);
__decorateClass([
  e2({ reflect: true })
], SlButton.prototype, "size", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlButton.prototype, "caret", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlButton.prototype, "disabled", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlButton.prototype, "loading", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlButton.prototype, "outline", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlButton.prototype, "pill", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlButton.prototype, "circle", 2);
__decorateClass([
  e2()
], SlButton.prototype, "type", 2);
__decorateClass([
  e2()
], SlButton.prototype, "name", 2);
__decorateClass([
  e2()
], SlButton.prototype, "value", 2);
__decorateClass([
  e2()
], SlButton.prototype, "href", 2);
__decorateClass([
  e2()
], SlButton.prototype, "target", 2);
__decorateClass([
  e2()
], SlButton.prototype, "rel", 2);
__decorateClass([
  e2()
], SlButton.prototype, "download", 2);
__decorateClass([
  e2()
], SlButton.prototype, "form", 2);
__decorateClass([
  e2({ attribute: "formaction" })
], SlButton.prototype, "formAction", 2);
__decorateClass([
  e2({ attribute: "formenctype" })
], SlButton.prototype, "formEnctype", 2);
__decorateClass([
  e2({ attribute: "formmethod" })
], SlButton.prototype, "formMethod", 2);
__decorateClass([
  e2({ attribute: "formnovalidate", type: Boolean })
], SlButton.prototype, "formNoValidate", 2);
__decorateClass([
  e2({ attribute: "formtarget" })
], SlButton.prototype, "formTarget", 2);
__decorateClass([
  watch("disabled", { waitUntilFirstUpdate: true })
], SlButton.prototype, "handleDisabledChange", 1);
SlButton = __decorateClass([
  e("sl-button")
], SlButton);

export {
  SlButton
};
