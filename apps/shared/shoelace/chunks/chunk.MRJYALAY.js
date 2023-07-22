import {
  getTabbableElements
} from "./chunk.35BI4JSA.js";

// src/internal/modal.ts
var activeModals = [];
var Modal = class {
  constructor(element) {
    this.tabDirection = "forward";
    this.handleFocusIn = () => {
      this.checkFocus();
    };
    this.handleKeyDown = (event) => {
      var _a;
      if (event.key !== "Tab")
        return;
      if (event.shiftKey) {
        this.tabDirection = "backward";
      } else {
        this.tabDirection = "forward";
      }
      event.preventDefault();
      const tabbableElements = getTabbableElements(this.element);
      const start = tabbableElements[0];
      let focusIndex = this.currentFocusIndex;
      if (focusIndex === -1) {
        this.currentFocus = start;
        this.currentFocus.focus({ preventScroll: true });
        return;
      }
      const addition = this.tabDirection === "forward" ? 1 : -1;
      if (focusIndex + addition >= tabbableElements.length) {
        focusIndex = 0;
      } else if (this.currentFocusIndex + addition < 0) {
        focusIndex = tabbableElements.length - 1;
      } else {
        focusIndex += addition;
      }
      this.currentFocus = tabbableElements[focusIndex];
      (_a = this.currentFocus) == null ? void 0 : _a.focus({ preventScroll: true });
      setTimeout(() => this.checkFocus());
    };
    this.handleKeyUp = () => {
      this.tabDirection = "forward";
    };
    this.element = element;
  }
  activate() {
    activeModals.push(this.element);
    document.addEventListener("focusin", this.handleFocusIn);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }
  deactivate() {
    activeModals = activeModals.filter((modal) => modal !== this.element);
    this.currentFocus = null;
    document.removeEventListener("focusin", this.handleFocusIn);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }
  isActive() {
    return activeModals[activeModals.length - 1] === this.element;
  }
  checkFocus() {
    if (this.isActive()) {
      const tabbableElements = getTabbableElements(this.element);
      if (!this.element.matches(":focus-within")) {
        const start = tabbableElements[0];
        const end = tabbableElements[tabbableElements.length - 1];
        const target = this.tabDirection === "forward" ? start : end;
        if (typeof (target == null ? void 0 : target.focus) === "function") {
          this.currentFocus = target;
          target.focus({ preventScroll: true });
        }
      }
    }
  }
  get currentFocusIndex() {
    return getTabbableElements(this.element).findIndex((el) => el === this.currentFocus);
  }
};

export {
  Modal
};
