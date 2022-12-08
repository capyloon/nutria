import{a as x}from"./chunk.VJ4AHSD3.js";import{a as g}from"./chunk.DCPKKQHR.js";import{a as w}from"./chunk.M2CI3PIT.js";import{a as v}from"./chunk.ZLZ62WZD.js";import{c as y}from"./chunk.MJKKE2MR.js";import{a as b}from"./chunk.RHW2XED2.js";import{a as l}from"./chunk.UBF6MLHX.js";import{a as p}from"./chunk.DUQXEIJD.js";import{a as h}from"./chunk.DBCWAMJH.js";import{a as m,b as i,c as u,d as c,f}from"./chunk.N2CXUFX7.js";import{c as r}from"./chunk.I36YJ673.js";import{g as t}from"./chunk.OAQCUA7X.js";var $,k=($=navigator.userAgentData)==null?void 0:$.brands.some(d=>d.brand.includes("Chromium")),V=k?!1:navigator.userAgent.includes("Firefox"),e=class extends f{constructor(){super(...arguments);this.formSubmitController=new v(this);this.hasSlotController=new b(this,"help-text","label");this.localize=new y(this);this.hasFocus=!1;this.invalid=!1;this.title="";this.type="text";this.size="medium";this.name="";this.value="";this.defaultValue="";this.filled=!1;this.pill=!1;this.label="";this.helpText="";this.clearable=!1;this.passwordToggle=!1;this.passwordVisible=!1;this.noSpinButtons=!1;this.placeholder="";this.disabled=!1;this.readonly=!1;this.required=!1}get valueAsDate(){var s,a;return(a=(s=this.input)==null?void 0:s.valueAsDate)!=null?a:null}set valueAsDate(s){let a=document.createElement("input");a.type="date",a.valueAsDate=s,this.value=a.value}get valueAsNumber(){var s,a;return(a=(s=this.input)==null?void 0:s.valueAsNumber)!=null?a:parseFloat(this.value)}set valueAsNumber(s){let a=document.createElement("input");a.type="number",a.valueAsNumber=s,this.value=a.value}firstUpdated(){this.invalid=!this.input.checkValidity()}focus(s){this.input.focus(s)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(s,a,o="none"){this.input.setSelectionRange(s,a,o)}setRangeText(s,a,o,n){this.input.setRangeText(s,a,o,n),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){"showPicker"in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}reportValidity(){return this.input.reportValidity()}setCustomValidity(s){this.input.setCustomValidity(s),this.invalid=!this.input.checkValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.emit("sl-change")}handleClearClick(s){this.value="",this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change"),this.input.focus(),s.stopPropagation()}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleStepChange(){this.input.step=String(this.step),this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.emit("sl-input")}handleInvalid(){this.invalid=!0}handleKeyDown(s){let a=s.metaKey||s.ctrlKey||s.shiftKey||s.altKey;s.key==="Enter"&&!a&&setTimeout(()=>{!s.defaultPrevented&&!s.isComposing&&this.formSubmitController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleValueChange(){this.input.value=this.value,this.invalid=!this.input.checkValidity()}render(){let s=this.hasSlotController.test("label"),a=this.hasSlotController.test("help-text"),o=this.label?!0:!!s,n=this.helpText?!0:!!a,C=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return r`
      <div
        part="form-control"
        class=${p({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":o,"form-control--has-help-text":n})}
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
            class=${p({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--invalid":this.invalid,"input--no-spin-buttons":this.noSpinButtons,"input--is-firefox":V})}
          >
            <slot name="prefix" part="prefix" class="input__prefix"></slot>
            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type==="password"&&this.passwordVisible?"text":this.type}
              title=${this.title}
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
              .value=${g(this.value)}
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

            ${C?r`
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
            ${this.passwordToggle&&!this.disabled?r`
                    <button
                      part="password-toggle-button"
                      class="input__password-toggle"
                      type="button"
                      aria-label=${this.localize.term(this.passwordVisible?"hidePassword":"showPassword")}
                      @click=${this.handlePasswordToggle}
                      tabindex="-1"
                    >
                      ${this.passwordVisible?r`
                            <slot name="show-password-icon">
                              <sl-icon name="eye-slash" library="system"></sl-icon>
                            </slot>
                          `:r`
                            <slot name="hide-password-icon">
                              <sl-icon name="eye" library="system"></sl-icon>
                            </slot>
                          `}
                    </button>
                  `:""}

            <slot name="suffix" part="suffix" class="input__suffix"></slot>
          </div>
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${n?"false":"true"}
        >
          ${this.helpText}
        </slot>
        </div>
      </div>
    `}};e.styles=x,t([c(".input__control")],e.prototype,"input",2),t([u()],e.prototype,"hasFocus",2),t([u()],e.prototype,"invalid",2),t([i()],e.prototype,"title",2),t([i({reflect:!0})],e.prototype,"type",2),t([i({reflect:!0})],e.prototype,"size",2),t([i()],e.prototype,"name",2),t([i()],e.prototype,"value",2),t([w()],e.prototype,"defaultValue",2),t([i({type:Boolean,reflect:!0})],e.prototype,"filled",2),t([i({type:Boolean,reflect:!0})],e.prototype,"pill",2),t([i()],e.prototype,"label",2),t([i({attribute:"help-text"})],e.prototype,"helpText",2),t([i({type:Boolean})],e.prototype,"clearable",2),t([i({attribute:"password-toggle",type:Boolean})],e.prototype,"passwordToggle",2),t([i({attribute:"password-visible",type:Boolean})],e.prototype,"passwordVisible",2),t([i({attribute:"no-spin-buttons",type:Boolean})],e.prototype,"noSpinButtons",2),t([i()],e.prototype,"placeholder",2),t([i({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([i({type:Boolean,reflect:!0})],e.prototype,"readonly",2),t([i({type:Number})],e.prototype,"minlength",2),t([i({type:Number})],e.prototype,"maxlength",2),t([i()],e.prototype,"min",2),t([i()],e.prototype,"max",2),t([i()],e.prototype,"step",2),t([i()],e.prototype,"pattern",2),t([i({type:Boolean,reflect:!0})],e.prototype,"required",2),t([i()],e.prototype,"autocapitalize",2),t([i()],e.prototype,"autocorrect",2),t([i()],e.prototype,"autocomplete",2),t([i({type:Boolean})],e.prototype,"autofocus",2),t([i()],e.prototype,"enterkeyhint",2),t([i({type:Boolean})],e.prototype,"spellcheck",2),t([i()],e.prototype,"inputmode",2),t([h("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),t([h("step",{waitUntilFirstUpdate:!0})],e.prototype,"handleStepChange",1),t([h("value",{waitUntilFirstUpdate:!0})],e.prototype,"handleValueChange",1),e=t([m("sl-input")],e);export{e as a};
