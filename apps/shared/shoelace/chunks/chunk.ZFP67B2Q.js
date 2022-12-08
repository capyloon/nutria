import{a as n}from"./chunk.HZR2DWKL.js";import{a as p}from"./chunk.2KPL5E6P.js";import{c as o}from"./chunk.MJKKE2MR.js";import{a as m}from"./chunk.UBF6MLHX.js";import{a as l}from"./chunk.DUQXEIJD.js";import{a as i,b as r,f as s}from"./chunk.N2CXUFX7.js";import{c as a}from"./chunk.I36YJ673.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends s{constructor(){super(...arguments);this.localize=new o(this);this.value=0;this.indeterminate=!1;this.label=""}render(){return a`
      <div
        part="base"
        class=${l({"progress-bar":!0,"progress-bar--indeterminate":this.indeterminate,"progress-bar--rtl":this.localize.dir()==="rtl"})}
        role="progressbar"
        title=${m(this.title)}
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
