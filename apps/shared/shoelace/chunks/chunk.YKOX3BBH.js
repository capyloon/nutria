import{a as w}from"./chunk.7KTQOHJO.js";import{a as C}from"./chunk.YY5A5RUI.js";import{a as g}from"./chunk.3HZVBDU4.js";import{b as v}from"./chunk.7DRWJBWU.js";import{a as b}from"./chunk.RHW2XED2.js";import{a}from"./chunk.NUWDNXKI.js";import{a as p}from"./chunk.RUACWBWF.js";import{c as y}from"./chunk.H6F6UAV4.js";import{a as u}from"./chunk.AR2QSYXF.js";import{a as m,b as i,c as d,d as c,f}from"./chunk.JFPKWAAH.js";import{c as n}from"./chunk.SYBSOZNG.js";import{e as t}from"./chunk.I4CX4JT3.js";var x,V=(x=navigator.userAgentData)==null?void 0:x.brands.some(o=>o.brand.includes("Chromium")),k=V?!1:navigator.userAgent.includes("Firefox"),e=class extends f{constructor(){super(...arguments);this.formControlController=new v(this);this.hasSlotController=new b(this,"help-text","label");this.localize=new y(this);this.hasFocus=!1;this.title="";this.type="text";this.name="";this.value="";this.defaultValue="";this.size="medium";this.filled=!1;this.pill=!1;this.label="";this.helpText="";this.clearable=!1;this.disabled=!1;this.placeholder="";this.readonly=!1;this.passwordToggle=!1;this.passwordVisible=!1;this.noSpinButtons=!1;this.form="";this.required=!1;this.spellcheck=!0}get valueAsDate(){var s,l;return(l=(s=this.input)==null?void 0:s.valueAsDate)!=null?l:null}set valueAsDate(s){let l=document.createElement("input");l.type="date",l.valueAsDate=s,this.value=l.value}get valueAsNumber(){var s,l;return(l=(s=this.input)==null?void 0:s.valueAsNumber)!=null?l:parseFloat(this.value)}set valueAsNumber(s){let l=document.createElement("input");l.type="number",l.valueAsNumber=s,this.value=l.value}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.emit("sl-change")}handleClearClick(s){this.value="",this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change"),this.input.focus(),s.stopPropagation()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.formControlController.updateValidity(),this.emit("sl-input")}handleInvalid(){this.formControlController.setValidity(!1)}handleKeyDown(s){let l=s.metaKey||s.ctrlKey||s.shiftKey||s.altKey;s.key==="Enter"&&!l&&setTimeout(()=>{!s.defaultPrevented&&!s.isComposing&&this.formControlController.submit()})}handlePasswordToggle(){this.passwordVisible=!this.passwordVisible}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStepChange(){this.input.step=String(this.step),this.formControlController.updateValidity()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity()}focus(s){this.input.focus(s)}blur(){this.input.blur()}select(){this.input.select()}setSelectionRange(s,l,r="none"){this.input.setSelectionRange(s,l,r)}setRangeText(s,l,r,h){this.input.setRangeText(s,l,r,h),this.value!==this.input.value&&(this.value=this.input.value)}showPicker(){"showPicker"in HTMLInputElement.prototype&&this.input.showPicker()}stepUp(){this.input.stepUp(),this.value!==this.input.value&&(this.value=this.input.value)}stepDown(){this.input.stepDown(),this.value!==this.input.value&&(this.value=this.input.value)}checkValidity(){return this.input.checkValidity()}reportValidity(){return this.input.reportValidity()}setCustomValidity(s){this.input.setCustomValidity(s),this.formControlController.updateValidity()}render(){let s=this.hasSlotController.test("label"),l=this.hasSlotController.test("help-text"),r=this.label?!0:!!s,h=this.helpText?!0:!!l,$=this.clearable&&!this.disabled&&!this.readonly&&(typeof this.value=="number"||this.value.length>0);return n`
      <div
        part="form-control"
        class=${p({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":r,"form-control--has-help-text":h})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${r?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${p({input:!0,"input--small":this.size==="small","input--medium":this.size==="medium","input--large":this.size==="large","input--pill":this.pill,"input--standard":!this.filled,"input--filled":this.filled,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value,"input--no-spin-buttons":this.noSpinButtons,"input--is-firefox":k})}
          >
            <slot name="prefix" part="prefix" class="input__prefix"></slot>
            <input
              part="input"
              id="input"
              class="input__control"
              type=${this.type==="password"&&this.passwordVisible?"text":this.type}
              title=${this.title}
              name=${a(this.name)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${a(this.placeholder)}
              minlength=${a(this.minlength)}
              maxlength=${a(this.maxlength)}
              min=${a(this.min)}
              max=${a(this.max)}
              step=${a(this.step)}
              .value=${C(this.value)}
              autocapitalize=${a(this.type==="password"?"off":this.autocapitalize)}
              autocomplete=${a(this.type==="password"?"off":this.autocomplete)}
              autocorrect=${a(this.type==="password"?"off":this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${this.spellcheck}
              pattern=${a(this.pattern)}
              enterkeyhint=${a(this.enterkeyhint)}
              inputmode=${a(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @keydown=${this.handleKeyDown}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />

            ${$?n`
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
            ${this.passwordToggle&&!this.disabled?n`
                    <button
                      part="password-toggle-button"
                      class="input__password-toggle"
                      type="button"
                      aria-label=${this.localize.term(this.passwordVisible?"hidePassword":"showPassword")}
                      @click=${this.handlePasswordToggle}
                      tabindex="-1"
                    >
                      ${this.passwordVisible?n`
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

            <slot name="suffix" part="suffix" class="input__suffix"></slot>
          </div>
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${h?"false":"true"}
        >
          ${this.helpText}
        </slot>
        </div>
      </div>
    `}};e.styles=w,t([c(".input__control")],e.prototype,"input",2),t([d()],e.prototype,"hasFocus",2),t([i()],e.prototype,"title",2),t([i({reflect:!0})],e.prototype,"type",2),t([i()],e.prototype,"name",2),t([i()],e.prototype,"value",2),t([g()],e.prototype,"defaultValue",2),t([i({reflect:!0})],e.prototype,"size",2),t([i({type:Boolean,reflect:!0})],e.prototype,"filled",2),t([i({type:Boolean,reflect:!0})],e.prototype,"pill",2),t([i()],e.prototype,"label",2),t([i({attribute:"help-text"})],e.prototype,"helpText",2),t([i({type:Boolean})],e.prototype,"clearable",2),t([i({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([i()],e.prototype,"placeholder",2),t([i({type:Boolean,reflect:!0})],e.prototype,"readonly",2),t([i({attribute:"password-toggle",type:Boolean})],e.prototype,"passwordToggle",2),t([i({attribute:"password-visible",type:Boolean})],e.prototype,"passwordVisible",2),t([i({attribute:"no-spin-buttons",type:Boolean})],e.prototype,"noSpinButtons",2),t([i({reflect:!0})],e.prototype,"form",2),t([i({type:Boolean,reflect:!0})],e.prototype,"required",2),t([i()],e.prototype,"pattern",2),t([i({type:Number})],e.prototype,"minlength",2),t([i({type:Number})],e.prototype,"maxlength",2),t([i({type:Number})],e.prototype,"min",2),t([i({type:Number})],e.prototype,"max",2),t([i()],e.prototype,"step",2),t([i()],e.prototype,"autocapitalize",2),t([i()],e.prototype,"autocorrect",2),t([i()],e.prototype,"autocomplete",2),t([i({type:Boolean})],e.prototype,"autofocus",2),t([i()],e.prototype,"enterkeyhint",2),t([i({type:Boolean,converter:{fromAttribute:o=>!(!o||o==="false"),toAttribute:o=>o?"true":"false"}})],e.prototype,"spellcheck",2),t([i()],e.prototype,"inputmode",2),t([u("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),t([u("step",{waitUntilFirstUpdate:!0})],e.prototype,"handleStepChange",1),t([u("value",{waitUntilFirstUpdate:!0})],e.prototype,"handleValueChange",1),e=t([m("sl-input")],e);export{e as a};
