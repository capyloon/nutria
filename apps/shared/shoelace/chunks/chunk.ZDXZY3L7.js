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
  animated_image_styles_default
} from "./chunk.P63W3WLW.js";
import {
  y
} from "./chunk.DUT32TWM.js";
import {
  __decorateClass
} from "./chunk.LKA3TPUC.js";

// src/components/animated-image/animated-image.ts
var SlAnimatedImage = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.isLoaded = false;
  }
  handleClick() {
    this.play = !this.play;
  }
  handleLoad() {
    const canvas = document.createElement("canvas");
    const { width, height } = this.animatedImage;
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(this.animatedImage, 0, 0, width, height);
    this.frozenFrame = canvas.toDataURL("image/gif");
    if (!this.isLoaded) {
      this.emit("sl-load");
      this.isLoaded = true;
    }
  }
  handleError() {
    this.emit("sl-error");
  }
  handlePlayChange() {
    if (this.play) {
      this.animatedImage.src = "";
      this.animatedImage.src = this.src;
    }
  }
  handleSrcChange() {
    this.isLoaded = false;
  }
  render() {
    return y`
      <div class="animated-image">
        <img
          class="animated-image__animated"
          src=${this.src}
          alt=${this.alt}
          crossorigin="anonymous"
          aria-hidden=${this.play ? "false" : "true"}
          @click=${this.handleClick}
          @load=${this.handleLoad}
          @error=${this.handleError}
        />

        ${this.isLoaded ? y`
              <img
                class="animated-image__frozen"
                src=${this.frozenFrame}
                alt=${this.alt}
                aria-hidden=${this.play ? "true" : "false"}
                @click=${this.handleClick}
              />

              <div part="control-box" class="animated-image__control-box">
                <slot name="play-icon"><sl-icon name="play-fill" library="system"></sl-icon></slot>
                <slot name="pause-icon"><sl-icon name="pause-fill" library="system"></sl-icon></slot>
              </div>
            ` : ""}
      </div>
    `;
  }
};
SlAnimatedImage.styles = animated_image_styles_default;
__decorateClass([
  i(".animated-image__animated")
], SlAnimatedImage.prototype, "animatedImage", 2);
__decorateClass([
  t()
], SlAnimatedImage.prototype, "frozenFrame", 2);
__decorateClass([
  t()
], SlAnimatedImage.prototype, "isLoaded", 2);
__decorateClass([
  e2()
], SlAnimatedImage.prototype, "src", 2);
__decorateClass([
  e2()
], SlAnimatedImage.prototype, "alt", 2);
__decorateClass([
  e2({ type: Boolean, reflect: true })
], SlAnimatedImage.prototype, "play", 2);
__decorateClass([
  watch("play", { waitUntilFirstUpdate: true })
], SlAnimatedImage.prototype, "handlePlayChange", 1);
__decorateClass([
  watch("src")
], SlAnimatedImage.prototype, "handleSrcChange", 1);
SlAnimatedImage = __decorateClass([
  e("sl-animated-image")
], SlAnimatedImage);

export {
  SlAnimatedImage
};
