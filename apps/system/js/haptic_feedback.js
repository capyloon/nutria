"use strict";

export class HapticFeedback {
  register(element) {
    element.addEventListener("pointerdown", this);
  }

  unregister(element) {
    element.removeEventListener("pointerdown", this);
  }

  handleEvent(_event) {
    navigator.vibrate(30);
  }
}
