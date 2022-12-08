import{a as m}from"./chunk.ARMTTMZE.js";import{c as n}from"./chunk.MJKKE2MR.js";import{a as i,b as t,c as o,d as c,f as p}from"./chunk.N2CXUFX7.js";import{c as s}from"./chunk.I36YJ673.js";import{g as r}from"./chunk.OAQCUA7X.js";var e=class extends p{constructor(){super(...arguments);this.localize=new n(this);this.value=0;this.label=""}updated(a){if(super.updated(a),a.has("value")){let u=parseFloat(getComputedStyle(this.indicator).getPropertyValue("r")),l=2*Math.PI*u,d=l-this.value/100*l;this.indicatorOffset=`${d}px`}}render(){return s`
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
    `}};e.styles=m,r([c(".progress-ring__indicator")],e.prototype,"indicator",2),r([o()],e.prototype,"indicatorOffset",2),r([t({type:Number,reflect:!0})],e.prototype,"value",2),r([t()],e.prototype,"label",2),e=r([i("sl-progress-ring")],e);export{e as a};
