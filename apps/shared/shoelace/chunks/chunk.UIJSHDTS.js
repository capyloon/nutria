import{a as i,b as c,c as a}from"./chunk.NBAHMDHF.js";import{e as o}from"./chunk.3G4FHXSN.js";var u=c(class extends a{constructor(s){var t;if(super(s),s.type!==i.ATTRIBUTE||s.name!=="style"||((t=s.strings)===null||t===void 0?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(s){return Object.keys(s).reduce((t,r)=>{let e=s[r];return e==null?t:t+`${r=r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${e};`},"")}update(s,[t]){let{style:r}=s.element;if(this.ct===void 0){this.ct=new Set;for(let e in t)this.ct.add(e);return this.render(t)}this.ct.forEach(e=>{t[e]==null&&(this.ct.delete(e),e.includes("-")?r.removeProperty(e):r[e]="")});for(let e in t){let n=t[e];n!=null&&(this.ct.add(e),e.includes("-")?r.setProperty(e,n):r[e]=n)}return o}});export{u as a};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
