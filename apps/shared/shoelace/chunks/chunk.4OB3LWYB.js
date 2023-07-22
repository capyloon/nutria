import {
  requestInclude
} from "./chunk.XNEONNEJ.js";
import {
  include_styles_default
} from "./chunk.AG3WFFW2.js";
import {
  watch
} from "./chunk.VQ3XOPCT.js";
import {
  ShoelaceElement,
  e,
  e2
} from "./chunk.ROLL4627.js";
import {
  y
} from "./chunk.DUT32TWM.js";
import {
  __decorateClass
} from "./chunk.LKA3TPUC.js";

// src/components/include/include.ts
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
    } catch (e3) {
      this.emit("sl-error", { detail: { status: -1 } });
    }
  }
  render() {
    return y`<slot></slot>`;
  }
};
SlInclude.styles = include_styles_default;
__decorateClass([
  e2()
], SlInclude.prototype, "src", 2);
__decorateClass([
  e2()
], SlInclude.prototype, "mode", 2);
__decorateClass([
  e2({ attribute: "allow-scripts", type: Boolean })
], SlInclude.prototype, "allowScripts", 2);
__decorateClass([
  watch("src")
], SlInclude.prototype, "handleSrcChange", 1);
SlInclude = __decorateClass([
  e("sl-include")
], SlInclude);

export {
  SlInclude
};
