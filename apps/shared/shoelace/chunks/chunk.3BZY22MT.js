import {
  o
} from "./chunk.PEQICPKO.js";

// src/internal/focus-visible.ts
var hasFocusVisible = (() => {
  return true;
})();
var focusVisibleSelector = o(hasFocusVisible ? ":focus-visible" : ":focus");

export {
  hasFocusVisible,
  focusVisibleSelector
};
