import{h as m}from"./chunk.SYBSOZNG.js";import{a,b as d,e as v}from"./chunk.I4CX4JT3.js";var f=n=>e=>typeof e=="function"?((t,l)=>(customElements.define(t,l),l))(n,e):((t,l)=>{let{kind:r,elements:o}=l;return{kind:r,elements:o,finisher(i){customElements.define(t,i)}}})(n,e);var c=(n,e)=>e.kind==="method"&&e.descriptor&&!("value"in e.descriptor)?d(a({},e),{finisher(t){t.createProperty(e.key,n)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){typeof e.initializer=="function"&&(this[e.key]=e.initializer.call(this))},finisher(t){t.createProperty(e.key,n)}};function p(n){return(e,t)=>t!==void 0?((l,r,o)=>{r.constructor.createProperty(o,l)})(n,e,t):c(n,e)}function h(n){return p(d(a({},n),{state:!0}))}var s=({finisher:n,descriptor:e})=>(t,l)=>{var r;if(l===void 0){let o=(r=t.originalKey)!==null&&r!==void 0?r:t.key,i=e!=null?{kind:"method",placement:"prototype",key:o,descriptor:e(t.key)}:d(a({},t),{key:o});return n!=null&&(i.finisher=function(E){n(E,o)}),i}{let o=t.constructor;e!==void 0&&Object.defineProperty(t,l,e(l)),n==null||n(o,l)}};function H(n,e){return s({descriptor:t=>{let l={get(){var r,o;return(o=(r=this.renderRoot)===null||r===void 0?void 0:r.querySelector(n))!==null&&o!==void 0?o:null},enumerable:!0,configurable:!0};if(e){let r=typeof t=="symbol"?Symbol():"__"+t;l.get=function(){var o,i;return this[r]===void 0&&(this[r]=(i=(o=this.renderRoot)===null||o===void 0?void 0:o.querySelector(n))!==null&&i!==void 0?i:null),this[r]}}return l}})}function D(n){return s({descriptor:e=>({async get(){var t;return await this.updateComplete,(t=this.renderRoot)===null||t===void 0?void 0:t.querySelector(n)},enumerable:!0,configurable:!0})})}var y,V=((y=window.HTMLSlotElement)===null||y===void 0?void 0:y.prototype.assignedElements)!=null?(n,e)=>n.assignedElements(e):(n,e)=>n.assignedNodes(e).filter(t=>t.nodeType===Node.ELEMENT_NODE);var u=class extends m{emit(t,l){let r=new CustomEvent(t,a({bubbles:!0,cancelable:!1,composed:!0,detail:{}},l));return this.dispatchEvent(r),r}};v([p()],u.prototype,"dir",2),v([p()],u.prototype,"lang",2);export{f as a,p as b,h as c,H as d,D as e,u as f};
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
