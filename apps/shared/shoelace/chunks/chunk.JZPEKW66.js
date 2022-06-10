import{a as m}from"./chunk.G7EEJIJK.js";import{h as p}from"./chunk.RLLTRZYL.js";import{a as o,b as r,c,d as n}from"./chunk.GVR6SJVE.js";import{c as i,h as l}from"./chunk.7EIHAL55.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends l{constructor(){super(...arguments);this.localize=new p(this);this.value=0;this.label=""}updated(a){if(super.updated(a),a.has("percentage")){let u=parseFloat(getComputedStyle(this.indicator).getPropertyValue("r")),s=2*Math.PI*u,d=s-this.value/100*s;this.indicatorOffset=`${d}px`}}render(){return i`
      <div
        part="base"
        class="progress-ring"
        role="progressbar"
        aria-label=${this.label.length>0?this.label:this.localize.term("progress")}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${this.value}"
        style="--percentage: ${this.value/100}"
      >
        <svg class="progress-ring__image">
          <circle class="progress-ring__track"></circle>
          <circle class="progress-ring__indicator" style="stroke-dashoffset: ${this.indicatorOffset}"></circle>
        </svg>

        <span part="label" class="progress-ring__label">
          <slot></slot>
        </span>
      </div>
    `}};e.styles=m,t([n(".progress-ring__indicator")],e.prototype,"indicator",2),t([c()],e.prototype,"indicatorOffset",2),t([r({type:Number,reflect:!0})],e.prototype,"value",2),t([r()],e.prototype,"label",2),t([r()],e.prototype,"lang",2),e=t([o("sl-progress-ring")],e);export{e as a};
