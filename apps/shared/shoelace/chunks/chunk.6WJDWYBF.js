import{a as k}from"./chunk.VFY3NKQF.js";import{a as y}from"./chunk.ZLZ62WZD.js";import{a as b}from"./chunk.RHW2XED2.js";import{a as m}from"./chunk.DUQXEIJD.js";import{a as g}from"./chunk.DBCWAMJH.js";import{a as p,b as h,c as d,d as c,f as v}from"./chunk.N2CXUFX7.js";import{c as u}from"./chunk.I36YJ673.js";import{g as a}from"./chunk.OAQCUA7X.js";var o=class extends v{constructor(){super(...arguments);this.formSubmitController=new y(this,{defaultValue:t=>t.defaultValue});this.hasSlotController=new b(this,"help-text","label");this.hasButtonGroup=!1;this.errorMessage="";this.customErrorMessage="";this.defaultValue="";this.invalid=!1;this.label="";this.helpText="";this.name="option";this.value="";this.required=!1}handleValueChange(){this.hasUpdated&&this.updateCheckedRadio()}connectedCallback(){super.connectedCallback(),this.defaultValue=this.value}firstUpdated(){this.invalid=!this.validity.valid}checkValidity(){return this.validity.valid}setCustomValidity(t=""){this.customErrorMessage=t,this.errorMessage=t,t?(this.invalid=!0,this.input.setCustomValidity(t)):this.invalid=!1}get validity(){let t=!(this.value&&this.required||!this.required),e=this.customErrorMessage!=="";return{badInput:!1,customError:e,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!(t||e),valueMissing:!t}}reportValidity(){let t=this.validity;return this.errorMessage=this.customErrorMessage||t.valid?"":this.input.validationMessage,this.invalid=!t.valid,t.valid||this.showNativeErrorMessage(),!this.invalid}getAllRadios(){return[...this.querySelectorAll("sl-radio, sl-radio-button")]}handleRadioClick(t){let e=t.target,l=this.getAllRadios(),i=this.value;e.disabled||(this.value=e.value,l.forEach(r=>r.checked=r===e),this.value!==i&&(this.emit("sl-change"),this.emit("sl-input")))}handleKeyDown(t){var f;if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(t.key))return;let e=this.getAllRadios().filter(n=>!n.disabled),l=(f=e.find(n=>n.checked))!=null?f:e[0],i=t.key===" "?0:["ArrowUp","ArrowLeft"].includes(t.key)?-1:1,r=this.value,s=e.indexOf(l)+i;s<0&&(s=e.length-1),s>e.length-1&&(s=0),this.getAllRadios().forEach(n=>{n.checked=!1,this.hasButtonGroup||(n.tabIndex=-1)}),this.value=e[s].value,e[s].checked=!0,this.hasButtonGroup?e[s].shadowRoot.querySelector("button").focus():(e[s].tabIndex=0,e[s].focus()),this.value!==r&&(this.emit("sl-change"),this.emit("sl-input")),t.preventDefault()}handleLabelClick(){let t=this.getAllRadios(),l=t.find(i=>i.checked)||t[0];l&&l.focus()}handleSlotChange(){var e;let t=this.getAllRadios();if(t.forEach(l=>l.checked=l.value===this.value),this.hasButtonGroup=t.some(l=>l.tagName.toLowerCase()==="sl-radio-button"),!t.some(l=>l.checked))if(this.hasButtonGroup){let l=t[0].shadowRoot.querySelector("button");l.tabIndex=0}else t[0].tabIndex=0;if(this.hasButtonGroup){let l=(e=this.shadowRoot)==null?void 0:e.querySelector("sl-button-group");l&&(l.disableRole=!0)}}showNativeErrorMessage(){this.input.hidden=!1,this.input.reportValidity(),setTimeout(()=>this.input.hidden=!0,1e4)}updateCheckedRadio(){this.getAllRadios().forEach(e=>e.checked=e.value===this.value),this.invalid=!this.validity.valid}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),l=this.label?!0:!!t,i=this.helpText?!0:!!e,r=u`
      <slot
        @click=${this.handleRadioClick}
        @keydown=${this.handleKeyDown}
        @slotchange=${this.handleSlotChange}
        role="presentation"
      ></slot>
    `;return u`
      <fieldset
        part="form-control"
        class=${m({"form-control":!0,"form-control--medium":!0,"form-control--radio-group":!0,"form-control--has-label":l,"form-control--has-help-text":i})}
        role="radiogroup"
        aria-labelledby="label"
        aria-describedby="help-text"
        aria-errormessage="error-message"
      >
        <label
          part="form-control-label"
          id="label"
          class="form-control__label"
          aria-hidden=${l?"false":"true"}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div class="visually-hidden">
            <div id="error-message" aria-live="assertive">${this.errorMessage}</div>
            <label class="radio-group__validation">
              <input
                type="text"
                class="radio-group__validation-input"
                ?required=${this.required}
                tabindex="-1"
                hidden
              />
            </label>
          </div>

          ${this.hasButtonGroup?u`
                <sl-button-group part="button-group" exportparts="base:button-group__base">
                  ${r}
                </sl-button-group>
              `:r}
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${i?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </fieldset>
    `}};o.styles=k,a([c("slot:not([name])")],o.prototype,"defaultSlot",2),a([c(".radio-group__validation-input")],o.prototype,"input",2),a([d()],o.prototype,"hasButtonGroup",2),a([d()],o.prototype,"errorMessage",2),a([d()],o.prototype,"customErrorMessage",2),a([d()],o.prototype,"defaultValue",2),a([d()],o.prototype,"invalid",2),a([h()],o.prototype,"label",2),a([h({attribute:"help-text"})],o.prototype,"helpText",2),a([h()],o.prototype,"name",2),a([h({reflect:!0})],o.prototype,"value",2),a([h({type:Boolean,reflect:!0})],o.prototype,"required",2),a([g("value")],o.prototype,"handleValueChange",1),o=a([p("sl-radio-group")],o);export{o as a};
