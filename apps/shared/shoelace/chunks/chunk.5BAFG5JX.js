import{a as H,b as D,c as p}from"./chunk.WETMJK3W.js";import{a as E}from"./chunk.TWZDCIM2.js";import{a as C}from"./chunk.BIKJYUU2.js";import{a as l}from"./chunk.2XQLLZV4.js";import{a as x,b as c,c as M}from"./chunk.NBAHMDHF.js";import{a as h}from"./chunk.OSEV3RCT.js";import{a as n}from"./chunk.V4OMSSO6.js";import{a as w,b as a,c as L}from"./chunk.GVR6SJVE.js";import{c as y,e as b,f as u,h as T}from"./chunk.7EIHAL55.js";import{g as r}from"./chunk.OAQCUA7X.js";var i=class extends M{constructor(e){if(super(e),this.it=u,e.type!==x.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===u||e==null)return this.ft=void 0,this.it=e;if(e===b)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this.ft;this.it=e;let t=[e];return t.raw=t,this.ft={_$litType$:this.constructor.resultType,strings:t,values:[]}}};i.directiveName="unsafeHTML",i.resultType=1;var V=c(i);var o=class extends i{};o.directiveName="unsafeSVG",o.resultType=2;var U=c(o);var $=new DOMParser,s=class extends T{constructor(){super(...arguments);this.svg="";this.label="";this.library="default"}connectedCallback(){super.connectedCallback(),H(this)}firstUpdated(){this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),D(this)}getUrl(){let t=p(this.library);return this.name&&t?t.resolver(this.name):this.src}redraw(){this.setIcon()}async setIcon(){var v;let t=p(this.library),f=this.getUrl();if(f)try{let m=await E(f);if(f!==this.getUrl())return;if(m.ok){let d=$.parseFromString(m.svg,"text/html").body.querySelector("svg");d!==null?((v=t==null?void 0:t.mutator)==null||v.call(t,d),this.svg=d.outerHTML,n(this,"sl-load")):(this.svg="",n(this,"sl-error"))}else this.svg="",n(this,"sl-error")}catch(m){n(this,"sl-error")}else this.svg.length>0&&(this.svg="")}handleChange(){this.setIcon()}render(){let t=typeof this.label=="string"&&this.label.length>0;return y` <div
      part="base"
      class="icon"
      role=${l(t?"img":void 0)}
      aria-label=${l(t?this.label:void 0)}
      aria-hidden=${l(t?void 0:"true")}
    >
      ${U(this.svg)}
    </div>`}};s.styles=C,r([L()],s.prototype,"svg",2),r([a({reflect:!0})],s.prototype,"name",2),r([a()],s.prototype,"src",2),r([a()],s.prototype,"label",2),r([a({reflect:!0})],s.prototype,"library",2),r([h("name"),h("src"),h("library")],s.prototype,"setIcon",1),s=r([w("sl-icon")],s);export{V as a,s as b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
