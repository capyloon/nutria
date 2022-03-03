import {
  details_styles_default
} from "./chunk.22FWZ2KC.js";
import {
  animateTo,
  shimKeyframesHeightAuto,
  stopAnimations
} from "./chunk.YBI4N56R.js";
import {
  getAnimation,
  setDefaultAnimation
} from "./chunk.6SAGALY4.js";
import {
  o
} from "./chunk.7BXY5XRG.js";
import {
  watch
} from "./chunk.PQ5VRVXF.js";
import {
  emit,
  waitForEvent
} from "./chunk.CDTZZV7W.js";
import {
  e,
  i,
  n
} from "./chunk.72DLNKYZ.js";
import {
  $,
  s
} from "./chunk.PEQICPKO.js";
import {
  __decorateClass
} from "./chunk.ICGTMF5Z.js";

// src/components/details/details.ts
var SlDetails = class extends s {
  constructor() {
    super(...arguments);
    this.open = false;
    this.disabled = false;
  }
  firstUpdated() {
    this.body.hidden = !this.open;
    this.body.style.height = this.open ? "auto" : "0";
  }
  async show() {
    if (this.open || this.disabled) {
      return void 0;
    }
    this.open = true;
    return waitForEvent(this, "sl-after-show");
  }
  async hide() {
    if (!this.open || this.disabled) {
      return void 0;
    }
    this.open = false;
    return waitForEvent(this, "sl-after-hide");
  }
  handleSummaryClick() {
    if (!this.disabled) {
      if (this.open) {
        this.hide();
      } else {
        this.show();
      }
      this.header.focus();
    }
  }
  handleSummaryKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (this.open) {
        this.hide();
      } else {
        this.show();
      }
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      this.hide();
    }
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      this.show();
    }
  }
  async handleOpenChange() {
    if (this.open) {
      emit(this, "sl-show");
      await stopAnimations(this.body);
      this.body.hidden = false;
      const { keyframes, options } = getAnimation(this, "details.show");
      await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
      this.body.style.height = "auto";
      emit(this, "sl-after-show");
    } else {
      emit(this, "sl-hide");
      await stopAnimations(this.body);
      const { keyframes, options } = getAnimation(this, "details.hide");
      await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
      this.body.hidden = true;
      this.body.style.height = "auto";
      emit(this, "sl-after-hide");
    }
  }
  render() {
    return $`
      <div
        part="base"
        class=${o({
      details: true,
      "details--open": this.open,
      "details--disabled": this.disabled
    })}
      >
        <header
          part="header"
          id="header"
          class="details__header"
          role="button"
          aria-expanded=${this.open ? "true" : "false"}
          aria-controls="content"
          aria-disabled=${this.disabled ? "true" : "false"}
          tabindex=${this.disabled ? "-1" : "0"}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <div part="summary" class="details__summary">
            <slot name="summary">${this.summary}</slot>
          </div>

          <span part="summary-icon" class="details__summary-icon">
            <sl-icon name="chevron-right" library="system"></sl-icon>
          </span>
        </header>

        <div class="details__body">
          <div part="content" id="content" class="details__content" role="region" aria-labelledby="header">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
};
SlDetails.styles = details_styles_default;
__decorateClass([
  i(".details")
], SlDetails.prototype, "details", 2);
__decorateClass([
  i(".details__header")
], SlDetails.prototype, "header", 2);
__decorateClass([
  i(".details__body")
], SlDetails.prototype, "body", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlDetails.prototype, "open", 2);
__decorateClass([
  e()
], SlDetails.prototype, "summary", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlDetails.prototype, "disabled", 2);
__decorateClass([
  watch("open", { waitUntilFirstUpdate: true })
], SlDetails.prototype, "handleOpenChange", 1);
SlDetails = __decorateClass([
  n("sl-details")
], SlDetails);
setDefaultAnimation("details.show", {
  keyframes: [
    { height: "0", opacity: "0" },
    { height: "auto", opacity: "1" }
  ],
  options: { duration: 250, easing: "linear" }
});
setDefaultAnimation("details.hide", {
  keyframes: [
    { height: "auto", opacity: "1" },
    { height: "0", opacity: "0" }
  ],
  options: { duration: 250, easing: "linear" }
});

export {
  SlDetails
};
