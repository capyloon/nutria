import {
  split_panel_styles_default
} from "./chunk.J4NY3KJ4.js";
import {
  drag
} from "./chunk.RBICTPSA.js";
import {
  clamp
} from "./chunk.43G6GBOK.js";
import {
  LocalizeController
} from "./chunk.EBGTCCKY.js";
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
  n
} from "./chunk.72DLNKYZ.js";
import {
  $,
  s
} from "./chunk.PEQICPKO.js";
import {
  __decorateClass
} from "./chunk.ICGTMF5Z.js";

// src/components/split-panel/split-panel.ts
var SlSplitPanel = class extends s {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.position = 50;
    this.vertical = false;
    this.disabled = false;
    this.snapThreshold = 12;
  }
  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver((entries) => this.handleResize(entries));
    this.updateComplete.then(() => this.resizeObserver.observe(this));
    this.detectSize();
    this.cachedPositionInPixels = this.percentageToPixels(this.position);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.unobserve(this);
  }
  detectSize() {
    const { width, height } = this.getBoundingClientRect();
    this.size = this.vertical ? height : width;
  }
  percentageToPixels(value) {
    return this.size * (value / 100);
  }
  pixelsToPercentage(value) {
    return value / this.size * 100;
  }
  handleDrag(event) {
    if (this.disabled) {
      return;
    }
    event.preventDefault();
    drag(this, (x, y) => {
      let newPositionInPixels = this.vertical ? y : x;
      if (this.primary === "end") {
        newPositionInPixels = this.size - newPositionInPixels;
      }
      if (this.snap) {
        const snaps = this.snap.split(" ");
        snaps.forEach((value) => {
          let snapPoint;
          if (value.endsWith("%")) {
            snapPoint = this.size * (parseFloat(value) / 100);
          } else {
            snapPoint = parseFloat(value);
          }
          if (newPositionInPixels >= snapPoint - this.snapThreshold && newPositionInPixels <= snapPoint + this.snapThreshold) {
            newPositionInPixels = snapPoint;
          }
        });
      }
      this.position = clamp(this.pixelsToPercentage(newPositionInPixels), 0, 100);
    });
  }
  handleKeyDown(event) {
    if (this.disabled) {
      return;
    }
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      let newPosition = this.position;
      const incr = (event.shiftKey ? 10 : 1) * (this.primary === "end" ? -1 : 1);
      event.preventDefault();
      if (event.key === "ArrowLeft" && !this.vertical || event.key === "ArrowUp" && this.vertical) {
        newPosition -= incr;
      }
      if (event.key === "ArrowRight" && !this.vertical || event.key === "ArrowDown" && this.vertical) {
        newPosition += incr;
      }
      if (event.key === "Home") {
        newPosition = this.primary === "end" ? 100 : 0;
      }
      if (event.key === "End") {
        newPosition = this.primary === "end" ? 0 : 100;
      }
      this.position = clamp(newPosition, 0, 100);
    }
  }
  handlePositionChange() {
    this.cachedPositionInPixels = this.percentageToPixels(this.position);
    this.positionInPixels = this.percentageToPixels(this.position);
    emit(this, "sl-reposition");
  }
  handlePositionInPixelsChange() {
    this.position = this.pixelsToPercentage(this.positionInPixels);
  }
  handleResize(entries) {
    const { width, height } = entries[0].contentRect;
    this.size = this.vertical ? height : width;
    if (this.primary) {
      this.position = this.pixelsToPercentage(this.cachedPositionInPixels);
    }
  }
  render() {
    const gridTemplate = this.vertical ? "gridTemplateRows" : "gridTemplateColumns";
    const primary = `
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `;
    const secondary = "auto";
    if (this.primary === "end") {
      this.style[gridTemplate] = `${secondary} var(--divider-width) ${primary}`;
    } else {
      this.style[gridTemplate] = `${primary} var(--divider-width) ${secondary}`;
    }
    return $`
      <div part="panel start" class="start">
        <slot name="start"></slot>
      </div>

      <div
        part="divider"
        class="divider"
        tabindex=${l(this.disabled ? void 0 : "0")}
        role="separator"
        aria-label=${this.localize.term("resize")}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleDrag}
        @touchstart=${this.handleDrag}
      >
        <slot name="handle"></slot>
      </div>

      <div part="panel end" class="end">
        <slot name="end"></slot>
      </div>
    `;
  }
};
SlSplitPanel.styles = split_panel_styles_default;
__decorateClass([
  i(".divider")
], SlSplitPanel.prototype, "divider", 2);
__decorateClass([
  e({ type: Number, reflect: true })
], SlSplitPanel.prototype, "position", 2);
__decorateClass([
  e({ attribute: "position-in-pixels", type: Number })
], SlSplitPanel.prototype, "positionInPixels", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSplitPanel.prototype, "vertical", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSplitPanel.prototype, "disabled", 2);
__decorateClass([
  e()
], SlSplitPanel.prototype, "primary", 2);
__decorateClass([
  e()
], SlSplitPanel.prototype, "snap", 2);
__decorateClass([
  e({ type: Number, attribute: "snap-threshold" })
], SlSplitPanel.prototype, "snapThreshold", 2);
__decorateClass([
  watch("position")
], SlSplitPanel.prototype, "handlePositionChange", 1);
__decorateClass([
  watch("positionInPixels")
], SlSplitPanel.prototype, "handlePositionInPixelsChange", 1);
SlSplitPanel = __decorateClass([
  n("sl-split-panel")
], SlSplitPanel);

export {
  SlSplitPanel
};
