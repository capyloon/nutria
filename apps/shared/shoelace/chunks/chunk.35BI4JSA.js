import {
  t
} from "./chunk.MGAW64L2.js";

// src/internal/tabbable.ts
function isTabbable(el) {
  const tag = el.tagName.toLowerCase();
  if (el.getAttribute("tabindex") === "-1") {
    return false;
  }
  if (el.hasAttribute("disabled")) {
    return false;
  }
  if (el.hasAttribute("aria-disabled") && el.getAttribute("aria-disabled") !== "false") {
    return false;
  }
  if (tag === "input" && el.getAttribute("type") === "radio" && !el.hasAttribute("checked")) {
    return false;
  }
  if (el.offsetParent === null && t(el) === null) {
    return false;
  }
  if (window.getComputedStyle(el).visibility === "hidden") {
    return false;
  }
  if ((tag === "audio" || tag === "video") && el.hasAttribute("controls")) {
    return true;
  }
  if (el.hasAttribute("tabindex")) {
    return true;
  }
  if (el.hasAttribute("contenteditable") && el.getAttribute("contenteditable") !== "false") {
    return true;
  }
  return ["button", "input", "select", "textarea", "a", "audio", "video", "summary"].includes(tag);
}
function getTabbableBoundary(root) {
  var _a, _b;
  const tabbableElements = getTabbableElements(root);
  const start = (_a = tabbableElements[0]) != null ? _a : null;
  const end = (_b = tabbableElements[tabbableElements.length - 1]) != null ? _b : null;
  return { start, end };
}
function getTabbableElements(root) {
  const allElements = [];
  function walk(el) {
    if (el instanceof Element) {
      allElements.push(el);
      if (el.shadowRoot !== null && el.shadowRoot.mode === "open") {
        walk(el.shadowRoot);
      }
    }
    [...el.children].forEach((e) => walk(e));
  }
  walk(root);
  return allElements.filter(isTabbable).sort((a, b) => {
    const aTabindex = Number(a.getAttribute("tabindex")) || 0;
    const bTabindex = Number(b.getAttribute("tabindex")) || 0;
    return bTabindex - aTabindex;
  });
}

export {
  getTabbableBoundary,
  getTabbableElements
};
