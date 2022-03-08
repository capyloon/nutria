import {
  getTabbableBoundary
} from "./chunk.SCUNOITN.js";

// src/internal/modal.ts
var activeModals = [];
var Modal = class {
  constructor(element) {
    this.tabDirection = "forward";
    this.element = element;
    this.handleFocusIn = this.handleFocusIn.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  activate() {
    activeModals.push(this.element);
    document.addEventListener("focusin", this.handleFocusIn);
    document.addEventListener("keydown", this.handleKeyDown);
  }
  deactivate() {
    activeModals = activeModals.filter((modal) => modal !== this.element);
    document.removeEventListener("focusin", this.handleFocusIn);
    document.removeEventListener("keydown", this.handleKeyDown);
  }
  isActive() {
    return activeModals[activeModals.length - 1] === this.element;
  }
  handleFocusIn(event) {
    const path = event.composedPath();
    if (this.isActive() && !path.includes(this.element)) {
      const { start, end } = getTabbableBoundary(this.element);
      const target = this.tabDirection === "forward" ? start : end;
      if (typeof (target == null ? void 0 : target.focus) === "function") {
        target.focus({ preventScroll: true });
      }
    }
  }
  handleKeyDown(event) {
    if (event.key === "Tab" && event.shiftKey) {
      this.tabDirection = "backward";
      setTimeout(() => this.tabDirection = "forward");
    }
  }
};

export {
  Modal
};
