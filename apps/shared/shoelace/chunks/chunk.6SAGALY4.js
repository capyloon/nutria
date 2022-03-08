import {
  __spreadProps,
  __spreadValues
} from "./chunk.ICGTMF5Z.js";

// src/utilities/animation-registry.ts
var defaultAnimationRegistry = /* @__PURE__ */ new Map();
var customAnimationRegistry = /* @__PURE__ */ new WeakMap();
function ensureAnimation(animation) {
  return animation != null ? animation : { keyframes: [], options: { duration: 0 } };
}
function setDefaultAnimation(animationName, animation) {
  defaultAnimationRegistry.set(animationName, ensureAnimation(animation));
}
function setAnimation(el, animationName, animation) {
  customAnimationRegistry.set(el, __spreadProps(__spreadValues({}, customAnimationRegistry.get(el)), { [animationName]: ensureAnimation(animation) }));
}
function getAnimation(el, animationName) {
  const customAnimation = customAnimationRegistry.get(el);
  if (customAnimation == null ? void 0 : customAnimation[animationName]) {
    return customAnimation[animationName];
  }
  const defaultAnimation = defaultAnimationRegistry.get(animationName);
  if (defaultAnimation) {
    return defaultAnimation;
  }
  return {
    keyframes: [],
    options: { duration: 0 }
  };
}

export {
  setDefaultAnimation,
  setAnimation,
  getAnimation
};
