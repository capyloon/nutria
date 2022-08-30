import{a as h}from"./chunk.AZ22V4UP.js";import{a as d}from"./chunk.LSNASYMO.js";import{a as r}from"./chunk.DBCWAMJH.js";import{a}from"./chunk.JUX3LFDW.js";import{a as c,b as s,c as i,f as o}from"./chunk.X7Q42RGY.js";import{c as l}from"./chunk.3G4FHXSN.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends o{constructor(){super(...arguments);this.checked=!1;this.hasFocus=!1;this.disabled=!1}connectedCallback(){super.connectedCallback(),this.setInitialAttributes(),this.addEventListeners()}handleCheckedChange(){this.setAttribute("aria-checked",this.checked?"true":"false"),this.setAttribute("tabindex",this.checked?"0":"-1")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleBlur(){this.hasFocus=!1,a(this,"sl-blur")}handleClick(){this.disabled||(this.checked=!0)}handleFocus(){this.hasFocus=!0,a(this,"sl-focus")}addEventListeners(){this.addEventListener("blur",()=>this.handleBlur()),this.addEventListener("click",()=>this.handleClick()),this.addEventListener("focus",()=>this.handleFocus())}setInitialAttributes(){this.setAttribute("role","radio"),this.setAttribute("tabindex","-1"),this.setAttribute("aria-disabled",this.disabled?"true":"false")}render(){return l`
      <span
        part="base"
        class=${d({radio:!0,"radio--checked":this.checked,"radio--disabled":this.disabled,"radio--focused":this.hasFocus})}
      >
        <span part="control" class="radio__control">
          <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g fill="currentColor">
                <circle cx="8" cy="8" r="3.42857143"></circle>
              </g>
            </g>
          </svg>
        </span>

        <span part="label" class="radio__label">
          <slot></slot>
        </span>
      </span>
    `}};e.styles=h,t([i()],e.prototype,"checked",2),t([i()],e.prototype,"hasFocus",2),t([s()],e.prototype,"value",2),t([s({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([r("checked")],e.prototype,"handleCheckedChange",1),t([r("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),e=t([c("sl-radio")],e);export{e as a};
