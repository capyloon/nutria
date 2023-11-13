import {
  e,
  i,
  t
} from "./chunk.JJNPZ52S.js";
import {
  T,
  w
} from "./chunk.27ILGUWR.js";

// node_modules/lit/node_modules/lit-html/directives/unsafe-html.js
var e2 = class extends i {
  constructor(i2) {
    if (super(i2), this.et = T, i2.type !== t.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r) {
    if (r === T || null == r)
      return this.vt = void 0, this.et = r;
    if (r === w)
      return r;
    if ("string" != typeof r)
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r === this.et)
      return this.vt;
    this.et = r;
    const s = [r];
    return s.raw = s, this.vt = { _$litType$: this.constructor.resultType, strings: s, values: [] };
  }
};
e2.directiveName = "unsafeHTML", e2.resultType = 1;
var o = e(e2);

export {
  o
};
/*! Bundled license information:

lit-html/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
