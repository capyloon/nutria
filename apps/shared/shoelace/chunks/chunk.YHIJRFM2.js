import{a as c}from"./chunk.IGBRI7DM.js";import{a as f}from"./chunk.MILZEQYZ.js";import{a as m}from"./chunk.S2WOXQYM.js";import{a as k}from"./chunk.I5SYL4XK.js";import{a as n}from"./chunk.AFO4PD3A.js";import{a as u}from"./chunk.LSNASYMO.js";import{a as l}from"./chunk.DBCWAMJH.js";import{a as r}from"./chunk.JUX3LFDW.js";import{a as o,b as s,c as d,d as h,f as p}from"./chunk.X7Q42RGY.js";import{c as a}from"./chunk.3G4FHXSN.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends p{constructor(){super(...arguments);this.formSubmitController=new m(this,{value:i=>i.checked?i.value||"on":void 0,defaultValue:i=>i.defaultChecked,setValue:(i,b)=>i.checked=b});this.hasFocus=!1;this.disabled=!1;this.required=!1;this.checked=!1;this.indeterminate=!1;this.invalid=!1;this.defaultChecked=!1}firstUpdated(){this.invalid=!this.input.checkValidity()}click(){this.input.click()}focus(i){this.input.focus(i)}blur(){this.input.blur()}reportValidity(){return this.input.reportValidity()}setCustomValidity(i){this.input.setCustomValidity(i),this.invalid=!this.input.checkValidity()}handleClick(){this.checked=!this.checked,this.indeterminate=!1,r(this,"sl-change")}handleBlur(){this.hasFocus=!1,r(this,"sl-blur")}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,r(this,"sl-focus")}handleStateChange(){this.invalid=!this.input.checkValidity()}render(){return a`
      <label
        part="base"
        class=${u({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate})}
      >
        <input
          class="checkbox__input"
          type="checkbox"
          name=${n(this.name)}
          value=${n(this.value)}
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
                <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                    <g stroke="currentColor" stroke-width="2">
                      <g transform="translate(3.428571, 3.428571)">
                        <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
                        <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
                      </g>
                    </g>
                  </g>
                </svg>
              `:""}
          ${!this.checked&&this.indeterminate?a`
                <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
                  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                    <g stroke="currentColor" stroke-width="2">
                      <g transform="translate(2.285714, 6.857143)">
                        <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
                      </g>
                    </g>
                  </g>
                </svg>
              `:""}
        </span>

        <span part="label" class="checkbox__label">
          <slot></slot>
        </span>
      </label>
    `}};e.styles=k,t([h('input[type="checkbox"]')],e.prototype,"input",2),t([d()],e.prototype,"hasFocus",2),t([s()],e.prototype,"name",2),t([s()],e.prototype,"value",2),t([s({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([s({type:Boolean,reflect:!0})],e.prototype,"required",2),t([s({type:Boolean,reflect:!0})],e.prototype,"checked",2),t([s({type:Boolean,reflect:!0})],e.prototype,"indeterminate",2),t([s({type:Boolean,reflect:!0})],e.prototype,"invalid",2),t([f("checked")],e.prototype,"defaultChecked",2),t([l("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),t([l("checked",{waitUntilFirstUpdate:!0}),l("indeterminate",{waitUntilFirstUpdate:!0})],e.prototype,"handleStateChange",1),e=t([o("sl-checkbox")],e);export{e as a};
