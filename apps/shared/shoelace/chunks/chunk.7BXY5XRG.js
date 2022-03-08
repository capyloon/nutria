import {
  e,
  i,
  t
} from "./chunk.2JQPDYNA.js";
import {
  b
} from "./chunk.PEQICPKO.js";

// node_modules/lit-html/directives/class-map.js
var o = e(class extends i {
  constructor(t2) {
    var i2;
    if (super(t2), t2.type !== t.ATTRIBUTE || t2.name !== "class" || ((i2 = t2.strings) === null || i2 === void 0 ? void 0 : i2.length) > 2)
      throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t2) {
    return " " + Object.keys(t2).filter((i2) => t2[i2]).join(" ") + " ";
  }
  update(i2, [s]) {
    var r, o2;
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), i2.strings !== void 0 && (this.et = new Set(i2.strings.join(" ").split(/\s/).filter((t2) => t2 !== "")));
      for (const t2 in s)
        s[t2] && !((r = this.et) === null || r === void 0 ? void 0 : r.has(t2)) && this.st.add(t2);
      return this.render(s);
    }
    const e2 = i2.element.classList;
    this.st.forEach((t2) => {
      t2 in s || (e2.remove(t2), this.st.delete(t2));
    });
    for (const t2 in s) {
      const i3 = !!s[t2];
      i3 === this.st.has(t2) || ((o2 = this.et) === null || o2 === void 0 ? void 0 : o2.has(t2)) || (i3 ? (e2.add(t2), this.st.add(t2)) : (e2.remove(t2), this.st.delete(t2)));
    }
    return b;
  }
});

export {
  o
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
