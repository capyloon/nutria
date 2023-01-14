import{a as i,b as a,c as v}from"./chunk.SMFJUIOR.js";import{e as n,f as l,g as o}from"./chunk.SYBSOZNG.js";var{I:u}=o;var A=e=>e.strings===void 0;var d={},c=(e,t=d)=>e._$AH=t;var T=a(class extends v{constructor(e){if(super(e),e.type!==i.PROPERTY&&e.type!==i.ATTRIBUTE&&e.type!==i.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!A(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===n||t===l)return t;let r=e.element,s=e.name;if(e.type===i.PROPERTY){if(t===r[s])return n}else if(e.type===i.BOOLEAN_ATTRIBUTE){if(!!t===r.hasAttribute(s))return n}else if(e.type===i.ATTRIBUTE&&r.getAttribute(s)===t+"")return n;return c(e),t}});export{T as a};
/*! Bundled license information:

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
