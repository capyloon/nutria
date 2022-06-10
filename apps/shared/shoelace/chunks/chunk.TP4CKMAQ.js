import{a as m}from"./chunk.FSG7P2ZB.js";import{a as f}from"./chunk.R5UEL6LD.js";import{a as p}from"./chunk.FOJ445RA.js";import{a as u}from"./chunk.PC5WGFOA.js";import{a as r}from"./chunk.OSEV3RCT.js";import{a}from"./chunk.V4OMSSO6.js";import{a as l}from"./chunk.2XQLLZV4.js";import{a as d,b as s,c as o,d as h}from"./chunk.GVR6SJVE.js";import{c,h as n}from"./chunk.7EIHAL55.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends n{constructor(){super(...arguments);this.formSubmitController=new p(this,{value:i=>i.checked?i.value||"on":void 0});this.hasFocus=!1;this.disabled=!1;this.checked=!1;this.invalid=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","radio")}click(){this.input.click()}focus(i){this.input.focus(i)}blur(){this.input.blur()}reportValidity(){return this.input.reportValidity()}setCustomValidity(i){this.input.setCustomValidity(i),this.invalid=!this.input.checkValidity()}handleBlur(){this.hasFocus=!1,a(this,"sl-blur")}handleClick(){this.disabled||(this.checked=!0)}handleFocus(){this.hasFocus=!0,a(this,"sl-focus")}handleCheckedChange(){this.setAttribute("aria-checked",this.checked?"true":"false"),this.hasUpdated&&a(this,"sl-change")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false"),this.hasUpdated&&(this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity())}render(){return c`
      <label
        part="base"
        class=${u({radio:!0,"radio--checked":this.checked,"radio--disabled":this.disabled,"radio--focused":this.hasFocus})}
      >
        <input
          class="radio__input"
          type="radio"
          name=${l(this.name)}
          value=${l(this.value)}
          .checked=${f(this.checked)}
          .disabled=${this.disabled}
          @click=${this.handleClick}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
        />
        <span part="control" class="radio__control">
          <span part="checked-icon" class="radio__icon">
            <svg viewBox="0 0 16 16">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g fill="currentColor">
                  <circle cx="8" cy="8" r="3.42857143"></circle>
                </g>
              </g>
            </svg>
          </span>
        </span>

        <span part="label" class="radio__label">
          <slot></slot>
        </span>
      </label>
    `}};e.styles=m,t([h(".radio__input")],e.prototype,"input",2),t([o()],e.prototype,"hasFocus",2),t([s()],e.prototype,"name",2),t([s()],e.prototype,"value",2),t([s({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([s({type:Boolean,reflect:!0})],e.prototype,"checked",2),t([s({type:Boolean,reflect:!0})],e.prototype,"invalid",2),t([r("checked")],e.prototype,"handleCheckedChange",1),t([r("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),e=t([d("sl-radio")],e);export{e as a};
