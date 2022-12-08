import{a as i,b as a,c as l}from"./chunk.NBAHMDHF.js";import{e as o}from"./chunk.I36YJ673.js";var c=a(class extends l{constructor(s){var t;if(super(s),s.type!==i.ATTRIBUTE||s.name!=="style"||((t=s.strings)===null||t===void 0?void 0:t.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(s){return Object.keys(s).reduce((t,r)=>{let e=s[r];return e==null?t:t+`${r=r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${e};`},"")}update(s,[t]){let{style:r}=s.element;if(this.vt===void 0){this.vt=new Set;for(let e in t)this.vt.add(e);return this.render(t)}this.vt.forEach(e=>{t[e]==null&&(this.vt.delete(e),e.includes("-")?r.removeProperty(e):r[e]="")});for(let e in t){let n=t[e];n!=null&&(this.vt.add(e),e.includes("-")?r.setProperty(e,n):r[e]=n)}return o}});export{c as a};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
