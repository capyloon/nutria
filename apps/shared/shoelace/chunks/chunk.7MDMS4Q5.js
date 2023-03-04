import{a as k}from"./chunk.76FYMSOI.js";import{b,c as C,d as V,e as M}from"./chunk.4XW3OOU6.js";import{a as y}from"./chunk.RHW2XED2.js";import{a as g}from"./chunk.RUACWBWF.js";import{a as f}from"./chunk.AR2QSYXF.js";import{a as p,b as n,c as h,d as c,f as v}from"./chunk.PRU55YXS.js";import{c as u}from"./chunk.SYBSOZNG.js";import{e as l}from"./chunk.I4CX4JT3.js";var i=class extends v{constructor(){super(...arguments);this.formControlController=new b(this);this.hasSlotController=new y(this,"help-text","label");this.customValidityMessage="";this.hasButtonGroup=!1;this.errorMessage="";this.defaultValue="";this.label="";this.helpText="";this.name="option";this.value="";this.form="";this.required=!1}get validity(){let t=this.required&&!this.value;return this.customValidityMessage!==""?M:t?V:C}get validationMessage(){let t=this.required&&!this.value;return this.customValidityMessage!==""?this.customValidityMessage:t?this.validationInput.validationMessage:""}connectedCallback(){super.connectedCallback(),this.defaultValue=this.value}firstUpdated(){this.formControlController.updateValidity()}getAllRadios(){return[...this.querySelectorAll("sl-radio, sl-radio-button")]}handleRadioClick(t){let e=t.target.closest("sl-radio, sl-radio-button"),o=this.getAllRadios(),s=this.value;e.disabled||(this.value=e.value,o.forEach(r=>r.checked=r===e),this.value!==s&&(this.emit("sl-change"),this.emit("sl-input")))}handleKeyDown(t){var m;if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(t.key))return;let e=this.getAllRadios().filter(d=>!d.disabled),o=(m=e.find(d=>d.checked))!=null?m:e[0],s=t.key===" "?0:["ArrowUp","ArrowLeft"].includes(t.key)?-1:1,r=this.value,a=e.indexOf(o)+s;a<0&&(a=e.length-1),a>e.length-1&&(a=0),this.getAllRadios().forEach(d=>{d.checked=!1,this.hasButtonGroup||(d.tabIndex=-1)}),this.value=e[a].value,e[a].checked=!0,this.hasButtonGroup?e[a].shadowRoot.querySelector("button").focus():(e[a].tabIndex=0,e[a].focus()),this.value!==r&&(this.emit("sl-change"),this.emit("sl-input")),t.preventDefault()}handleLabelClick(){let t=this.getAllRadios(),o=t.find(s=>s.checked)||t[0];o&&o.focus()}handleSlotChange(){var e;let t=this.getAllRadios();if(t.forEach(o=>o.checked=o.value===this.value),this.hasButtonGroup=t.some(o=>o.tagName.toLowerCase()==="sl-radio-button"),!t.some(o=>o.checked))if(this.hasButtonGroup){let o=t[0].shadowRoot.querySelector("button");o.tabIndex=0}else t[0].tabIndex=0;if(this.hasButtonGroup){let o=(e=this.shadowRoot)==null?void 0:e.querySelector("sl-button-group");o&&(o.disableRole=!0)}}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}updateCheckedRadio(){this.getAllRadios().forEach(e=>e.checked=e.value===this.value),this.formControlController.setValidity(this.validity.valid)}handleValueChange(){this.hasUpdated&&this.updateCheckedRadio()}checkValidity(){let t=this.required&&!this.value,e=this.customValidityMessage!=="";return t||e?(this.formControlController.emitInvalidEvent(),!1):!0}getForm(){return this.formControlController.getForm()}reportValidity(){let t=this.validity.valid;return this.errorMessage=this.customValidityMessage||t?"":this.validationInput.validationMessage,this.formControlController.setValidity(t),this.validationInput.hidden=!0,clearTimeout(this.validationTimeout),t||(this.validationInput.hidden=!1,this.validationInput.reportValidity(),this.validationTimeout=setTimeout(()=>this.validationInput.hidden=!0,1e4)),t}setCustomValidity(t=""){this.customValidityMessage=t,this.errorMessage=t,this.validationInput.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,s=this.helpText?!0:!!e,r=u`
      <slot
        @click=${this.handleRadioClick}
        @keydown=${this.handleKeyDown}
        @slotchange=${this.handleSlotChange}
        role="presentation"
      ></slot>
    `;return u`
      <fieldset
        part="form-control"
        class=${g({"form-control":!0,"form-control--medium":!0,"form-control--radio-group":!0,"form-control--has-label":o,"form-control--has-help-text":s})}
        role="radiogroup"
        aria-labelledby="label"
        aria-describedby="help-text"
        aria-errormessage="error-message"
      >
        <label
          part="form-control-label"
          id="label"
          class="form-control__label"
          aria-hidden=${o?"false":"true"}
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
                @invalid=${this.handleInvalid}
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
          aria-hidden=${s?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </fieldset>
    `}};i.styles=k,l([c("slot:not([name])")],i.prototype,"defaultSlot",2),l([c(".radio-group__validation-input")],i.prototype,"validationInput",2),l([h()],i.prototype,"hasButtonGroup",2),l([h()],i.prototype,"errorMessage",2),l([h()],i.prototype,"defaultValue",2),l([n()],i.prototype,"label",2),l([n({attribute:"help-text"})],i.prototype,"helpText",2),l([n()],i.prototype,"name",2),l([n({reflect:!0})],i.prototype,"value",2),l([n({reflect:!0})],i.prototype,"form",2),l([n({type:Boolean,reflect:!0})],i.prototype,"required",2),l([f("value")],i.prototype,"handleValueChange",1),i=l([p("sl-radio-group")],i);export{i as a};
