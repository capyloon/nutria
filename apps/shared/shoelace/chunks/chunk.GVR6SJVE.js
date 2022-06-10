import{a as d,b as a}from"./chunk.OAQCUA7X.js";var y=t=>e=>typeof e=="function"?((r,i)=>(window.customElements.define(r,i),i))(t,e):((r,i)=>{let{kind:n,elements:o}=i;return{kind:n,elements:o,finisher(s){window.customElements.define(r,s)}}})(t,e);var m=(t,e)=>e.kind==="method"&&e.descriptor&&!("value"in e.descriptor)?a(d({},e),{finisher(r){r.createProperty(e.key,t)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){typeof e.initializer=="function"&&(this[e.key]=e.initializer.call(this))},finisher(r){r.createProperty(e.key,t)}};function c(t){return(e,r)=>r!==void 0?((i,n,o)=>{n.constructor.createProperty(o,i)})(t,e,r):m(t,e)}function g(t){return c(a(d({},t),{state:!0}))}var l=({finisher:t,descriptor:e})=>(r,i)=>{var n;if(i===void 0){let o=(n=r.originalKey)!==null&&n!==void 0?n:r.key,s=e!=null?{kind:"method",placement:"prototype",key:o,descriptor:e(r.key)}:a(d({},r),{key:o});return t!=null&&(s.finisher=function(p){t(p,o)}),s}{let o=r.constructor;e!==void 0&&Object.defineProperty(r,i,e(i)),t==null||t(o,i)}};function P(t,e){return l({descriptor:r=>{let i={get(){var n,o;return(o=(n=this.renderRoot)===null||n===void 0?void 0:n.querySelector(t))!==null&&o!==void 0?o:null},enumerable:!0,configurable:!0};if(e){let n=typeof r=="symbol"?Symbol():"__"+r;i.get=function(){var o,s;return this[n]===void 0&&(this[n]=(s=(o=this.renderRoot)===null||o===void 0?void 0:o.querySelector(t))!==null&&s!==void 0?s:null),this[n]}}return i}})}function S(t){return l({descriptor:e=>({async get(){var r;return await this.updateComplete,(r=this.renderRoot)===null||r===void 0?void 0:r.querySelector(t)},enumerable:!0,configurable:!0})})}var u,M=((u=window.HTMLSlotElement)===null||u===void 0?void 0:u.prototype.assignedElements)!=null?(t,e)=>t.assignedElements(e):(t,e)=>t.assignedNodes(e).filter(r=>r.nodeType===Node.ELEMENT_NODE);export{y as a,c as b,g as c,P as d,S as e};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
