import{a as M}from"./chunk.LCROS2NA.js";import{a as b}from"./chunk.N7OOUXHR.js";import{a as g}from"./chunk.FC4RDJJF.js";import{b as f}from"./chunk.7DJRGBBM.js";import{a as m}from"./chunk.5JLGKCBB.js";import{a as c}from"./chunk.AR2QSYXF.js";import{a as n}from"./chunk.RUACWBWF.js";import{a as v,b as o,c as u,d as p,e as d,g as y}from"./chunk.IKUI3UUK.js";import{c as h}from"./chunk.SYBSOZNG.js";import{e as s}from"./chunk.I4CX4JT3.js";var t=class extends y{constructor(){super(...arguments);this.localize=new f(this);this.hoverValue=0;this.isHovering=!1;this.label="";this.value=0;this.max=5;this.precision=1;this.readonly=!1;this.disabled=!1;this.getSymbol=()=>'<sl-icon name="star-fill" library="system"></sl-icon>'}getValueFromMousePosition(e){return this.getValueFromXCoordinate(e.clientX)}getValueFromTouchPosition(e){return this.getValueFromXCoordinate(e.touches[0].clientX)}getValueFromXCoordinate(e){let a=this.localize.dir()==="rtl",{left:i,right:r,width:l}=this.rating.getBoundingClientRect(),$=a?this.roundToPrecision((r-e)/l*this.max,this.precision):this.roundToPrecision((e-i)/l*this.max,this.precision);return g($,0,this.max)}handleClick(e){this.disabled||(this.setValue(this.getValueFromMousePosition(e)),this.emit("sl-change"))}setValue(e){this.disabled||this.readonly||(this.value=e===this.value?0:e,this.isHovering=!1)}handleKeyDown(e){let a=this.localize.dir()==="ltr",i=this.localize.dir()==="rtl",r=this.value;if(!(this.disabled||this.readonly)){if(e.key==="ArrowDown"||a&&e.key==="ArrowLeft"||i&&e.key==="ArrowRight"){let l=e.shiftKey?1:this.precision;this.value=Math.max(0,this.value-l),e.preventDefault()}if(e.key==="ArrowUp"||a&&e.key==="ArrowRight"||i&&e.key==="ArrowLeft"){let l=e.shiftKey?1:this.precision;this.value=Math.min(this.max,this.value+l),e.preventDefault()}e.key==="Home"&&(this.value=0,e.preventDefault()),e.key==="End"&&(this.value=this.max,e.preventDefault()),this.value!==r&&this.emit("sl-change")}}handleMouseEnter(e){this.isHovering=!0,this.hoverValue=this.getValueFromMousePosition(e)}handleMouseMove(e){this.hoverValue=this.getValueFromMousePosition(e)}handleMouseLeave(){this.isHovering=!1}handleTouchStart(e){this.isHovering=!0,this.hoverValue=this.getValueFromTouchPosition(e),e.preventDefault()}handleTouchMove(e){this.hoverValue=this.getValueFromTouchPosition(e)}handleTouchEnd(e){this.isHovering=!1,this.setValue(this.hoverValue),this.emit("sl-change"),e.preventDefault()}roundToPrecision(e,a=.5){let i=1/a;return Math.ceil(e*i)/i}handleHoverValueChange(){this.emit("sl-hover",{detail:{phase:"move",value:this.hoverValue}})}handleIsHoveringChange(){this.emit("sl-hover",{detail:{phase:this.isHovering?"start":"end",value:this.hoverValue}})}focus(e){this.rating.focus(e)}blur(){this.rating.blur()}render(){let e=this.localize.dir()==="rtl",a=Array.from(Array(this.max).keys()),i=0;return this.disabled||this.readonly?i=this.value:i=this.isHovering?this.hoverValue:this.value,h`
      <div
        part="base"
        class=${n({rating:!0,"rating--readonly":this.readonly,"rating--disabled":this.disabled,"rating--rtl":e})}
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
          ${a.map(r=>h`
              <span
                class=${n({rating__symbol:!0,"rating__symbol--hover":this.isHovering&&Math.ceil(i)===r+1})}
                role="presentation"
                @mouseenter=${this.handleMouseEnter}
              >
                ${m(this.getSymbol(r+1))}
              </span>
            `)}
        </span>

        <span class="rating__symbols rating__symbols--indicator">
          ${a.map(r=>h`
              <span
                class=${n({rating__symbol:!0,"rating__symbol--hover":this.isHovering&&Math.ceil(i)===r+1})}
                style=${b({clipPath:i>r+1?"none":e?`inset(0 0 0 ${100-(i-r)/1*100}%)`:`inset(0 ${100-(i-r)/1*100}% 0 0)`})}
                role="presentation"
              >
                ${m(this.getSymbol(r+1))}
              </span>
            `)}
        </span>
      </div>
    `}};t.styles=M,s([d(".rating")],t.prototype,"rating",2),s([u()],t.prototype,"hoverValue",2),s([u()],t.prototype,"isHovering",2),s([o()],t.prototype,"label",2),s([o({type:Number})],t.prototype,"value",2),s([o({type:Number})],t.prototype,"max",2),s([o({type:Number})],t.prototype,"precision",2),s([o({type:Boolean,reflect:!0})],t.prototype,"readonly",2),s([o({type:Boolean,reflect:!0})],t.prototype,"disabled",2),s([o()],t.prototype,"getSymbol",2),s([p({passive:!0})],t.prototype,"handleTouchMove",1),s([c("hoverValue")],t.prototype,"handleHoverValueChange",1),s([c("isHovering")],t.prototype,"handleIsHoveringChange",1),t=s([v("sl-rating")],t);export{t as a};
