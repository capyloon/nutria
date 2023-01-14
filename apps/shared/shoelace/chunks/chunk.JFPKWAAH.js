import{h as f}from"./chunk.SYBSOZNG.js";import{a as l,b as u,e as p}from"./chunk.I4CX4JT3.js";var g=r=>e=>typeof e=="function"?((t,i)=>(customElements.define(t,i),i))(r,e):((t,i)=>{let{kind:o,elements:n}=i;return{kind:o,elements:n,finisher(s){customElements.define(t,s)}}})(r,e);var v=(r,e)=>e.kind==="method"&&e.descriptor&&!("value"in e.descriptor)?u(l({},e),{finisher(t){t.createProperty(e.key,r)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){typeof e.initializer=="function"&&(this[e.key]=e.initializer.call(this))},finisher(t){t.createProperty(e.key,r)}};function d(r){return(e,t)=>t!==void 0?((i,o,n)=>{o.constructor.createProperty(n,i)})(r,e,t):v(r,e)}function E(r){return d(u(l({},r),{state:!0}))}var a=({finisher:r,descriptor:e})=>(t,i)=>{var o;if(i===void 0){let n=(o=t.originalKey)!==null&&o!==void 0?o:t.key,s=e!=null?{kind:"method",placement:"prototype",key:n,descriptor:e(t.key)}:u(l({},t),{key:n});return r!=null&&(s.finisher=function(y){r(y,n)}),s}{let n=t.constructor;e!==void 0&&Object.defineProperty(t,i,e(i)),r==null||r(n,i)}};function C(r,e){return a({descriptor:t=>{let i={get(){var o,n;return(n=(o=this.renderRoot)===null||o===void 0?void 0:o.querySelector(r))!==null&&n!==void 0?n:null},enumerable:!0,configurable:!0};if(e){let o=typeof t=="symbol"?Symbol():"__"+t;i.get=function(){var n,s;return this[o]===void 0&&(this[o]=(s=(n=this.renderRoot)===null||n===void 0?void 0:n.querySelector(r))!==null&&s!==void 0?s:null),this[o]}}return i}})}function O(r){return a({descriptor:e=>({async get(){var t;return await this.updateComplete,(t=this.renderRoot)===null||t===void 0?void 0:t.querySelector(r)},enumerable:!0,configurable:!0})})}var m,T=((m=window.HTMLSlotElement)===null||m===void 0?void 0:m.prototype.assignedElements)!=null?(r,e)=>r.assignedElements(e):(r,e)=>r.assignedNodes(e).filter(t=>t.nodeType===Node.ELEMENT_NODE);var c=class extends f{emit(t,i){let o=new CustomEvent(t,l({bubbles:!0,cancelable:!1,composed:!0,detail:{}},i));return this.dispatchEvent(o),o}};p([d()],c.prototype,"dir",2),p([d()],c.prototype,"lang",2);export{g as a,d as b,E as c,C as d,O as e,c as f};
/*! Bundled license information:

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
