import{a as M}from"./chunk.REEKBSUT.js";import{a as g}from"./chunk.Z35U7IGS.js";import{a as b}from"./chunk.UIJSHDTS.js";import{c as f}from"./chunk.ISLNSUAB.js";import{a as u}from"./chunk.6WHYXLUT.js";import{a as n}from"./chunk.LSNASYMO.js";import{a as v}from"./chunk.DBCWAMJH.js";import{a as p}from"./chunk.JUX3LFDW.js";import{a as c,b as a,c as h,d,f as y}from"./chunk.X7Q42RGY.js";import{c as l}from"./chunk.3G4FHXSN.js";import{g as r}from"./chunk.OAQCUA7X.js";var t=class extends y{constructor(){super(...arguments);this.localize=new f(this);this.hoverValue=0;this.isHovering=!1;this.label="";this.value=0;this.max=5;this.precision=1;this.readonly=!1;this.disabled=!1;this.getSymbol=()=>'<sl-icon name="star-fill" library="system"></sl-icon>'}focus(e){this.rating.focus(e)}blur(){this.rating.blur()}getValueFromMousePosition(e){return this.getValueFromXCoordinate(e.clientX)}getValueFromTouchPosition(e){return this.getValueFromXCoordinate(e.touches[0].clientX)}getValueFromXCoordinate(e){let o=this.localize.dir()==="rtl",{left:i,right:s,width:m}=this.rating.getBoundingClientRect(),$=o?this.roundToPrecision((s-e)/m*this.max,this.precision):this.roundToPrecision((e-i)/m*this.max,this.precision);return g($,0,this.max)}handleClick(e){this.setValue(this.getValueFromMousePosition(e))}setValue(e){this.disabled||this.readonly||(this.value=e===this.value?0:e,this.isHovering=!1)}handleKeyDown(e){let o=this.localize.dir()==="ltr",i=this.localize.dir()==="rtl";if(!(this.disabled||this.readonly)){if(e.key==="ArrowDown"||o&&e.key==="ArrowLeft"||i&&e.key==="ArrowRight"){let s=e.shiftKey?1:this.precision;this.value=Math.max(0,this.value-s),e.preventDefault()}if(e.key==="ArrowUp"||o&&e.key==="ArrowRight"||i&&e.key==="ArrowLeft"){let s=e.shiftKey?1:this.precision;this.value=Math.min(this.max,this.value+s),e.preventDefault()}e.key==="Home"&&(this.value=0,e.preventDefault()),e.key==="End"&&(this.value=this.max,e.preventDefault())}}handleMouseEnter(){this.isHovering=!0}handleMouseMove(e){this.hoverValue=this.getValueFromMousePosition(e)}handleMouseLeave(){this.isHovering=!1}handleTouchStart(e){this.hoverValue=this.getValueFromTouchPosition(e),e.preventDefault()}handleTouchMove(e){this.isHovering=!0,this.hoverValue=this.getValueFromTouchPosition(e)}handleTouchEnd(e){this.isHovering=!1,this.setValue(this.hoverValue),e.preventDefault()}handleValueChange(){p(this,"sl-change")}roundToPrecision(e,o=.5){let i=1/o;return Math.ceil(e*i)/i}render(){let e=this.localize.dir()==="rtl",o=Array.from(Array(this.max).keys()),i=0;return this.disabled||this.readonly?i=this.value:i=this.isHovering?this.hoverValue:this.value,l`
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
          ${o.map(s=>l`
              <span
                class=${n({rating__symbol:!0,"rating__symbol--hover":this.isHovering&&Math.ceil(i)===s+1})}
                role="presentation"
                @mouseenter=${this.handleMouseEnter}
              >
                ${u(this.getSymbol(s+1))}
              </span>
            `)}
        </span>

        <span class="rating__symbols rating__symbols--indicator">
          ${o.map(s=>l`
              <span
                class=${n({rating__symbol:!0,"rating__symbol--hover":this.isHovering&&Math.ceil(i)===s+1})}
                style=${b({clipPath:i>s+1?"none":e?`inset(0 0 0 ${100-(i-s)/1*100}%)`:`inset(0 ${100-(i-s)/1*100}% 0 0)`})}
                role="presentation"
              >
                ${u(this.getSymbol(s+1))}
              </span>
            `)}
        </span>
      </div>
    `}};t.styles=M,r([d(".rating")],t.prototype,"rating",2),r([h()],t.prototype,"hoverValue",2),r([h()],t.prototype,"isHovering",2),r([a()],t.prototype,"label",2),r([a({type:Number})],t.prototype,"value",2),r([a({type:Number})],t.prototype,"max",2),r([a({type:Number})],t.prototype,"precision",2),r([a({type:Boolean,reflect:!0})],t.prototype,"readonly",2),r([a({type:Boolean,reflect:!0})],t.prototype,"disabled",2),r([a()],t.prototype,"getSymbol",2),r([v("value",{waitUntilFirstUpdate:!0})],t.prototype,"handleValueChange",1),t=r([c("sl-rating")],t);export{t as a};
