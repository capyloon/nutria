import{a as g}from"./chunk.JWOPXNXP.js";import{a as f}from"./chunk.Z35U7IGS.js";import{a as v}from"./chunk.2KPL5E6P.js";import{c as y}from"./chunk.MJKKE2MR.js";import{a as h}from"./chunk.DUQXEIJD.js";import{a as m}from"./chunk.HJHMIJRY.js";import{a as c,b as a,c as u,d,f as p}from"./chunk.N2CXUFX7.js";import{c as n}from"./chunk.I36YJ673.js";import{g as r}from"./chunk.OAQCUA7X.js";var t=class extends p{constructor(){super(...arguments);this.localize=new y(this);this.hoverValue=0;this.isHovering=!1;this.label="";this.value=0;this.max=5;this.precision=1;this.readonly=!1;this.disabled=!1;this.getSymbol=()=>'<sl-icon name="star-fill" library="system"></sl-icon>'}focus(e){this.rating.focus(e)}blur(){this.rating.blur()}getValueFromMousePosition(e){return this.getValueFromXCoordinate(e.clientX)}getValueFromTouchPosition(e){return this.getValueFromXCoordinate(e.touches[0].clientX)}getValueFromXCoordinate(e){let o=this.localize.dir()==="rtl",{left:s,right:i,width:l}=this.rating.getBoundingClientRect(),b=o?this.roundToPrecision((i-e)/l*this.max,this.precision):this.roundToPrecision((e-s)/l*this.max,this.precision);return f(b,0,this.max)}handleClick(e){this.setValue(this.getValueFromMousePosition(e)),this.emit("sl-change")}setValue(e){this.disabled||this.readonly||(this.value=e===this.value?0:e,this.isHovering=!1)}handleKeyDown(e){let o=this.localize.dir()==="ltr",s=this.localize.dir()==="rtl",i=this.value;if(!(this.disabled||this.readonly)){if(e.key==="ArrowDown"||o&&e.key==="ArrowLeft"||s&&e.key==="ArrowRight"){let l=e.shiftKey?1:this.precision;this.value=Math.max(0,this.value-l),e.preventDefault()}if(e.key==="ArrowUp"||o&&e.key==="ArrowRight"||s&&e.key==="ArrowLeft"){let l=e.shiftKey?1:this.precision;this.value=Math.min(this.max,this.value+l),e.preventDefault()}e.key==="Home"&&(this.value=0,e.preventDefault()),e.key==="End"&&(this.value=this.max,e.preventDefault()),this.value!==i&&this.emit("sl-change")}}handleMouseEnter(){this.isHovering=!0}handleMouseMove(e){this.hoverValue=this.getValueFromMousePosition(e)}handleMouseLeave(){this.isHovering=!1}handleTouchStart(e){this.hoverValue=this.getValueFromTouchPosition(e),e.preventDefault()}handleTouchMove(e){this.isHovering=!0,this.hoverValue=this.getValueFromTouchPosition(e)}handleTouchEnd(e){this.isHovering=!1,this.setValue(this.hoverValue),this.emit("sl-change"),e.preventDefault()}roundToPrecision(e,o=.5){let s=1/o;return Math.ceil(e*s)/s}render(){let e=this.localize.dir()==="rtl",o=Array.from(Array(this.max).keys()),s=0;return this.disabled||this.readonly?s=this.value:s=this.isHovering?this.hoverValue:this.value,n`
      <div
        part="base"
        class=${h({rating:!0,"rating--readonly":this.readonly,"rating--disabled":this.disabled,"rating--rtl":e})}
        role="slider"
        aria-label=${this.label}
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
          ${o.map(i=>n`
              <span
                class=${h({rating__symbol:!0,"rating__symbol--hover":this.isHovering&&Math.ceil(s)===i+1})}
                role="presentation"
                @mouseenter=${this.handleMouseEnter}
              >
                ${m(this.getSymbol(i+1))}
              </span>
            `)}
        </span>

        <span class="rating__symbols rating__symbols--indicator">
          ${o.map(i=>n`
              <span
                class=${h({rating__symbol:!0,"rating__symbol--hover":this.isHovering&&Math.ceil(s)===i+1})}
                style=${v({clipPath:s>i+1?"none":e?`inset(0 0 0 ${100-(s-i)/1*100}%)`:`inset(0 ${100-(s-i)/1*100}% 0 0)`})}
                role="presentation"
              >
                ${m(this.getSymbol(i+1))}
              </span>
            `)}
        </span>
      </div>
    `}};t.styles=g,r([d(".rating")],t.prototype,"rating",2),r([u()],t.prototype,"hoverValue",2),r([u()],t.prototype,"isHovering",2),r([a()],t.prototype,"label",2),r([a({type:Number})],t.prototype,"value",2),r([a({type:Number})],t.prototype,"max",2),r([a({type:Number})],t.prototype,"precision",2),r([a({type:Boolean,reflect:!0})],t.prototype,"readonly",2),r([a({type:Boolean,reflect:!0})],t.prototype,"disabled",2),r([a()],t.prototype,"getSymbol",2),t=r([c("sl-rating")],t);export{t as a};
