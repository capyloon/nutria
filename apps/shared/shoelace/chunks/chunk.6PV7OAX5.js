import {
  getAnimation,
  setDefaultAnimation
} from "./chunk.OAQT3AUQ.js";
import {
  waitForEvent
} from "./chunk.B4BZKR24.js";
import {
  animateTo,
  stopAnimations
} from "./chunk.65AZ2BGN.js";
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
  alert_styles_default
} from "./chunk.UTZKJDOX.js";
import {
  watch
} from "./chunk.VQ3XOPCT.js";
import {
  ShoelaceElement,
  e,
  e2,
  i
} from "./chunk.ROLL4627.js";
import {
  y
} from "./chunk.DUT32TWM.js";
import {
  __decorateClass
} from "./chunk.LKA3TPUC.js";

// src/components/alert/alert.ts
var toastStack = Object.assign(document.createElement("div"), { className: "sl-toast-stack" });
var SlAlert = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.hasSlotController = new HasSlotController(this, "icon", "suffix");
    this.localize = new LocalizeController(this);
    this.open = false;
    this.closable = false;
    this.variant = "primary";
    this.duration = Infinity;
  }
  firstUpdated() {
    this.base.hidden = !this.open;
  }
  restartAutoHide() {
    clearTimeout(this.autoHideTimeout);
    if (this.open && this.duration < Infinity) {
      this.autoHideTimeout = window.setTimeout(() => this.hide(), this.duration);
    }
  }
  handleCloseClick() {
    this.hide();
  }
  handleMouseMove() {
    this.restartAutoHide();
  }
  async handleOpenChange() {
    if (this.open) {
      this.emit("sl-show");
      if (this.duration < Infinity) {
        this.restartAutoHide();
      }
      await stopAnimations(this.base);
      this.base.hidden = false;
      const { keyframes, options } = getAnimation(this, "alert.show", { dir: this.localize.dir() });
      await animateTo(this.base, keyframes, options);
      this.emit("sl-after-show");
    } else {
      this.emit("sl-hide");
      clearTimeout(this.autoHideTimeout);
      await stopAnimations(this.base);
      const { keyframes, options } = getAnimation(this, "alert.hide", { dir: this.localize.dir() });
      await animateTo(this.base, keyframes, options);
      this.base.hidden = true;
      this.emit("sl-after-hide");
    }
  }
  handleDurationChange() {
    this.restartAutoHide();
  }
  /** Shows the alert. */
  async show() {
    if (this.open) {
      return void 0;
    }
    this.open = true;
    return waitForEvent(this, "sl-after-show");
  }
  /** Hides the alert */
  async hide() {
    if (!this.open) {
      return void 0;
    }
    this.open = false;
    return waitForEvent(this, "sl-after-hide");
  }
  /**
   * Displays the alert as a toast notification. This will move the alert out of its position in the DOM and, when
   * dismissed, it will be removed from the DOM completely. By storing a reference to the alert, you can reuse it by
   * calling this method again. The returned promise will resolve after the alert is hidden.
   */
  async toast() {
    return new Promise((resolve) => {
      if (toastStack.parentElement === null) {
        document.body.append(toastStack);
      }
      toastStack.appendChild(this);
      requestAnimationFrame(() => {
        this.clientWidth;
        this.show();
      });
      this.addEventListener(
        "sl-after-hide",
        () => {
          toastStack.removeChild(this);
          resolve();
          if (toastStack.querySelector("sl-alert") === null) {
            toastStack.remove();
          }
        },
        { once: true }
      );
    });
  }
  render() {
    return y`
      <div
        part="base"
        class=${o({
      alert: true,
      "alert--open": this.open,
      "alert--closable": this.closable,
      "alert--has-icon": this.hasSlotController.test("icon"),
      "alert--primary": this.variant === "primary",
      "alert--success": this.variant === "success",
      "alert--neutral": this.variant === "neutral",
      "alert--warning": this.variant === "warning",
      "alert--danger": this.variant === "danger"
    })}
        role="alert"
        aria-hidden=${this.open ? "false" : "true"}
        @mousemove=${this.handleMouseMove}
      >
        <div part="icon" class="alert__icon">
          <slot name="icon"></slot>
        </div>

        <div part="message" class="alert__message" aria-live="polite">
          <slot></slot>
        </div>

        ${this.closable ? y`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                class="alert__close-button"
                name="x-lg"
                library="system"
                label=${this.localize.term("close")}
                @click=${this.handleCloseClick}
              ></sl-icon-button>
            ` : ""}
      </div>
    `;
  }
};
SlAlert.styles = alert_styles_default;
__decorateClass([
  i('[part~="base"]')
], SlAlert.prototype, "base", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlAlert.prototype, "open", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlAlert.prototype, "closable", 2);
__decorateClass([
  e2({ reflect: true })
], SlAlert.prototype, "variant", 2);
__decorateClass([
  e2({ type: Number })
], SlAlert.prototype, "duration", 2);
__decorateClass([
  watch("open", { waitUntilFirstUpdate: true })
], SlAlert.prototype, "handleOpenChange", 1);
__decorateClass([
  watch("duration")
], SlAlert.prototype, "handleDurationChange", 1);
SlAlert = __decorateClass([
  e("sl-alert")
], SlAlert);
setDefaultAnimation("alert.show", {
  keyframes: [
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 }
  ],
  options: { duration: 250, easing: "ease" }
});
setDefaultAnimation("alert.hide", {
  keyframes: [
    { opacity: 1, scale: 1 },
    { opacity: 0, scale: 0.8 }
  ],
  options: { duration: 250, easing: "ease" }
});

export {
  SlAlert
};
