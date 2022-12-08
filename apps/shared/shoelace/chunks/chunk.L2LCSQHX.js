import{a as w}from"./chunk.6DXILWTT.js";import{a as u}from"./chunk.6S67HV2F.js";import{a as m}from"./chunk.Z35U7IGS.js";import{a as n}from"./chunk.2KPL5E6P.js";import{c as g}from"./chunk.MJKKE2MR.js";import{a as d}from"./chunk.DUQXEIJD.js";import{a as y}from"./chunk.DBCWAMJH.js";import{a as c,b as h,d as l,f}from"./chunk.N2CXUFX7.js";import{c as p}from"./chunk.I36YJ673.js";import{g as o}from"./chunk.OAQCUA7X.js";var t=class extends f{constructor(){super(...arguments);this.localize=new g(this);this.position=50}handleDrag(i){let{width:r}=this.base.getBoundingClientRect(),a=this.localize.dir()==="rtl";i.preventDefault(),u(this.base,{onMove:s=>{this.position=parseFloat(m(s/r*100,0,100).toFixed(2)),a&&(this.position=100-this.position)},initialEvent:i})}handleKeyDown(i){let r=this.localize.dir()==="ltr",a=this.localize.dir()==="rtl";if(["ArrowLeft","ArrowRight","Home","End"].includes(i.key)){let s=i.shiftKey?10:1,e=this.position;i.preventDefault(),(r&&i.key==="ArrowLeft"||a&&i.key==="ArrowRight")&&(e-=s),(r&&i.key==="ArrowRight"||a&&i.key==="ArrowLeft")&&(e+=s),i.key==="Home"&&(e=0),i.key==="End"&&(e=100),e=m(e,0,100),this.position=e}}handlePositionChange(){this.emit("sl-change")}render(){let i=this.localize.dir()==="rtl";return p`
      <div
        part="base"
        id="image-comparer"
        class=${d({"image-comparer":!0,"image-comparer--rtl":i})}
        @keydown=${this.handleKeyDown}
      >
        <div class="image-comparer__image">
          <slot name="before" part="before" class="image-comparer__before"></slot>

          <slot
            name="after"
            part="after"
            class="image-comparer__after"
            style=${n({clipPath:i?`inset(0 0 0 ${100-this.position}%)`:`inset(0 ${100-this.position}% 0 0)`})}
          ></slot>
        </div>

        <div
          part="divider"
          class="image-comparer__divider"
          style=${n({left:i?`${100-this.position}%`:`${this.position}%`})}
          @mousedown=${this.handleDrag}
          @touchstart=${this.handleDrag}
        >
          <slot
            name="handle"
            part="handle"
            class="image-comparer__handle"
            role="scrollbar"
            aria-valuenow=${this.position}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-controls="image-comparer"
            tabindex="0"
          >
            <sl-icon library="system" name="grip-vertical"></sl-icon>
          </slot>
        </div>
      </div>
    `}};t.styles=w,o([l(".image-comparer")],t.prototype,"base",2),o([l(".image-comparer__handle")],t.prototype,"handle",2),o([h({type:Number,reflect:!0})],t.prototype,"position",2),o([y("position",{waitUntilFirstUpdate:!0})],t.prototype,"handlePositionChange",1),t=o([c("sl-image-comparer")],t);export{t as a};
