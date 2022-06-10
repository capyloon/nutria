import{a as g}from"./chunk.RHYX3QSI.js";import{a as f}from"./chunk.WWGKY4AH.js";import{a as l}from"./chunk.Z35U7IGS.js";import{a as s}from"./chunk.2WOAAZF5.js";import{a as h}from"./chunk.OSEV3RCT.js";import{a as c}from"./chunk.V4OMSSO6.js";import{a as d,b as p,d as r}from"./chunk.GVR6SJVE.js";import{c as n,h as m}from"./chunk.7EIHAL55.js";import{g as a}from"./chunk.OAQCUA7X.js";var i=class extends m{constructor(){super(...arguments);this.position=50}handleDrag(e){let{width:o}=this.base.getBoundingClientRect();e.preventDefault(),f(this.base,{onMove:t=>{this.position=parseFloat(l(t/o*100,0,100).toFixed(2))},initialEvent:e})}handleKeyDown(e){if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){let o=e.shiftKey?10:1,t=this.position;e.preventDefault(),e.key==="ArrowLeft"&&(t-=o),e.key==="ArrowRight"&&(t+=o),e.key==="Home"&&(t=0),e.key==="End"&&(t=100),t=l(t,0,100),this.position=t}}handlePositionChange(){c(this,"sl-change")}render(){return n`
      <div part="base" id="image-comparer" class="image-comparer" @keydown=${this.handleKeyDown}>
        <div class="image-comparer__image">
          <div part="before" class="image-comparer__before">
            <slot name="before"></slot>
          </div>

          <div
            part="after"
            class="image-comparer__after"
            style=${s({clipPath:`inset(0 ${100-this.position}% 0 0)`})}
          >
            <slot name="after"></slot>
          </div>
        </div>

        <div
          part="divider"
          class="image-comparer__divider"
          style=${s({left:`${this.position}%`})}
          @mousedown=${this.handleDrag}
          @touchstart=${this.handleDrag}
        >
          <div
            part="handle"
            class="image-comparer__handle"
            role="scrollbar"
            aria-valuenow=${this.position}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-controls="image-comparer"
            tabindex="0"
          >
            <slot name="handle-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g fill="currentColor" fill-rule="nonzero">
                  <path
                    d="m21.14 12.55-5.482 4.796c-.646.566-1.658.106-1.658-.753V7a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506h.001ZM2.341 12.55l5.482 4.796c.646.566 1.658.106 1.658-.753V7a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506h-.001Z"
                  />
                </g>
              </svg>
            </slot>
          </div>
        </div>
      </div>
    `}};i.styles=g,a([r(".image-comparer")],i.prototype,"base",2),a([r(".image-comparer__handle")],i.prototype,"handle",2),a([p({type:Number,reflect:!0})],i.prototype,"position",2),a([h("position",{waitUntilFirstUpdate:!0})],i.prototype,"handlePositionChange",1),i=a([d("sl-image-comparer")],i);export{i as a};
