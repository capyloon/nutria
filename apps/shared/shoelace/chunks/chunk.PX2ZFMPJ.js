import{a as w}from"./chunk.N2VZQFX3.js";import{a as x}from"./chunk.IGBRI7DM.js";import{a as $}from"./chunk.MILZEQYZ.js";import{a as g}from"./chunk.S2WOXQYM.js";import{c as v}from"./chunk.ISLNSUAB.js";import{a as y}from"./chunk.RHW2XED2.js";import{a as l}from"./chunk.AFO4PD3A.js";import{a as p}from"./chunk.LSNASYMO.js";import{a as u}from"./chunk.DBCWAMJH.js";import{a as r}from"./chunk.JUX3LFDW.js";import{a as m,b as i,c as d,d as f,f as b}from"./chunk.X7Q42RGY.js";import{c as n}from"./chunk.3G4FHXSN.js";import{g as t}from"./chunk.OAQCUA7X.js";var C,V=(C=navigator.userAgentData)==null?void 0:C.brands.some(c=>c.brand.includes("Chromium")),_=V?!1:navigator.userAgent.includes("Firefox"),e=class extends b{constructor(){super(...arguments);this.formSubmitController=new g(this);this.hasSlotController=new y(this,"help-text","label");this.localize=new v(this);this.hasFocus=!1;this.isPasswordVisible=!1;this.type="text";this.size="medium";this.value="";this.defaultValue="";this.filled=!1;this.pill=!1;this.label="";this.helpText="";this.clearable=!1;this.togglePassword=!1;this.noSpinButtons=!1;this.disabled=!1;this.readonly=!1;this.required=!1;this.invalid=!1}get valueAsDate(){var s,a;return(a=(s=this.input)==null?void 0:s.valueAsDate)!=null?a:null}set valueAsDate(s){let a=document.createElement("input");a.type="date",a.valueAsDate=s,this.value=a.value}get valueAsNumber(){var s,a;return(a=(s=this.input)==null?void 0:s.valueAsNumber)!=null?a:parseFloat(this.value)}set valueAsNumber(s){let a=document.createElement("input");a.type="number",a.valueAsNumber=s,this.value=a.value}firstUpdated(){this.invalid=!this.input.checkValidity()}focus(s){this.input.focus(s)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(s,a,o="none"){this.input.setSelectionRange(s,a,o)}setRangeText(s,a,o,h="preserve"){this.input.setRangeText(s,a,o,h),this.value!==this.input.value&&(this.value=this.input.value,r(this,"sl-input"),r(this,"sl-change"))}reportValidity(){return this.input.reportValidity()}setCustomValidity(s){this.input.setCustomValidity(s),this.invalid=!this.input.checkValidity()}handleBlur(){this.hasFocus=!1,r(this,"sl-blur")}handleChange(){this.value=this.input.value,r(this,"sl-change")}handleClearClick(s){this.value="",r(this,"sl-clear"),r(this,"sl-input"),r(this,"sl-change"),this.input.focus(),s.stopPropagation()}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleStepChange(){this.input.step=String(this.step),this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,r(this,"sl-focus")}handleInput(){this.value=this.input.value,r(this,"sl-input")}handleInvalid(){this.invalid=!0}handleKeyDown(s){let a=s.metaKey||s.ctrlKey||s.shiftKey||s.altKey;s.key==="Enter"&&!a&&setTimeout(()=>{s.defaultPrevented||this.formSubmitController.submit()})}handlePasswordToggle(){this.isPasswordVisible=!this.isPasswordVisible}handleValueChange(){this.invalid=!this.input.checkValidity()}render(){let s=this.hasSlotController.test("label"),a=this.hasSlotController.test("help-text"),o=this.label?!0:!!s,h=this.helpText?!0:!!a,k=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return n`
      <div
        part="form-control"
        class=${p({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":o,"form-control--has-help-text":h})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${o?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${p({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--invalid":this.invalid,"input--no-spin-buttons":this.noSpinButtons,"input--is-firefox":_})}
          >
            <span part="prefix" class="input__prefix">
              <slot name="prefix"></slot>
            </span>

            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type==="password"&&this.isPasswordVisible?"text":this.type}
              name=${l(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${l(this.placeholder)}
              minlength=${l(this.minlength)}
              maxlength=${l(this.maxlength)}
              min=${l(this.min)}
              max=${l(this.max)}
              step=${l(this.step)}
              .value=${x(this.value)}
              autocapitalize=${l(this.type==="password"?"off":this.autocapitalize)}
              autocomplete=${l(this.type==="password"?"off":this.autocomplete)}
              autocorrect=${l(this.type==="password"?"off":this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${l(this.spellcheck)}
              pattern=${l(this.pattern)}
              enterkeyhint=${l(this.enterkeyhint)}
              inputmode=${l(this.inputmode)}
              aria-describedby="help-text"
              aria-invalid=${this.invalid?"true":"false"}
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${k?n`
                  <button
                    part="clear-button"
                    class="input__clear"
                    type="button"
                    aria-label=${this.localize.term("clearEntry")}
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  >
                    <slot name="clear-icon">
                      <sl-icon name="x-circle-fill" library="system"></sl-icon>
                    </slot>
                  </button>
                `:""}
            ${this.togglePassword&&!this.disabled?n`
                  <button
                    part="password-toggle-button"
                    class="input__password-toggle"
                    type="button"
                    aria-label=${this.localize.term(this.isPasswordVisible?"hidePassword":"showPassword")}
                    @click=${this.handlePasswordToggle}
                    tabindex="-1"
                  >
                    ${this.isPasswordVisible?n`
                          <slot name="show-password-icon">
                            <sl-icon name="eye-slash" library="system"></sl-icon>
                          </slot>
                        `:n`
                          <slot name="hide-password-icon">
                            <sl-icon name="eye" library="system"></sl-icon>
                          </slot>
                        `}
                  </button>
                `:""}

            <span part="suffix" class="input__suffix">
              <slot name="suffix"></slot>
            </span>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${h?"false":"true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};e.styles=w,t([f(".input__control")],e.prototype,"input",2),t([d()],e.prototype,"hasFocus",2),t([d()],e.prototype,"isPasswordVisible",2),t([i({reflect:!0})],e.prototype,"type",2),t([i({reflect:!0})],e.prototype,"size",2),t([i()],e.prototype,"name",2),t([i()],e.prototype,"value",2),t([$()],e.prototype,"defaultValue",2),t([i({type:Boolean,reflect:!0})],e.prototype,"filled",2),t([i({type:Boolean,reflect:!0})],e.prototype,"pill",2),t([i()],e.prototype,"label",2),t([i({attribute:"help-text"})],e.prototype,"helpText",2),t([i({type:Boolean})],e.prototype,"clearable",2),t([i({attribute:"toggle-password",type:Boolean})],e.prototype,"togglePassword",2),t([i({attribute:"no-spin-buttons",type:Boolean})],e.prototype,"noSpinButtons",2),t([i()],e.prototype,"placeholder",2),t([i({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([i({type:Boolean,reflect:!0})],e.prototype,"readonly",2),t([i({type:Number})],e.prototype,"minlength",2),t([i({type:Number})],e.prototype,"maxlength",2),t([i()],e.prototype,"min",2),t([i()],e.prototype,"max",2),t([i()],e.prototype,"step",2),t([i()],e.prototype,"pattern",2),t([i({type:Boolean,reflect:!0})],e.prototype,"required",2),t([i({type:Boolean,reflect:!0})],e.prototype,"invalid",2),t([i()],e.prototype,"autocapitalize",2),t([i()],e.prototype,"autocorrect",2),t([i()],e.prototype,"autocomplete",2),t([i({type:Boolean})],e.prototype,"autofocus",2),t([i()],e.prototype,"enterkeyhint",2),t([i({type:Boolean})],e.prototype,"spellcheck",2),t([i()],e.prototype,"inputmode",2),t([u("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),t([u("step",{waitUntilFirstUpdate:!0})],e.prototype,"handleStepChange",1),t([u("value",{waitUntilFirstUpdate:!0})],e.prototype,"handleValueChange",1),e=t([m("sl-input")],e);export{e as a};
