import{a as p}from"./chunk.DRKG337S.js";import{a as m}from"./chunk.2WOAAZF5.js";import{h as n}from"./chunk.RLLTRZYL.js";import{a as s}from"./chunk.PC5WGFOA.js";import{a as o}from"./chunk.2XQLLZV4.js";import{a as l,b as a}from"./chunk.GVR6SJVE.js";import{c as i,h as r}from"./chunk.7EIHAL55.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends r{constructor(){super(...arguments);this.localize=new n(this);this.value=0;this.indeterminate=!1;this.label=""}render(){return i`
      <div
        part="base"
        class=${s({"progress-bar":!0,"progress-bar--indeterminate":this.indeterminate})}
        role="progressbar"
        title=${o(this.title)}
        aria-label=${this.label.length>0?this.label:this.localize.term("progress")}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${this.indeterminate?0:this.value}
      >
        <div part="indicator" class="progress-bar__indicator" style=${m({width:`${this.value}%`})}>
          ${this.indeterminate?"":i`
                <span part="label" class="progress-bar__label">
                  <slot></slot>
                </span>
              `}
        </div>
      </div>
    `}};e.styles=p,t([a({type:Number,reflect:!0})],e.prototype,"value",2),t([a({type:Boolean,reflect:!0})],e.prototype,"indeterminate",2),t([a()],e.prototype,"label",2),t([a()],e.prototype,"lang",2),e=t([l("sl-progress-bar")],e);export{e as a};
