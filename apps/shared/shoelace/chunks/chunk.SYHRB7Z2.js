import{a as H,b as E,c as p}from"./chunk.CWV2W6QN.js";import{a as U}from"./chunk.TWZDCIM2.js";import{a as D}from"./chunk.BIKJYUU2.js";import{a as h}from"./chunk.OSEV3RCT.js";import{a as n}from"./chunk.V4OMSSO6.js";import{a as c}from"./chunk.2XQLLZV4.js";import{a as x,b as l,c as C}from"./chunk.NBAHMDHF.js";import{a as L,b as a,c as M}from"./chunk.GVR6SJVE.js";import{c as b,e as T,f as u,h as w}from"./chunk.7EIHAL55.js";import{g as r}from"./chunk.OAQCUA7X.js";var i=class extends C{constructor(e){if(super(e),this.it=u,e.type!==x.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===u||e==null)return this.ft=void 0,this.it=e;if(e===T)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this.ft;this.it=e;let t=[e];return t.raw=t,this.ft={_$litType$:this.constructor.resultType,strings:t,values:[]}}};i.directiveName="unsafeHTML",i.resultType=1;var P=l(i);var o=class extends i{};o.directiveName="unsafeSVG",o.resultType=2;var $=l(o);var g,s=class extends w{constructor(){super(...arguments);this.svg="";this.label="";this.library="default"}connectedCallback(){super.connectedCallback(),H(this)}firstUpdated(){this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),E(this)}getUrl(){let t=p(this.library);return this.name&&t?t.resolver(this.name):this.src}redraw(){this.setIcon()}async setIcon(){var y;let t=p(this.library),f=this.getUrl();if(g||(g=new DOMParser),f)try{let m=await U(f);if(f!==this.getUrl())return;if(m.ok){let d=g.parseFromString(m.svg,"text/html").body.querySelector("svg");d!==null?((y=t==null?void 0:t.mutator)==null||y.call(t,d),this.svg=d.outerHTML,n(this,"sl-load")):(this.svg="",n(this,"sl-error"))}else this.svg="",n(this,"sl-error")}catch(m){n(this,"sl-error")}else this.svg.length>0&&(this.svg="")}handleChange(){this.setIcon()}render(){let t=typeof this.label=="string"&&this.label.length>0;return b` <div
      part="base"
      class="icon"
      role=${c(t?"img":void 0)}
      aria-label=${c(t?this.label:void 0)}
      aria-hidden=${c(t?void 0:"true")}
    >
      ${$(this.svg)}
    </div>`}};s.styles=D,r([M()],s.prototype,"svg",2),r([a({reflect:!0})],s.prototype,"name",2),r([a()],s.prototype,"src",2),r([a()],s.prototype,"label",2),r([a({reflect:!0})],s.prototype,"library",2),r([h("name"),h("src"),h("library")],s.prototype,"setIcon",1),s=r([L("sl-icon")],s);export{P as a,s as b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
