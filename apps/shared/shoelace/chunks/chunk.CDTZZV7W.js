import {
  __spreadValues
} from "./chunk.ICGTMF5Z.js";

// src/internal/event.ts
function emit(el, name, options) {
  const event = new CustomEvent(name, __spreadValues({
    bubbles: true,
    cancelable: false,
    composed: true,
    detail: {}
  }, options));
  el.dispatchEvent(event);
  return event;
}
function waitForEvent(el, eventName) {
  return new Promise((resolve) => {
    function done(event) {
      if (event.target === el) {
        el.removeEventListener(eventName, done);
        resolve();
      }
    }
    el.addEventListener(eventName, done);
  });
}

export {
  emit,
  waitForEvent
};
