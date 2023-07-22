import {
  getBasePath
} from "./chunks/chunk.3Y6SB6QS.js";
import "./chunks/chunk.LKA3TPUC.js";

// src/shoelace-autoloader.ts
var observer = new MutationObserver((mutations) => {
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        discover(node);
      }
    }
  }
});
async function discover(root) {
  const rootTagName = root instanceof Element ? root.tagName.toLowerCase() : "";
  const rootIsCustomElement = rootTagName == null ? void 0 : rootTagName.includes("-");
  const tags = [...root.querySelectorAll(":not(:defined)")].map((el) => el.tagName.toLowerCase()).filter((tag) => tag.startsWith("sl-"));
  if (rootIsCustomElement && !customElements.get(rootTagName)) {
    tags.push(rootTagName);
  }
  const tagsToRegister = [...new Set(tags)];
  await Promise.allSettled(tagsToRegister.map((tagName) => register(tagName)));
}
function register(tagName) {
  const tagWithoutPrefix = tagName.replace(/^sl-/i, "");
  const path = getBasePath(`components/${tagWithoutPrefix}/${tagWithoutPrefix}.js`);
  if (customElements.get(tagName)) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    import(path).then(() => resolve()).catch(() => reject(new Error(`Unable to autoload <${tagName}> from ${path}`)));
  });
}
discover(document.body);
observer.observe(document.documentElement, { subtree: true, childList: true });
export {
  discover
};
