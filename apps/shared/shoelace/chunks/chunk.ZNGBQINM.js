import{a as m}from"./chunk.MHP3Y62M.js";import{b as n}from"./chunk.7DJRGBBM.js";import{a as s,b as t,c as i,e as o,g as p}from"./chunk.IKUI3UUK.js";import{c}from"./chunk.SYBSOZNG.js";import{e as r}from"./chunk.I4CX4JT3.js";var e=class extends p{constructor(){super(...arguments);this.localize=new n(this);this.value=0;this.label=""}updated(a){if(super.updated(a),a.has("value")){let u=parseFloat(getComputedStyle(this.indicator).getPropertyValue("r")),l=2*Math.PI*u,d=l-this.value/100*l;this.indicatorOffset=`${d}px`}}render(){return c`
      <div
        part="base"
        class="progress-ring"
        role="progressbar"
        aria-label=${this.label.length>0?this.label:this.localize.term("progress")}
        aria-describedby="label"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${this.value}"
        style="--percentage: ${this.value/100}"
      >
        <svg class="progress-ring__image">
          <circle class="progress-ring__track"></circle>
          <circle class="progress-ring__indicator" style="stroke-dashoffset: ${this.indicatorOffset}"></circle>
        </svg>

        <slot id="label" part="label" class="progress-ring__label"></slot>
      </div>
    `}};e.styles=m,r([o(".progress-ring__indicator")],e.prototype,"indicator",2),r([i()],e.prototype,"indicatorOffset",2),r([t({type:Number,reflect:!0})],e.prototype,"value",2),r([t()],e.prototype,"label",2),e=r([s("sl-progress-ring")],e);export{e as a};
