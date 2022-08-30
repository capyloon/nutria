import{a as H,b as E,c as p}from"./chunk.LXHCGYCU.js";import{a as U}from"./chunk.TWZDCIM2.js";import{a as D}from"./chunk.EX5JEGY7.js";import{a as h}from"./chunk.AFO4PD3A.js";import{a as L,b as l,c as M}from"./chunk.NBAHMDHF.js";import{a as c}from"./chunk.DBCWAMJH.js";import{a}from"./chunk.JUX3LFDW.js";import{a as w,b as o,c as C,f as x}from"./chunk.X7Q42RGY.js";import{c as b,e as T,f as d}from"./chunk.3G4FHXSN.js";import{g as s}from"./chunk.OAQCUA7X.js";var i=class extends M{constructor(e){if(super(e),this.it=d,e.type!==L.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===d||e==null)return this.ft=void 0,this.it=e;if(e===T)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this.ft;this.it=e;let t=[e];return t.raw=t,this.ft={_$litType$:this.constructor.resultType,strings:t,values:[]}}};i.directiveName="unsafeHTML",i.resultType=1;var P=l(i);var n=class extends i{};n.directiveName="unsafeSVG",n.resultType=2;var $=l(n);var g,r=class extends x{constructor(){super(...arguments);this.svg="";this.label="";this.library="default"}connectedCallback(){super.connectedCallback(),H(this)}firstUpdated(){this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),E(this)}getUrl(){let t=p(this.library);return this.name&&t?t.resolver(this.name):this.src}redraw(){this.setIcon()}async setIcon(){var y;let t=p(this.library),f=this.getUrl();if(g||(g=new DOMParser),f)try{let m=await U(f);if(f!==this.getUrl())return;if(m.ok){let u=g.parseFromString(m.svg,"text/html").body.querySelector("svg");u!==null?((y=t==null?void 0:t.mutator)==null||y.call(t,u),this.svg=u.outerHTML,a(this,"sl-load")):(this.svg="",a(this,"sl-error"))}else this.svg="",a(this,"sl-error")}catch(m){a(this,"sl-error")}else this.svg.length>0&&(this.svg="")}handleChange(){this.setIcon()}render(){let t=typeof this.label=="string"&&this.label.length>0;return b` <div
      part="base"
      class="icon"
      role=${h(t?"img":void 0)}
      aria-label=${h(t?this.label:void 0)}
      aria-hidden=${h(t?void 0:"true")}
    >
      ${$(this.svg)}
    </div>`}};r.styles=D,s([C()],r.prototype,"svg",2),s([o({reflect:!0})],r.prototype,"name",2),s([o()],r.prototype,"src",2),s([o()],r.prototype,"label",2),s([o({reflect:!0})],r.prototype,"library",2),s([c("name"),c("src"),c("library")],r.prototype,"setIcon",1),r=s([w("sl-icon")],r);export{P as a,r as b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
