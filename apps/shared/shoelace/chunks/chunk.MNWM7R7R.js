import {
  include_styles_default
} from "./chunk.TSIZV5MY.js";
import {
  requestInclude
} from "./chunk.XNEONNEJ.js";
import {
  watch
} from "./chunk.XAOA43RZ.js";
import {
  ShoelaceElement,
  n
} from "./chunk.URBIOJXY.js";
import {
  x2 as x
} from "./chunk.27ILGUWR.js";
import {
  __decorateClass
} from "./chunk.YZETUBD6.js";

// src/components/include/include.component.ts
var SlInclude = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.mode = "cors";
    this.allowScripts = false;
  }
  executeScript(script) {
    const newScript = document.createElement("script");
    [...script.attributes].forEach((attr) => newScript.setAttribute(attr.name, attr.value));
    newScript.textContent = script.textContent;
    script.parentNode.replaceChild(newScript, script);
  }
  async handleSrcChange() {
    try {
      const src = this.src;
      const file = await requestInclude(src, this.mode);
      if (src !== this.src) {
        return;
      }
      if (!file.ok) {
        this.emit("sl-error", { detail: { status: file.status } });
        return;
      }
      this.innerHTML = file.html;
      if (this.allowScripts) {
        [...this.querySelectorAll("script")].forEach((script) => this.executeScript(script));
      }
      this.emit("sl-load");
    } catch (e) {
      this.emit("sl-error", { detail: { status: -1 } });
    }
  }
  render() {
    return x`<slot></slot>`;
  }
};
SlInclude.styles = include_styles_default;
__decorateClass([
  n()
], SlInclude.prototype, "src", 2);
__decorateClass([
  n()
], SlInclude.prototype, "mode", 2);
__decorateClass([
  n({ attribute: "allow-scripts", type: Boolean })
], SlInclude.prototype, "allowScripts", 2);
__decorateClass([
  watch("src")
], SlInclude.prototype, "handleSrcChange", 1);

export {
  SlInclude
};
