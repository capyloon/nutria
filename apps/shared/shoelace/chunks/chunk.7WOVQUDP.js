import {
  clamp
} from "./chunk.HF7GESMZ.js";
import {
  AutoplayController
} from "./chunk.F4VGSDIW.js";
import {
  carousel_styles_default
} from "./chunk.5NRBQ6G4.js";
import {
  ScrollController
} from "./chunk.3TH5U7GS.js";
import {
  prefersReducedMotion
} from "./chunk.OZPGMRHW.js";
import {
  LocalizeController
} from "./chunk.NH3SRVOC.js";
import {
  e
} from "./chunk.DOYC4G7X.js";
import {
  SlIcon
} from "./chunk.3KCPXO34.js";
import {
  watch
} from "./chunk.XAOA43RZ.js";
import {
  ShoelaceElement,
  e as e2,
  n,
  r
} from "./chunk.URBIOJXY.js";
import {
  x2 as x
} from "./chunk.27ILGUWR.js";
import {
  __decorateClass
} from "./chunk.YZETUBD6.js";

// src/internal/scrollend-polyfill.ts
var debounce = (fn, delay) => {
  let timerId = 0;
  return function(...args) {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      fn.call(this, ...args);
    }, delay);
  };
};
var decorate = (proto, method, decorateFn) => {
  const superFn = proto[method];
  proto[method] = function(...args) {
    superFn.call(this, ...args);
    decorateFn.call(this, superFn, ...args);
  };
};
var isSupported = "onscrollend" in window;
if (!isSupported) {
  const pointers = /* @__PURE__ */ new Set();
  const scrollHandlers = /* @__PURE__ */ new WeakMap();
  const handlePointerDown = (event) => {
    pointers.add(event.pointerId);
  };
  const handlePointerUp = (event) => {
    pointers.delete(event.pointerId);
  };
  document.addEventListener("pointerdown", handlePointerDown);
  document.addEventListener("pointerup", handlePointerUp);
  decorate(EventTarget.prototype, "addEventListener", function(addEventListener, type) {
    if (type !== "scroll")
      return;
    const handleScrollEnd = debounce(() => {
      if (!pointers.size) {
        this.dispatchEvent(new Event("scrollend"));
      } else {
        handleScrollEnd();
      }
    }, 100);
    addEventListener.call(this, "scroll", handleScrollEnd, { passive: true });
    scrollHandlers.set(this, handleScrollEnd);
  });
  decorate(EventTarget.prototype, "removeEventListener", function(removeEventListener, type) {
    if (type !== "scroll")
      return;
    const scrollHandler = scrollHandlers.get(this);
    if (scrollHandler) {
      removeEventListener.call(this, "scroll", scrollHandler, { passive: true });
    }
  });
}

// node_modules/lit/node_modules/lit-html/directives/map.js
function* o(o3, f) {
  if (void 0 !== o3) {
    let i = 0;
    for (const t of o3)
      yield f(t, i++);
  }
}

// node_modules/lit/node_modules/lit-html/directives/range.js
function* o2(o3, t, e3 = 1) {
  const i = void 0 === t ? 0 : o3;
  t != null ? t : t = o3;
  for (let o4 = i; e3 > 0 ? o4 < t : t < o4; o4 += e3)
    yield o4;
}

// src/components/carousel/carousel.component.ts
var SlCarousel = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.loop = false;
    this.navigation = false;
    this.pagination = false;
    this.autoplay = false;
    this.autoplayInterval = 3e3;
    this.slidesPerPage = 1;
    this.slidesPerMove = 1;
    this.orientation = "horizontal";
    this.mouseDragging = false;
    this.activeSlide = 0;
    this.autoplayController = new AutoplayController(this, () => this.next());
    this.scrollController = new ScrollController(this);
    // determines which slide is displayed
    // A map containing the state of all the slides
    this.intersectionObserverEntries = /* @__PURE__ */ new Map();
    this.localize = new LocalizeController(this);
    this.handleSlotChange = (mutations) => {
      const needsInitialization = mutations.some(
        (mutation) => [...mutation.addedNodes, ...mutation.removedNodes].some(
          (el) => this.isCarouselItem(el) && !el.hasAttribute("data-clone")
        )
      );
      if (needsInitialization) {
        this.initializeSlides();
      }
      this.requestUpdate();
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "region");
    this.setAttribute("aria-label", this.localize.term("carousel"));
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.intersectionObserverEntries.set(entry.target, entry);
          const slide = entry.target;
          slide.toggleAttribute("inert", !entry.isIntersecting);
          slide.classList.toggle("--in-view", entry.isIntersecting);
          slide.setAttribute("aria-hidden", entry.isIntersecting ? "false" : "true");
        });
      },
      {
        root: this,
        threshold: 0.6
      }
    );
    this.intersectionObserver = intersectionObserver;
    intersectionObserver.takeRecords().forEach((entry) => {
      this.intersectionObserverEntries.set(entry.target, entry);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.intersectionObserver.disconnect();
    this.mutationObserver.disconnect();
  }
  firstUpdated() {
    this.initializeSlides();
    this.mutationObserver = new MutationObserver(this.handleSlotChange);
    this.mutationObserver.observe(this, {
      childList: true,
      subtree: true
    });
  }
  willUpdate(changedProperties) {
    if (changedProperties.has("slidesPerMove") || changedProperties.has("slidesPerPage")) {
      this.slidesPerMove = Math.min(this.slidesPerMove, this.slidesPerPage);
    }
  }
  getPageCount() {
    const slidesCount = this.getSlides().length;
    const { slidesPerPage, slidesPerMove, loop } = this;
    const pages = loop ? slidesCount / slidesPerMove : (slidesCount - slidesPerPage) / slidesPerMove + 1;
    return Math.ceil(pages);
  }
  getCurrentPage() {
    return Math.ceil(this.activeSlide / this.slidesPerMove);
  }
  canScrollNext() {
    return this.loop || this.getCurrentPage() < this.getPageCount() - 1;
  }
  canScrollPrev() {
    return this.loop || this.getCurrentPage() > 0;
  }
  /** @internal Gets all carousel items. */
  getSlides({ excludeClones = true } = {}) {
    return [...this.children].filter(
      (el) => this.isCarouselItem(el) && (!excludeClones || !el.hasAttribute("data-clone"))
    );
  }
  handleKeyDown(event) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      const target = event.target;
      const isRtl = this.localize.dir() === "rtl";
      const isFocusInPagination = target.closest('[part~="pagination-item"]') !== null;
      const isNext = event.key === "ArrowDown" || !isRtl && event.key === "ArrowRight" || isRtl && event.key === "ArrowLeft";
      const isPrevious = event.key === "ArrowUp" || !isRtl && event.key === "ArrowLeft" || isRtl && event.key === "ArrowRight";
      event.preventDefault();
      if (isPrevious) {
        this.previous();
      }
      if (isNext) {
        this.next();
      }
      if (event.key === "Home") {
        this.goToSlide(0);
      }
      if (event.key === "End") {
        this.goToSlide(this.getSlides().length - 1);
      }
      if (isFocusInPagination) {
        this.updateComplete.then(() => {
          var _a;
          const activePaginationItem = (_a = this.shadowRoot) == null ? void 0 : _a.querySelector(
            '[part~="pagination-item--active"]'
          );
          if (activePaginationItem) {
            activePaginationItem.focus();
          }
        });
      }
    }
  }
  handleScrollEnd() {
    const slides = this.getSlides();
    const entries = [...this.intersectionObserverEntries.values()];
    const firstIntersecting = entries.find((entry) => entry.isIntersecting);
    if (this.loop && (firstIntersecting == null ? void 0 : firstIntersecting.target.hasAttribute("data-clone"))) {
      const clonePosition = Number(firstIntersecting.target.getAttribute("data-clone"));
      this.goToSlide(clonePosition, "auto");
    } else if (firstIntersecting) {
      const slideIndex = slides.indexOf(firstIntersecting.target);
      this.activeSlide = Math.ceil(slideIndex / this.slidesPerMove) * this.slidesPerMove;
    }
  }
  isCarouselItem(node) {
    return node instanceof Element && node.tagName.toLowerCase() === "sl-carousel-item";
  }
  initializeSlides() {
    const intersectionObserver = this.intersectionObserver;
    this.intersectionObserverEntries.clear();
    this.getSlides({ excludeClones: false }).forEach((slide, index) => {
      intersectionObserver.unobserve(slide);
      slide.classList.remove("--in-view");
      slide.classList.remove("--is-active");
      slide.setAttribute("aria-label", this.localize.term("slideNum", index + 1));
      if (slide.hasAttribute("data-clone")) {
        slide.remove();
      }
    });
    this.updateSlidesSnap();
    if (this.loop) {
      this.createClones();
    }
    this.getSlides({ excludeClones: false }).forEach((slide) => {
      intersectionObserver.observe(slide);
    });
    this.goToSlide(this.activeSlide, "auto");
  }
  createClones() {
    const slides = this.getSlides();
    const slidesPerPage = this.slidesPerPage;
    const lastSlides = slides.slice(-slidesPerPage);
    const firstSlides = slides.slice(0, slidesPerPage);
    lastSlides.reverse().forEach((slide, i) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute("data-clone", String(slides.length - i - 1));
      this.prepend(clone);
    });
    firstSlides.forEach((slide, i) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute("data-clone", String(i));
      this.append(clone);
    });
  }
  handelSlideChange() {
    const slides = this.getSlides();
    slides.forEach((slide, i) => {
      slide.classList.toggle("--is-active", i === this.activeSlide);
    });
    if (this.hasUpdated) {
      this.emit("sl-slide-change", {
        detail: {
          index: this.activeSlide,
          slide: slides[this.activeSlide]
        }
      });
    }
  }
  updateSlidesSnap() {
    const slides = this.getSlides();
    const slidesPerMove = this.slidesPerMove;
    slides.forEach((slide, i) => {
      const shouldSnap = (i + slidesPerMove) % slidesPerMove === 0;
      if (shouldSnap) {
        slide.style.removeProperty("scroll-snap-align");
      } else {
        slide.style.setProperty("scroll-snap-align", "none");
      }
    });
  }
  handleAutoplayChange() {
    this.autoplayController.stop();
    if (this.autoplay) {
      this.autoplayController.start(this.autoplayInterval);
    }
  }
  handleMouseDraggingChange() {
    this.scrollController.mouseDragging = this.mouseDragging;
  }
  /**
   * Move the carousel backward by `slides-per-move` slides.
   *
   * @param behavior - The behavior used for scrolling.
   */
  previous(behavior = "smooth") {
    this.goToSlide(this.activeSlide - this.slidesPerMove, behavior);
  }
  /**
   * Move the carousel forward by `slides-per-move` slides.
   *
   * @param behavior - The behavior used for scrolling.
   */
  next(behavior = "smooth") {
    this.goToSlide(this.activeSlide + this.slidesPerMove, behavior);
  }
  /**
   * Scrolls the carousel to the slide specified by `index`.
   *
   * @param index - The slide index.
   * @param behavior - The behavior used for scrolling.
   */
  goToSlide(index, behavior = "smooth") {
    const { slidesPerPage, loop, scrollContainer } = this;
    const slides = this.getSlides();
    const slidesWithClones = this.getSlides({ excludeClones: false });
    if (!slides.length) {
      return;
    }
    const newActiveSlide = loop ? (index + slides.length) % slides.length : clamp(index, 0, slides.length - 1);
    this.activeSlide = newActiveSlide;
    const nextSlideIndex = clamp(index + (loop ? slidesPerPage : 0), 0, slidesWithClones.length - 1);
    const nextSlide = slidesWithClones[nextSlideIndex];
    const scrollContainerRect = scrollContainer.getBoundingClientRect();
    const nextSlideRect = nextSlide.getBoundingClientRect();
    scrollContainer.scrollTo({
      left: nextSlideRect.left - scrollContainerRect.left + scrollContainer.scrollLeft,
      top: nextSlideRect.top - scrollContainerRect.top + scrollContainer.scrollTop,
      behavior: prefersReducedMotion() ? "auto" : behavior
    });
  }
  render() {
    const { scrollController, slidesPerMove } = this;
    const pagesCount = this.getPageCount();
    const currentPage = this.getCurrentPage();
    const prevEnabled = this.canScrollPrev();
    const nextEnabled = this.canScrollNext();
    const isLtr = this.localize.dir() === "ltr";
    return x`
      <div part="base" class="carousel">
        <div
          id="scroll-container"
          part="scroll-container"
          class="${e({
      carousel__slides: true,
      "carousel__slides--horizontal": this.orientation === "horizontal",
      "carousel__slides--vertical": this.orientation === "vertical"
    })}"
          style="--slides-per-page: ${this.slidesPerPage};"
          aria-busy="${scrollController.scrolling ? "true" : "false"}"
          aria-atomic="true"
          tabindex="0"
          @keydown=${this.handleKeyDown}
          @scrollend=${this.handleScrollEnd}
        >
          <slot></slot>
        </div>

        ${this.navigation ? x`
              <div part="navigation" class="carousel__navigation">
                <button
                  part="navigation-button navigation-button--previous"
                  class="${e({
      "carousel__navigation-button": true,
      "carousel__navigation-button--previous": true,
      "carousel__navigation-button--disabled": !prevEnabled
    })}"
                  aria-label="${this.localize.term("previousSlide")}"
                  aria-controls="scroll-container"
                  aria-disabled="${prevEnabled ? "false" : "true"}"
                  @click=${prevEnabled ? () => this.previous() : null}
                >
                  <slot name="previous-icon">
                    <sl-icon library="system" name="${isLtr ? "chevron-left" : "chevron-right"}"></sl-icon>
                  </slot>
                </button>

                <button
                  part="navigation-button navigation-button--next"
                  class=${e({
      "carousel__navigation-button": true,
      "carousel__navigation-button--next": true,
      "carousel__navigation-button--disabled": !nextEnabled
    })}
                  aria-label="${this.localize.term("nextSlide")}"
                  aria-controls="scroll-container"
                  aria-disabled="${nextEnabled ? "false" : "true"}"
                  @click=${nextEnabled ? () => this.next() : null}
                >
                  <slot name="next-icon">
                    <sl-icon library="system" name="${isLtr ? "chevron-right" : "chevron-left"}"></sl-icon>
                  </slot>
                </button>
              </div>
            ` : ""}
        ${this.pagination ? x`
              <div part="pagination" role="tablist" class="carousel__pagination" aria-controls="scroll-container">
                ${o(o2(pagesCount), (index) => {
      const isActive = index === currentPage;
      return x`
                    <button
                      part="pagination-item ${isActive ? "pagination-item--active" : ""}"
                      class="${e({
        "carousel__pagination-item": true,
        "carousel__pagination-item--active": isActive
      })}"
                      role="tab"
                      aria-selected="${isActive ? "true" : "false"}"
                      aria-label="${this.localize.term("goToSlide", index + 1, pagesCount)}"
                      tabindex=${isActive ? "0" : "-1"}
                      @click=${() => this.goToSlide(index * slidesPerMove)}
                      @keydown=${this.handleKeyDown}
                    ></button>
                  `;
    })}
              </div>
            ` : ""}
      </div>
    `;
  }
};
SlCarousel.styles = carousel_styles_default;
SlCarousel.dependencies = { "sl-icon": SlIcon };
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlCarousel.prototype, "loop", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlCarousel.prototype, "navigation", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlCarousel.prototype, "pagination", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlCarousel.prototype, "autoplay", 2);
__decorateClass([
  n({ type: Number, attribute: "autoplay-interval" })
], SlCarousel.prototype, "autoplayInterval", 2);
__decorateClass([
  n({ type: Number, attribute: "slides-per-page" })
], SlCarousel.prototype, "slidesPerPage", 2);
__decorateClass([
  n({ type: Number, attribute: "slides-per-move" })
], SlCarousel.prototype, "slidesPerMove", 2);
__decorateClass([
  n()
], SlCarousel.prototype, "orientation", 2);
__decorateClass([
  n({ type: Boolean, reflect: true, attribute: "mouse-dragging" })
], SlCarousel.prototype, "mouseDragging", 2);
__decorateClass([
  e2(".carousel__slides")
], SlCarousel.prototype, "scrollContainer", 2);
__decorateClass([
  e2(".carousel__pagination")
], SlCarousel.prototype, "paginationContainer", 2);
__decorateClass([
  r()
], SlCarousel.prototype, "activeSlide", 2);
__decorateClass([
  watch("loop", { waitUntilFirstUpdate: true }),
  watch("slidesPerPage", { waitUntilFirstUpdate: true })
], SlCarousel.prototype, "initializeSlides", 1);
__decorateClass([
  watch("activeSlide")
], SlCarousel.prototype, "handelSlideChange", 1);
__decorateClass([
  watch("slidesPerMove")
], SlCarousel.prototype, "updateSlidesSnap", 1);
__decorateClass([
  watch("autoplay")
], SlCarousel.prototype, "handleAutoplayChange", 1);
__decorateClass([
  watch("mouseDragging")
], SlCarousel.prototype, "handleMouseDraggingChange", 1);

export {
  SlCarousel
};
/*! Bundled license information:

lit-html/directives/map.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/range.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
