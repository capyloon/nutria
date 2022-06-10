import{a as c}from"./chunk.R5UEL6LD.js";import{a as m}from"./chunk.E35DOPAL.js";import{a as f}from"./chunk.7W5ZN63W.js";import{a as l}from"./chunk.2XQLLZV4.js";import{a as p}from"./chunk.PC5WGFOA.js";import{a as n}from"./chunk.OSEV3RCT.js";import{a as r}from"./chunk.V4OMSSO6.js";import{a as o,b as i,c as h,d as u}from"./chunk.GVR6SJVE.js";import{c as a,h as d}from"./chunk.7EIHAL55.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends d{constructor(){super(...arguments);this.formSubmitController=new m(this,{value:s=>s.checked?s.value:void 0});this.hasFocus=!1;this.disabled=!1;this.required=!1;this.checked=!1;this.indeterminate=!1;this.invalid=!1}firstUpdated(){this.invalid=!this.input.checkValidity()}click(){this.input.click()}focus(s){this.input.focus(s)}blur(){this.input.blur()}reportValidity(){return this.input.reportValidity()}setCustomValidity(s){this.input.setCustomValidity(s),this.invalid=!this.input.checkValidity()}handleClick(){this.checked=!this.checked,this.indeterminate=!1,r(this,"sl-change")}handleBlur(){this.hasFocus=!1,r(this,"sl-blur")}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,r(this,"sl-focus")}handleStateChange(){this.invalid=!this.input.checkValidity()}render(){return a`
      <label
        part="base"
        class=${p({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate})}
      >
        <input
          class="checkbox__input"
          type="checkbox"
          name=${l(this.name)}
          value=${l(this.value)}
          .indeterminate=${c(this.indeterminate)}
          .checked=${c(this.checked)}
          .disabled=${this.disabled}
          .required=${this.required}
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
        />

        <span part="control" class="checkbox__control">
          ${this.checked?a`
                <span part="checked-icon" class="checkbox__icon">
                  <svg viewBox="0 0 16 16">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                      <g stroke="currentColor" stroke-width="2">
                        <g transform="translate(3.428571, 3.428571)">
                          <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
                          <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
              `:""}
          ${!this.checked&&this.indeterminate?a`
                <span part="indeterminate-icon" class="checkbox__icon">
                  <svg viewBox="0 0 16 16">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                      <g stroke="currentColor" stroke-width="2">
                        <g transform="translate(2.285714, 6.857143)">
                          <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
              `:""}
        </span>

        <span part="label" class="checkbox__label">
          <slot></slot>
        </span>
      </label>
    `}};e.styles=f,t([u('input[type="checkbox"]')],e.prototype,"input",2),t([h()],e.prototype,"hasFocus",2),t([i()],e.prototype,"name",2),t([i()],e.prototype,"value",2),t([i({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([i({type:Boolean,reflect:!0})],e.prototype,"required",2),t([i({type:Boolean,reflect:!0})],e.prototype,"checked",2),t([i({type:Boolean,reflect:!0})],e.prototype,"indeterminate",2),t([i({type:Boolean,reflect:!0})],e.prototype,"invalid",2),t([n("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),t([n("checked",{waitUntilFirstUpdate:!0}),n("indeterminate",{waitUntilFirstUpdate:!0})],e.prototype,"handleStateChange",1),e=t([o("sl-checkbox")],e);export{e as a};
