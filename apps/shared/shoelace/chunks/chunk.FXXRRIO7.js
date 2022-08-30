import{a as v}from"./chunk.4RO6CAF7.js";import{a as y}from"./chunk.LVI3NZW5.js";import{a as m}from"./chunk.Z35U7IGS.js";import{a as n}from"./chunk.UIJSHDTS.js";import{c as w}from"./chunk.ISLNSUAB.js";import{a as h}from"./chunk.LSNASYMO.js";import{a as u}from"./chunk.DBCWAMJH.js";import{a as f}from"./chunk.JUX3LFDW.js";import{a as c,b as d,d as l,f as g}from"./chunk.X7Q42RGY.js";import{c as p}from"./chunk.3G4FHXSN.js";import{g as o}from"./chunk.OAQCUA7X.js";var t=class extends g{constructor(){super(...arguments);this.localize=new w(this);this.position=50}handleDrag(i){let{width:r}=this.base.getBoundingClientRect(),a=this.localize.dir()==="rtl";i.preventDefault(),y(this.base,{onMove:s=>{this.position=parseFloat(m(s/r*100,0,100).toFixed(2)),a&&(this.position=100-this.position)},initialEvent:i})}handleKeyDown(i){let r=this.localize.dir()==="ltr",a=this.localize.dir()==="rtl";if(["ArrowLeft","ArrowRight","Home","End"].includes(i.key)){let s=i.shiftKey?10:1,e=this.position;i.preventDefault(),(r&&i.key==="ArrowLeft"||a&&i.key==="ArrowRight")&&(e-=s),(r&&i.key==="ArrowRight"||a&&i.key==="ArrowLeft")&&(e+=s),i.key==="Home"&&(e=0),i.key==="End"&&(e=100),e=m(e,0,100),this.position=e}}handlePositionChange(){f(this,"sl-change")}render(){let i=this.localize.dir()==="rtl";return p`
      <div
        part="base"
        id="image-comparer"
        class=${h({"image-comparer":!0,"image-comparer--rtl":i})}
        @keydown=${this.handleKeyDown}
      >
        <div class="image-comparer__image">
          <div part="before" class="image-comparer__before">
            <slot name="before"></slot>
          </div>

          <div
            part="after"
            class="image-comparer__after"
            style=${n({clipPath:i?`inset(0 0 0 ${100-this.position}%)`:`inset(0 ${100-this.position}% 0 0)`})}
          >
            <slot name="after"></slot>
          </div>
        </div>

        <div
          part="divider"
          class="image-comparer__divider"
          style=${n({left:i?`${100-this.position}%`:`${this.position}%`})}
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
    `}};t.styles=v,o([l(".image-comparer")],t.prototype,"base",2),o([l(".image-comparer__handle")],t.prototype,"handle",2),o([d({type:Number,reflect:!0})],t.prototype,"position",2),o([u("position",{waitUntilFirstUpdate:!0})],t.prototype,"handlePositionChange",1),t=o([c("sl-image-comparer")],t);export{t as a};
