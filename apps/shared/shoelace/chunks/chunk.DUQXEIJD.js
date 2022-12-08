import{a as d,b as h,c as l}from"./chunk.NBAHMDHF.js";import{e as a}from"./chunk.I36YJ673.js";var u=h(class extends l{constructor(s){var e;if(super(s),s.type!==d.ATTRIBUTE||s.name!=="class"||((e=s.strings)===null||e===void 0?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(s){return" "+Object.keys(s).filter(e=>s[e]).join(" ")+" "}update(s,[e]){var i,n;if(this.nt===void 0){this.nt=new Set,s.strings!==void 0&&(this.st=new Set(s.strings.join(" ").split(/\s/).filter(t=>t!=="")));for(let t in e)e[t]&&!(!((i=this.st)===null||i===void 0)&&i.has(t))&&this.nt.add(t);return this.render(e)}let r=s.element.classList;this.nt.forEach(t=>{t in e||(r.remove(t),this.nt.delete(t))});for(let t in e){let o=!!e[t];o===this.nt.has(t)||((n=this.st)===null||n===void 0?void 0:n.has(t))||(o?(r.add(t),this.nt.add(t)):(r.remove(t),this.nt.delete(t)))}return a}});export{u as a};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
