import {
  image_comparer_styles_default
} from "./chunk.UUKRFGGV.js";
import {
  drag
} from "./chunk.RBICTPSA.js";
import {
  clamp
} from "./chunk.43G6GBOK.js";
import {
  i as i2
} from "./chunk.DFVP743R.js";
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

// src/components/image-comparer/image-comparer.ts
var SlImageComparer = class extends s {
  constructor() {
    super(...arguments);
    this.position = 50;
  }
  handleDrag(event) {
    const { width } = this.base.getBoundingClientRect();
    event.preventDefault();
    drag(this.base, (x) => {
      this.position = parseFloat(clamp(x / width * 100, 0, 100).toFixed(2));
    });
  }
  handleKeyDown(event) {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      const incr = event.shiftKey ? 10 : 1;
      let newPosition = this.position;
      event.preventDefault();
      if (event.key === "ArrowLeft") {
        newPosition -= incr;
      }
      if (event.key === "ArrowRight") {
        newPosition += incr;
      }
      if (event.key === "Home") {
        newPosition = 0;
      }
      if (event.key === "End") {
        newPosition = 100;
      }
      newPosition = clamp(newPosition, 0, 100);
      this.position = newPosition;
    }
  }
  handlePositionChange() {
    emit(this, "sl-change");
  }
  render() {
    return $`
      <div part="base" id="image-comparer" class="image-comparer" @keydown=${this.handleKeyDown}>
        <div class="image-comparer__image">
          <div part="before" class="image-comparer__before">
            <slot name="before"></slot>
          </div>

          <div
            part="after"
            class="image-comparer__after"
            style=${i2({ clipPath: `inset(0 ${100 - this.position}% 0 0)` })}
          >
            <slot name="after"></slot>
          </div>
        </div>

        <div
          part="divider"
          class="image-comparer__divider"
          style=${i2({ left: `${this.position}%` })}
          @mousedown=${this.handleDrag}
          @touchstart=${this.handleDrag}
        >
          <div
            part="handle"
            class="image-comparer__handle"
            role="scrollbar"
            aria-valuenow=${this.position}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-controls="image-comparer"
            tabindex="0"
          >
            <slot name="handle-icon">
              <sl-icon class="image-comparer__handle-icon" name="grip-vertical" library="system"></sl-icon>
            </slot>
          </div>
        </div>
      </div>
    `;
  }
};
SlImageComparer.styles = image_comparer_styles_default;
__decorateClass([
  i(".image-comparer")
], SlImageComparer.prototype, "base", 2);
__decorateClass([
  i(".image-comparer__handle")
], SlImageComparer.prototype, "handle", 2);
__decorateClass([
  e({ type: Number, reflect: true })
], SlImageComparer.prototype, "position", 2);
__decorateClass([
  watch("position", { waitUntilFirstUpdate: true })
], SlImageComparer.prototype, "handlePositionChange", 1);
SlImageComparer = __decorateClass([
  n("sl-image-comparer")
], SlImageComparer);

export {
  SlImageComparer
};
