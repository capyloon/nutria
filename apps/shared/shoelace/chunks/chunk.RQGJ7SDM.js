import{a as f}from"./chunk.JDPMSYQH.js";import{a as y}from"./chunk.Z35U7IGS.js";import{a as v}from"./chunk.2WOAAZF5.js";import{a as h}from"./chunk.5BAFG5JX.js";import{a as n}from"./chunk.PC5WGFOA.js";import{a as p}from"./chunk.OSEV3RCT.js";import{a as d}from"./chunk.V4OMSSO6.js";import{a as m,b as r,c as l,d as c}from"./chunk.GVR6SJVE.js";import{c as o,h as u}from"./chunk.7EIHAL55.js";import{g as a}from"./chunk.OAQCUA7X.js";var t=class extends u{constructor(){super(...arguments);this.hoverValue=0;this.isHovering=!1;this.value=0;this.max=5;this.precision=1;this.readonly=!1;this.disabled=!1;this.getSymbol=()=>'<sl-icon name="star-fill" library="system"></sl-icon>'}focus(e){this.rating.focus(e)}blur(){this.rating.blur()}getValueFromMousePosition(e){return this.getValueFromXCoordinate(e.clientX)}getValueFromTouchPosition(e){return this.getValueFromXCoordinate(e.touches[0].clientX)}getValueFromXCoordinate(e){let s=this.rating.getBoundingClientRect().left,i=this.rating.getBoundingClientRect().width;return y(this.roundToPrecision((e-s)/i*this.max,this.precision),0,this.max)}handleClick(e){this.setValue(this.getValueFromMousePosition(e))}setValue(e){this.disabled||this.readonly||(this.value=e===this.value?0:e,this.isHovering=!1)}handleKeyDown(e){if(!(this.disabled||this.readonly)){if(e.key==="ArrowLeft"){let s=e.shiftKey?1:this.precision;this.value=Math.max(0,this.value-s),e.preventDefault()}if(e.key==="ArrowRight"){let s=e.shiftKey?1:this.precision;this.value=Math.min(this.max,this.value+s),e.preventDefault()}e.key==="Home"&&(this.value=0,e.preventDefault()),e.key==="End"&&(this.value=this.max,e.preventDefault())}}handleMouseEnter(){this.isHovering=!0}handleMouseMove(e){this.hoverValue=this.getValueFromMousePosition(e)}handleMouseLeave(){this.isHovering=!1}handleTouchStart(e){this.hoverValue=this.getValueFromTouchPosition(e),e.preventDefault()}handleTouchMove(e){this.isHovering=!0,this.hoverValue=this.getValueFromTouchPosition(e)}handleTouchEnd(e){this.isHovering=!1,this.setValue(this.hoverValue),e.preventDefault()}handleValueChange(){d(this,"sl-change")}roundToPrecision(e,s=.5){let i=1/s;return Math.ceil(e*i)/i}render(){let e=Array.from(Array(this.max).keys()),s=0;return this.disabled||this.readonly?s=this.value:s=this.isHovering?this.hoverValue:this.value,o`
      <div
        part="base"
        class=${n({rating:!0,"rating--readonly":this.readonly,"rating--disabled":this.disabled})}
        aria-disabled=${this.disabled?"true":"false"}
        aria-readonly=${this.readonly?"true":"false"}
        aria-valuenow=${this.value}
        aria-valuemin=${0}
        aria-valuemax=${this.max}
        tabindex=${this.disabled?"-1":"0"}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mouseenter=${this.handleMouseEnter}
        @touchstart=${this.handleTouchStart}
        @mouseleave=${this.handleMouseLeave}
        @touchend=${this.handleTouchEnd}
        @mousemove=${this.handleMouseMove}
        @touchmove=${this.handleTouchMove}
      >
        <span class="rating__symbols rating__symbols--inactive">
          ${e.map(i=>o`
              <span
                class=${n({rating__symbol:!0,"rating__symbol--hover":this.isHovering&&Math.ceil(s)===i+1})}
                role="presentation"
                @mouseenter=${this.handleMouseEnter}
              >
                ${h(this.getSymbol(i+1))}
              </span>
            `)}
        </span>

        <span class="rating__symbols rating__symbols--indicator">
          ${e.map(i=>o`
              <span
                class=${n({rating__symbol:!0,"rating__symbol--hover":this.isHovering&&Math.ceil(s)===i+1})}
                style=${v({clipPath:s>i+1?"none":`inset(0 ${100-(s-i)/1*100}% 0 0)`})}
                role="presentation"
              >
                ${h(this.getSymbol(i+1))}
              </span>
            `)}
        </span>
      </div>
    `}};t.styles=f,a([c(".rating")],t.prototype,"rating",2),a([l()],t.prototype,"hoverValue",2),a([l()],t.prototype,"isHovering",2),a([r({type:Number})],t.prototype,"value",2),a([r({type:Number})],t.prototype,"max",2),a([r({type:Number})],t.prototype,"precision",2),a([r({type:Boolean,reflect:!0})],t.prototype,"readonly",2),a([r({type:Boolean,reflect:!0})],t.prototype,"disabled",2),a([r()],t.prototype,"getSymbol",2),a([p("value",{waitUntilFirstUpdate:!0})],t.prototype,"handleValueChange",1),t=a([m("sl-rating")],t);export{t as a};
