import{a as g}from"./chunk.JW2U2OPX.js";import{a as f}from"./chunk.KKUEBWI7.js";import{a as l}from"./chunk.Z35U7IGS.js";import{a as s}from"./chunk.2WOAAZF5.js";import{a as h}from"./chunk.OSEV3RCT.js";import{a as p}from"./chunk.V4OMSSO6.js";import{a as d,b as c,d as o}from"./chunk.GVR6SJVE.js";import{c as n,h as m}from"./chunk.7EIHAL55.js";import{g as a}from"./chunk.OAQCUA7X.js";var e=class extends m{constructor(){super(...arguments);this.position=50}handleDrag(i){let{width:r}=this.base.getBoundingClientRect();i.preventDefault(),f(this.base,t=>{this.position=parseFloat(l(t/r*100,0,100).toFixed(2))})}handleKeyDown(i){if(["ArrowLeft","ArrowRight","Home","End"].includes(i.key)){let r=i.shiftKey?10:1,t=this.position;i.preventDefault(),i.key==="ArrowLeft"&&(t-=r),i.key==="ArrowRight"&&(t+=r),i.key==="Home"&&(t=0),i.key==="End"&&(t=100),t=l(t,0,100),this.position=t}}handlePositionChange(){p(this,"sl-change")}render(){return n`
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
              <sl-icon class="image-comparer__handle-icon" name="grip-vertical" library="system"></sl-icon>
            </slot>
          </div>
        </div>
      </div>
    `}};e.styles=g,a([o(".image-comparer")],e.prototype,"base",2),a([o(".image-comparer__handle")],e.prototype,"handle",2),a([c({type:Number,reflect:!0})],e.prototype,"position",2),a([h("position",{waitUntilFirstUpdate:!0})],e.prototype,"handlePositionChange",1),e=a([d("sl-image-comparer")],e);export{e as a};
