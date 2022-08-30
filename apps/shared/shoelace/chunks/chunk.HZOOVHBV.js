import{a as m}from"./chunk.5BW7UXND.js";import{c as n}from"./chunk.ISLNSUAB.js";import{a as i,b as r,c as o,d as c,f as p}from"./chunk.X7Q42RGY.js";import{c as l}from"./chunk.3G4FHXSN.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends p{constructor(){super(...arguments);this.localize=new n(this);this.value=0;this.label=""}updated(a){if(super.updated(a),a.has("percentage")){let u=parseFloat(getComputedStyle(this.indicator).getPropertyValue("r")),s=2*Math.PI*u,f=s-this.value/100*s;this.indicatorOffset=`${f}px`}}render(){return l`
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
    `}};e.styles=m,t([c(".progress-ring__indicator")],e.prototype,"indicator",2),t([o()],e.prototype,"indicatorOffset",2),t([r({type:Number,reflect:!0})],e.prototype,"value",2),t([r()],e.prototype,"label",2),e=t([i("sl-progress-ring")],e);export{e as a};
