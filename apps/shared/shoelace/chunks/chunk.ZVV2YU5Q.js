import{a as n}from"./chunk.KVOTI4VH.js";import{a as p}from"./chunk.N7OOUXHR.js";import{b as m}from"./chunk.7DJRGBBM.js";import{a as o}from"./chunk.NUWDNXKI.js";import{a as s}from"./chunk.RUACWBWF.js";import{a as i,b as r,g as l}from"./chunk.IKUI3UUK.js";import{c as a}from"./chunk.SYBSOZNG.js";import{e as t}from"./chunk.I4CX4JT3.js";var e=class extends l{constructor(){super(...arguments);this.localize=new m(this);this.value=0;this.indeterminate=!1;this.label=""}render(){return a`
      <div
        part="base"
        class=${s({"progress-bar":!0,"progress-bar--indeterminate":this.indeterminate,"progress-bar--rtl":this.localize.dir()==="rtl"})}
        role="progressbar"
        title=${o(this.title)}
        aria-label=${this.label.length>0?this.label:this.localize.term("progress")}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${this.indeterminate?0:this.value}
      >
        <div part="indicator" class="progress-bar__indicator" style=${p({width:`${this.value}%`})}>
          ${this.indeterminate?"":a` <slot part="label" class="progress-bar__label"></slot> `}
        </div>
      </div>
    `}};e.styles=n,t([r({type:Number,reflect:!0})],e.prototype,"value",2),t([r({type:Boolean,reflect:!0})],e.prototype,"indeterminate",2),t([r()],e.prototype,"label",2),e=t([i("sl-progress-bar")],e);export{e as a};
