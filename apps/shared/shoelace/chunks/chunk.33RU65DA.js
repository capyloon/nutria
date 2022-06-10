import{a as $}from"./chunk.2V5NVSIT.js";import{h as g}from"./chunk.RLLTRZYL.js";import{a as v}from"./chunk.R5UEL6LD.js";import{a as y}from"./chunk.E35DOPAL.js";import{a as b}from"./chunk.RHW2XED2.js";import{a as l}from"./chunk.2XQLLZV4.js";import{a as d}from"./chunk.PC5WGFOA.js";import{a as p}from"./chunk.OSEV3RCT.js";import{a as r}from"./chunk.V4OMSSO6.js";import{a as m,b as i,c as u,d as f}from"./chunk.GVR6SJVE.js";import{c as n,h as c}from"./chunk.7EIHAL55.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends c{constructor(){super(...arguments);this.formSubmitController=new y(this);this.hasSlotController=new b(this,"help-text","label");this.localize=new g(this);this.hasFocus=!1;this.isPasswordVisible=!1;this.type="text";this.size="medium";this.value="";this.filled=!1;this.pill=!1;this.label="";this.helpText="";this.clearable=!1;this.togglePassword=!1;this.disabled=!1;this.readonly=!1;this.required=!1;this.invalid=!1}get valueAsDate(){var s,a;return(a=(s=this.input)==null?void 0:s.valueAsDate)!=null?a:null}set valueAsDate(s){this.updateComplete.then(()=>{this.input.valueAsDate=s,this.value=this.input.value})}get valueAsNumber(){var s,a;return(a=(s=this.input)==null?void 0:s.valueAsNumber)!=null?a:parseFloat(this.value)}set valueAsNumber(s){this.updateComplete.then(()=>{this.input.valueAsNumber=s,this.value=this.input.value})}firstUpdated(){this.invalid=!this.input.checkValidity()}focus(s){this.input.focus(s)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(s,a,o="none"){this.input.setSelectionRange(s,a,o)}setRangeText(s,a,o,h="preserve"){this.input.setRangeText(s,a,o,h),this.value!==this.input.value&&(this.value=this.input.value,r(this,"sl-input"),r(this,"sl-change"))}reportValidity(){return this.input.reportValidity()}setCustomValidity(s){this.input.setCustomValidity(s),this.invalid=!this.input.checkValidity()}handleBlur(){this.hasFocus=!1,r(this,"sl-blur")}handleChange(){this.value=this.input.value,r(this,"sl-change")}handleClearClick(s){this.value="",r(this,"sl-clear"),r(this,"sl-input"),r(this,"sl-change"),this.input.focus(),s.stopPropagation()}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,r(this,"sl-focus")}handleInput(){this.value=this.input.value,r(this,"sl-input")}handleInvalid(){this.invalid=!0}handleKeyDown(s){let a=s.metaKey||s.ctrlKey||s.shiftKey||s.altKey;s.key==="Enter"&&!a&&this.formSubmitController.submit()}handlePasswordToggle(){this.isPasswordVisible=!this.isPasswordVisible}handleValueChange(){this.invalid=!this.input.checkValidity()}render(){let s=this.hasSlotController.test("label"),a=this.hasSlotController.test("help-text"),o=this.label?!0:!!s,h=this.helpText?!0:!!a;return n`
      <div
        part="form-control"
        class=${d({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":o,"form-control--has-help-text":h})}
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
            class=${d({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":this.value.length===0,"input--invalid":this.invalid})}
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
              .value=${v(this.value)}
              autocapitalize=${l(this.autocapitalize)}
              autocomplete=${l(this.autocomplete)}
              autocorrect=${l(this.autocorrect)}
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

            ${this.clearable&&this.value.length>0?n`
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
            ${this.togglePassword?n`
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
    `}};e.styles=$,t([f(".input__control")],e.prototype,"input",2),t([u()],e.prototype,"hasFocus",2),t([u()],e.prototype,"isPasswordVisible",2),t([i({reflect:!0})],e.prototype,"type",2),t([i({reflect:!0})],e.prototype,"size",2),t([i()],e.prototype,"name",2),t([i()],e.prototype,"value",2),t([i({type:Boolean,reflect:!0})],e.prototype,"filled",2),t([i({type:Boolean,reflect:!0})],e.prototype,"pill",2),t([i()],e.prototype,"label",2),t([i({attribute:"help-text"})],e.prototype,"helpText",2),t([i({type:Boolean})],e.prototype,"clearable",2),t([i({attribute:"toggle-password",type:Boolean})],e.prototype,"togglePassword",2),t([i()],e.prototype,"placeholder",2),t([i({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([i({type:Boolean,reflect:!0})],e.prototype,"readonly",2),t([i({type:Number})],e.prototype,"minlength",2),t([i({type:Number})],e.prototype,"maxlength",2),t([i()],e.prototype,"min",2),t([i()],e.prototype,"max",2),t([i({type:Number})],e.prototype,"step",2),t([i()],e.prototype,"pattern",2),t([i({type:Boolean,reflect:!0})],e.prototype,"required",2),t([i({type:Boolean,reflect:!0})],e.prototype,"invalid",2),t([i()],e.prototype,"autocapitalize",2),t([i()],e.prototype,"autocorrect",2),t([i()],e.prototype,"autocomplete",2),t([i({type:Boolean})],e.prototype,"autofocus",2),t([i()],e.prototype,"enterkeyhint",2),t([i({type:Boolean})],e.prototype,"spellcheck",2),t([i()],e.prototype,"inputmode",2),t([p("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),t([p("value",{waitUntilFirstUpdate:!0})],e.prototype,"handleValueChange",1),e=t([m("sl-input")],e);export{e as a};
