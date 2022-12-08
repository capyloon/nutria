import{a as h}from"./chunk.MHLZIBN4.js";import{a as c}from"./chunk.DUQXEIJD.js";import{a as r}from"./chunk.DBCWAMJH.js";import{a as l,b as i,c as a,f as d}from"./chunk.N2CXUFX7.js";import{c as s}from"./chunk.I36YJ673.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends d{constructor(){super(...arguments);this.checked=!1;this.hasFocus=!1;this.disabled=!1}connectedCallback(){super.connectedCallback(),this.setInitialAttributes(),this.addEventListeners()}handleCheckedChange(){this.setAttribute("aria-checked",this.checked?"true":"false"),this.setAttribute("tabindex",this.checked?"0":"-1")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleClick(){this.disabled||(this.checked=!0)}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}addEventListeners(){this.addEventListener("blur",()=>this.handleBlur()),this.addEventListener("click",()=>this.handleClick()),this.addEventListener("focus",()=>this.handleFocus())}setInitialAttributes(){this.setAttribute("role","radio"),this.setAttribute("tabindex","-1"),this.setAttribute("aria-disabled",this.disabled?"true":"false")}render(){return s`
      <span
        part="base"
        class=${c({radio:!0,"radio--checked":this.checked,"radio--disabled":this.disabled,"radio--focused":this.hasFocus})}
      >
        <span part="${`control${this.checked?" control--checked":""}`}" class="radio__control">
          ${this.checked?s` <sl-icon part="checked-icon" library="system" name="radio"></sl-icon> `:""}
        </span>

        <slot part="label" class="radio__label"></slot>
      </span>
    `}};e.styles=h,t([a()],e.prototype,"checked",2),t([a()],e.prototype,"hasFocus",2),t([i()],e.prototype,"value",2),t([i({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([r("checked")],e.prototype,"handleCheckedChange",1),t([r("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),e=t([l("sl-radio")],e);export{e as a};
