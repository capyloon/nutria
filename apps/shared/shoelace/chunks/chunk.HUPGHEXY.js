import {
  e as e2,
  i,
  t
} from "./chunk.UP75L23G.js";
import {
  e,
  s
} from "./chunk.G4WFMV2P.js";
import {
  b,
  x
} from "./chunk.DUT32TWM.js";

// node_modules/lit-html/directives/live.js
var l = e2(class extends i {
  constructor(r) {
    if (super(r), r.type !== t.PROPERTY && r.type !== t.ATTRIBUTE && r.type !== t.BOOLEAN_ATTRIBUTE)
      throw Error("The `live` directive is not allowed on child or event bindings");
    if (!e(r))
      throw Error("`live` bindings can only contain a single expression");
  }
  render(r) {
    return r;
  }
  update(i2, [t2]) {
    if (t2 === x || t2 === b)
      return t2;
    const o = i2.element, l2 = i2.name;
    if (i2.type === t.PROPERTY) {
      if (t2 === o[l2])
        return x;
    } else if (i2.type === t.BOOLEAN_ATTRIBUTE) {
      if (!!t2 === o.hasAttribute(l2))
        return x;
    } else if (i2.type === t.ATTRIBUTE && o.getAttribute(l2) === t2 + "")
      return x;
    return s(i2), t2;
  }
});

export {
  l
};
/*! Bundled license information:

lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
