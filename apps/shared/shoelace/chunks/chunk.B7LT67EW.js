import{a as w}from"./chunk.D7DJDTHE.js";import{a as u}from"./chunk.6S67HV2F.js";import{a as m}from"./chunk.N7OOUXHR.js";import{a as n}from"./chunk.FC4RDJJF.js";import{a as y}from"./chunk.RUACWBWF.js";import{b as g}from"./chunk.7DJRGBBM.js";import{a as d}from"./chunk.AR2QSYXF.js";import{a as p,b as c,e as l,g as f}from"./chunk.IKUI3UUK.js";import{c as h}from"./chunk.SYBSOZNG.js";import{e as r}from"./chunk.I4CX4JT3.js";var t=class extends f{constructor(){super(...arguments);this.localize=new g(this);this.position=50}handleDrag(i){let{width:o}=this.base.getBoundingClientRect(),a=this.localize.dir()==="rtl";i.preventDefault(),u(this.base,{onMove:s=>{this.position=parseFloat(n(s/o*100,0,100).toFixed(2)),a&&(this.position=100-this.position)},initialEvent:i})}handleKeyDown(i){let o=this.localize.dir()==="ltr",a=this.localize.dir()==="rtl";if(["ArrowLeft","ArrowRight","Home","End"].includes(i.key)){let s=i.shiftKey?10:1,e=this.position;i.preventDefault(),(o&&i.key==="ArrowLeft"||a&&i.key==="ArrowRight")&&(e-=s),(o&&i.key==="ArrowRight"||a&&i.key==="ArrowLeft")&&(e+=s),i.key==="Home"&&(e=0),i.key==="End"&&(e=100),e=n(e,0,100),this.position=e}}handlePositionChange(){this.emit("sl-change")}render(){let i=this.localize.dir()==="rtl";return h`
      <div
        part="base"
        id="image-comparer"
        class=${y({"image-comparer":!0,"image-comparer--rtl":i})}
        @keydown=${this.handleKeyDown}
      >
        <div class="image-comparer__image">
          <slot name="before" part="before" class="image-comparer__before"></slot>

          <slot
            name="after"
            part="after"
            class="image-comparer__after"
            style=${m({clipPath:i?`inset(0 0 0 ${100-this.position}%)`:`inset(0 ${100-this.position}% 0 0)`})}
          ></slot>
        </div>

        <div
          part="divider"
          class="image-comparer__divider"
          style=${m({left:i?`${100-this.position}%`:`${this.position}%`})}
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
    `}};t.styles=w,r([l(".image-comparer")],t.prototype,"base",2),r([l(".image-comparer__handle")],t.prototype,"handle",2),r([c({type:Number,reflect:!0})],t.prototype,"position",2),r([d("position",{waitUntilFirstUpdate:!0})],t.prototype,"handlePositionChange",1),t=r([p("sl-image-comparer")],t);export{t as a};
