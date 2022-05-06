import {
  $,
  y
} from "./chunk.PEQICPKO.js";

// node_modules/lit-html/static.js
var r = (t, ...e) => ({ _$litStatic$: e.reduce((e2, o, r2) => e2 + ((t2) => {
  if (t2._$litStatic$ !== void 0)
    return t2._$litStatic$;
  throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t2}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
})(o) + t[r2 + 1], t[0]) });
var i = /* @__PURE__ */ new Map();
var a = (t) => (e, ...o) => {
  var r2;
  const a2 = o.length;
  let l2, s2;
  const n = [], u = [];
  let c, $2 = 0, v = false;
  for (; $2 < a2; ) {
    for (c = e[$2]; $2 < a2 && (s2 = o[$2], l2 = (r2 = s2) === null || r2 === void 0 ? void 0 : r2._$litStatic$) !== void 0; )
      c += l2 + e[++$2], v = true;
    u.push(s2), n.push(c), $2++;
  }
  if ($2 === a2 && n.push(e[a2]), v) {
    const t2 = n.join("$$lit$$");
    (e = i.get(t2)) === void 0 && (n.raw = n, i.set(t2, e = n)), o = u;
  }
  return t(e, ...o);
};
var l = a($);
var s = a(y);

export {
  r,
  l
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
