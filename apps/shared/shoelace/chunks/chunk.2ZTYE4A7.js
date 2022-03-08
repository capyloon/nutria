import {
  button_styles_default
} from "./chunk.L5FZYACI.js";
import {
  FormSubmitController
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
  s,
  y
} from "./chunk.PEQICPKO.js";
import {
  __decorateClass
} from "./chunk.ICGTMF5Z.js";

// node_modules/lit-html/static.js
var r = (t2, ...e2) => ({ _$litStatic$: e2.reduce((e3, o2, r2) => e3 + ((t3) => {
  if (t3._$litStatic$ !== void 0)
    return t3._$litStatic$;
  throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t3}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
})(o2) + t2[r2 + 1], t2[0]) });
var i2 = /* @__PURE__ */ new Map();
var a = (t2) => (e2, ...o2) => {
  var r2;
  const a2 = o2.length;
  let l3, s3;
  const n2 = [], u = [];
  let c, $2 = 0, v = false;
  for (; $2 < a2; ) {
    for (c = e2[$2]; $2 < a2 && (s3 = o2[$2], l3 = (r2 = s3) === null || r2 === void 0 ? void 0 : r2._$litStatic$) !== void 0; )
      c += l3 + e2[++$2], v = true;
    u.push(s3), n2.push(c), $2++;
  }
  if ($2 === a2 && n2.push(e2[a2]), v) {
    const t3 = n2.join("$$lit$$");
    (e2 = i2.get(t3)) === void 0 && (n2.raw = n2, i2.set(t3, e2 = n2)), o2 = u;
  }
  return t2(e2, ...o2);
};
var l2 = a($);
var s2 = a(y);

// src/components/button/button.ts
var SlButton = class extends s {
  constructor() {
    super(...arguments);
    this.formSubmitController = new FormSubmitController(this, {
      form: (input) => {
        if (input.hasAttribute("form")) {
          const doc = input.getRootNode();
          const formId = input.getAttribute("form");
          return doc.getElementById(formId);
        }
        return input.closest("form");
      }
    });
    this.hasSlotController = new HasSlotController(this, "[default]", "prefix", "suffix");
    this.hasFocus = false;
    this.variant = "default";
    this.size = "medium";
    this.caret = false;
    this.disabled = false;
    this.loading = false;
    this.outline = false;
    this.pill = false;
    this.circle = false;
    this.type = "button";
  }
  click() {
    this.button.click();
  }
  focus(options) {
    this.button.focus(options);
  }
  blur() {
    this.button.blur();
  }
  handleBlur() {
    this.hasFocus = false;
    emit(this, "sl-blur");
  }
  handleFocus() {
    this.hasFocus = true;
    emit(this, "sl-focus");
  }
  handleClick(event) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (this.type === "submit") {
      this.formSubmitController.submit(this);
    }
  }
  render() {
    const isLink = this.href ? true : false;
    const tag = isLink ? r`a` : r`button`;
    return l2`
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
      "button--has-label": this.hasSlotController.test("[default]"),
      "button--has-prefix": this.hasSlotController.test("prefix"),
      "button--has-suffix": this.hasSlotController.test("suffix")
    })}
        ?disabled=${l(isLink ? void 0 : this.disabled)}
        type=${this.type}
        name=${l(isLink ? void 0 : this.name)}
        value=${l(isLink ? void 0 : this.value)}
        href=${l(this.href)}
        target=${l(this.target)}
        download=${l(this.download)}
        rel=${l(this.target ? "noreferrer noopener" : void 0)}
        role="button"
        aria-disabled=${this.disabled ? "true" : "false"}
        tabindex=${this.disabled ? "-1" : "0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <span part="prefix" class="button__prefix">
          <slot name="prefix"></slot>
        </span>
        <span part="label" class="button__label">
          <slot></slot>
        </span>
        <span part="suffix" class="button__suffix">
          <slot name="suffix"></slot>
        </span>
        ${this.caret ? l2`
                <span part="caret" class="button__caret">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              ` : ""}
        ${this.loading ? l2`<sl-spinner></sl-spinner>` : ""}
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
  e({ reflect: true })
], SlButton.prototype, "variant", 2);
__decorateClass([
  e({ reflect: true })
], SlButton.prototype, "size", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlButton.prototype, "caret", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlButton.prototype, "disabled", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlButton.prototype, "loading", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlButton.prototype, "outline", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlButton.prototype, "pill", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlButton.prototype, "circle", 2);
__decorateClass([
  e()
], SlButton.prototype, "type", 2);
__decorateClass([
  e()
], SlButton.prototype, "name", 2);
__decorateClass([
  e()
], SlButton.prototype, "value", 2);
__decorateClass([
  e()
], SlButton.prototype, "href", 2);
__decorateClass([
  e()
], SlButton.prototype, "target", 2);
__decorateClass([
  e()
], SlButton.prototype, "download", 2);
__decorateClass([
  e()
], SlButton.prototype, "form", 2);
__decorateClass([
  e({ attribute: "formaction" })
], SlButton.prototype, "formAction", 2);
__decorateClass([
  e({ attribute: "formmethod" })
], SlButton.prototype, "formMethod", 2);
__decorateClass([
  e({ attribute: "formnovalidate", type: Boolean })
], SlButton.prototype, "formNoValidate", 2);
__decorateClass([
  e({ attribute: "formtarget" })
], SlButton.prototype, "formTarget", 2);
SlButton = __decorateClass([
  n("sl-button")
], SlButton);

export {
  SlButton
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
