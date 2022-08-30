import{a as i,b as a,c as v}from"./chunk.NBAHMDHF.js";import{e as r,f as o,g as l}from"./chunk.3G4FHXSN.js";var{H:p}=l;var d=e=>e.strings===void 0;var A={},u=(e,t=A)=>e._$AH=t;var T=a(class extends v{constructor(e){if(super(e),e.type!==i.PROPERTY&&e.type!==i.ATTRIBUTE&&e.type!==i.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!d(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===r||t===o)return t;let s=e.element,n=e.name;if(e.type===i.PROPERTY){if(t===s[n])return r}else if(e.type===i.BOOLEAN_ATTRIBUTE){if(!!t===s.hasAttribute(n))return r}else if(e.type===i.ATTRIBUTE&&s.getAttribute(n)===t+"")return r;return u(e),t}});export{T as a};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
