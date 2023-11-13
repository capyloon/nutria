import {
  b,
  x
} from "./chunk.27ILGUWR.js";

// node_modules/lit/node_modules/lit-html/static.js
var e = Symbol.for("");
var o = (t) => {
  if ((t == null ? void 0 : t.r) === e)
    return t == null ? void 0 : t._$litStatic$;
};
var s = (t, ...r) => ({ _$litStatic$: r.reduce((r2, e2, o2) => r2 + ((t2) => {
  if (void 0 !== t2._$litStatic$)
    return t2._$litStatic$;
  throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t2}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
})(e2) + t[o2 + 1], t[0]), r: e });
var a = /* @__PURE__ */ new Map();
var l = (t) => (r, ...e2) => {
  const i = e2.length;
  let s2, l2;
  const n2 = [], u2 = [];
  let c, $ = 0, f = false;
  for (; $ < i; ) {
    for (c = r[$]; $ < i && void 0 !== (l2 = e2[$], s2 = o(l2)); )
      c += s2 + r[++$], f = true;
    $ !== i && u2.push(l2), n2.push(c), $++;
  }
  if ($ === i && n2.push(r[i]), f) {
    const t2 = n2.join("$$lit$$");
    void 0 === (r = a.get(t2)) && (n2.raw = n2, a.set(t2, r = n2)), e2 = u2;
  }
  return t(r, ...e2);
};
var n = l(x);
var u = l(b);

export {
  s,
  n
};
/*! Bundled license information:

lit-html/static.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
