import {
  getTabbableElements
} from "./chunk.YCHBWCKL.js";
import {
  __yieldStar
} from "./chunk.YZETUBD6.js";

// src/internal/active-elements.ts
function* activeElements(activeElement = document.activeElement) {
  if (activeElement === null || activeElement === void 0)
    return;
  yield activeElement;
  if ("shadowRoot" in activeElement && activeElement.shadowRoot && activeElement.shadowRoot.mode !== "closed") {
    yield* __yieldStar(activeElements(activeElement.shadowRoot.activeElement));
  }
}
function getDeepestActiveElement() {
  return [...activeElements()].pop();
}

// src/internal/modal.ts
var activeModals = [];
var Modal = class {
  constructor(element) {
    this.tabDirection = "forward";
    this.handleFocusIn = () => {
      if (!this.isActive())
        return;
      this.checkFocus();
    };
    this.handleKeyDown = (event) => {
      var _a, _b;
      if (event.key !== "Tab" || this.isExternalActivated)
        return;
      if (!this.isActive())
        return;
      if (event.shiftKey) {
        this.tabDirection = "backward";
      } else {
        this.tabDirection = "forward";
      }
      event.preventDefault();
      const tabbableElements = getTabbableElements(this.element);
      const currentActiveElement = getDeepestActiveElement();
      let currentFocusIndex = tabbableElements.findIndex((el) => el === currentActiveElement);
      if (currentFocusIndex === -1) {
        this.currentFocus = tabbableElements[0];
        (_a = this.currentFocus) == null ? void 0 : _a.focus({ preventScroll: true });
        return;
      }
      const addition = this.tabDirection === "forward" ? 1 : -1;
      if (currentFocusIndex + addition >= tabbableElements.length) {
        currentFocusIndex = 0;
      } else if (currentFocusIndex + addition < 0) {
        currentFocusIndex = tabbableElements.length - 1;
      } else {
        currentFocusIndex += addition;
      }
      this.currentFocus = tabbableElements[currentFocusIndex];
      (_b = this.currentFocus) == null ? void 0 : _b.focus({ preventScroll: true });
      setTimeout(() => this.checkFocus());
    };
    this.handleKeyUp = () => {
      this.tabDirection = "forward";
    };
    this.element = element;
  }
  /** Activates focus trapping. */
  activate() {
    activeModals.push(this.element);
    document.addEventListener("focusin", this.handleFocusIn);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }
  /** Deactivates focus trapping. */
  deactivate() {
    activeModals = activeModals.filter((modal) => modal !== this.element);
    this.currentFocus = null;
    document.removeEventListener("focusin", this.handleFocusIn);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
  }
  /** Determines if this modal element is currently active or not. */
  isActive() {
    return activeModals[activeModals.length - 1] === this.element;
  }
  /** Activates external modal behavior and temporarily disables focus trapping. */
  activateExternal() {
    this.isExternalActivated = true;
  }
  /** Deactivates external modal behavior and re-enables focus trapping. */
  deactivateExternal() {
    this.isExternalActivated = false;
  }
  checkFocus() {
    if (this.isActive() && !this.isExternalActivated) {
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
};

export {
  Modal
};
