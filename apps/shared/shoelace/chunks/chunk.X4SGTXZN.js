import {
  resize_observer_styles_default
} from "./chunk.FHB26C7K.js";
import {
  watch
} from "./chunk.VQ3XOPCT.js";
import {
  ShoelaceElement,
  e,
  e2
} from "./chunk.ROLL4627.js";
import {
  y
} from "./chunk.DUT32TWM.js";
import {
  __decorateClass
} from "./chunk.LKA3TPUC.js";

// src/components/resize-observer/resize-observer.ts
var SlResizeObserver = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.observedElements = [];
    this.disabled = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver((entries) => {
      this.emit("sl-resize", { detail: { entries } });
    });
    if (!this.disabled) {
      this.startObserver();
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopObserver();
  }
  handleSlotChange() {
    if (!this.disabled) {
      this.startObserver();
    }
  }
  startObserver() {
    const slot = this.shadowRoot.querySelector("slot");
    if (slot !== null) {
      const elements = slot.assignedElements({ flatten: true });
      this.observedElements.forEach((el) => this.resizeObserver.unobserve(el));
      this.observedElements = [];
      elements.forEach((el) => {
        this.resizeObserver.observe(el);
        this.observedElements.push(el);
      });
    }
  }
  stopObserver() {
    this.resizeObserver.disconnect();
  }
  handleDisabledChange() {
    if (this.disabled) {
      this.stopObserver();
    } else {
      this.startObserver();
    }
  }
  render() {
    return y` <slot @slotchange=${this.handleSlotChange}></slot> `;
  }
};
SlResizeObserver.styles = resize_observer_styles_default;
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlResizeObserver.prototype, "disabled", 2);
__decorateClass([
  watch("disabled", { waitUntilFirstUpdate: true })
], SlResizeObserver.prototype, "handleDisabledChange", 1);
SlResizeObserver = __decorateClass([
  e("sl-resize-observer")
], SlResizeObserver);

export {
  SlResizeObserver
};
