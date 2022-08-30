import{a as n}from"./chunk.7PG6YMJD.js";import{a as m}from"./chunk.UIJSHDTS.js";import{c as o}from"./chunk.ISLNSUAB.js";import{a as p}from"./chunk.AFO4PD3A.js";import{a as l}from"./chunk.LSNASYMO.js";import{a as i,b as r,f as s}from"./chunk.X7Q42RGY.js";import{c as a}from"./chunk.3G4FHXSN.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends s{constructor(){super(...arguments);this.localize=new o(this);this.value=0;this.indeterminate=!1;this.label=""}render(){return a`
      <div
        part="base"
        class=${l({"progress-bar":!0,"progress-bar--indeterminate":this.indeterminate})}
        role="progressbar"
        title=${p(this.title)}
        aria-label=${this.label.length>0?this.label:this.localize.term("progress")}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${this.indeterminate?0:this.value}
      >
        <div part="indicator" class="progress-bar__indicator" style=${m({width:`${this.value}%`})}>
          ${this.indeterminate?"":a`
                <span part="label" class="progress-bar__label">
                  <slot></slot>
                </span>
              `}
        </div>
      </div>
    `}};e.styles=n,t([r({type:Number,reflect:!0})],e.prototype,"value",2),t([r({type:Boolean,reflect:!0})],e.prototype,"indeterminate",2),t([r()],e.prototype,"label",2),e=t([i("sl-progress-bar")],e);export{e as a};
