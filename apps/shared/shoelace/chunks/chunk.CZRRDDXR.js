import{a as k}from"./chunk.76FYMSOI.js";import{b as y,c as C,d as V,e as M}from"./chunk.PDTEEKIM.js";import{a as b}from"./chunk.RHW2XED2.js";import{a as g}from"./chunk.RUACWBWF.js";import{a as f}from"./chunk.AR2QSYXF.js";import{a as p,b as n,c as h,e as c,g as v}from"./chunk.IKUI3UUK.js";import{c as u}from"./chunk.SYBSOZNG.js";import{e as a}from"./chunk.I4CX4JT3.js";var i=class extends v{constructor(){super(...arguments);this.formControlController=new y(this);this.hasSlotController=new b(this,"help-text","label");this.customValidityMessage="";this.hasButtonGroup=!1;this.errorMessage="";this.defaultValue="";this.label="";this.helpText="";this.name="option";this.value="";this.form="";this.required=!1}get validity(){let t=this.required&&!this.value;return this.customValidityMessage!==""?M:t?V:C}get validationMessage(){let t=this.required&&!this.value;return this.customValidityMessage!==""?this.customValidityMessage:t?this.validationInput.validationMessage:""}connectedCallback(){super.connectedCallback(),this.defaultValue=this.value}firstUpdated(){this.formControlController.updateValidity()}getAllRadios(){return[...this.querySelectorAll("sl-radio, sl-radio-button")]}handleRadioClick(t){let e=t.target.closest("sl-radio, sl-radio-button"),l=this.getAllRadios(),o=this.value;e.disabled||(this.value=e.value,l.forEach(r=>r.checked=r===e),this.value!==o&&(this.emit("sl-change"),this.emit("sl-input")))}handleKeyDown(t){var m;if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(t.key))return;let e=this.getAllRadios().filter(d=>!d.disabled),l=(m=e.find(d=>d.checked))!=null?m:e[0],o=t.key===" "?0:["ArrowUp","ArrowLeft"].includes(t.key)?-1:1,r=this.value,s=e.indexOf(l)+o;s<0&&(s=e.length-1),s>e.length-1&&(s=0),this.getAllRadios().forEach(d=>{d.checked=!1,this.hasButtonGroup||(d.tabIndex=-1)}),this.value=e[s].value,e[s].checked=!0,this.hasButtonGroup?e[s].shadowRoot.querySelector("button").focus():(e[s].tabIndex=0,e[s].focus()),this.value!==r&&(this.emit("sl-change"),this.emit("sl-input")),t.preventDefault()}handleLabelClick(){let t=this.getAllRadios(),l=t.find(o=>o.checked)||t[0];l&&l.focus()}handleSlotChange(){var t,e;if(customElements.get("sl-radio")||customElements.get("sl-radio-button")){let l=this.getAllRadios();if(l.forEach(o=>o.checked=o.value===this.value),this.hasButtonGroup=l.some(o=>o.tagName.toLowerCase()==="sl-radio-button"),!l.some(o=>o.checked))if(this.hasButtonGroup){let o=(t=l[0].shadowRoot)==null?void 0:t.querySelector("button");o&&(o.tabIndex=0)}else l[0].tabIndex=0;if(this.hasButtonGroup){let o=(e=this.shadowRoot)==null?void 0:e.querySelector("sl-button-group");o&&(o.disableRole=!0)}}else customElements.whenDefined("sl-radio").then(()=>this.handleSlotChange()),customElements.whenDefined("sl-radio-button").then(()=>this.handleSlotChange())}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}updateCheckedRadio(){this.getAllRadios().forEach(e=>e.checked=e.value===this.value),this.formControlController.setValidity(this.validity.valid)}handleValueChange(){this.hasUpdated&&this.updateCheckedRadio()}checkValidity(){let t=this.required&&!this.value,e=this.customValidityMessage!=="";return t||e?(this.formControlController.emitInvalidEvent(),!1):!0}getForm(){return this.formControlController.getForm()}reportValidity(){let t=this.validity.valid;return this.errorMessage=this.customValidityMessage||t?"":this.validationInput.validationMessage,this.formControlController.setValidity(t),this.validationInput.hidden=!0,clearTimeout(this.validationTimeout),t||(this.validationInput.hidden=!1,this.validationInput.reportValidity(),this.validationTimeout=setTimeout(()=>this.validationInput.hidden=!0,1e4)),t}setCustomValidity(t=""){this.customValidityMessage=t,this.errorMessage=t,this.validationInput.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),l=this.label?!0:!!t,o=this.helpText?!0:!!e,r=u`
      <slot
        @click=${this.handleRadioClick}
        @keydown=${this.handleKeyDown}
        @slotchange=${this.handleSlotChange}
        role="presentation"
      ></slot>
    `;return u`
      <fieldset
        part="form-control"
        class=${g({"form-control":!0,"form-control--medium":!0,"form-control--radio-group":!0,"form-control--has-label":l,"form-control--has-help-text":o})}
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
          aria-hidden=${o?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </fieldset>
    `}};i.styles=k,a([c("slot:not([name])")],i.prototype,"defaultSlot",2),a([c(".radio-group__validation-input")],i.prototype,"validationInput",2),a([h()],i.prototype,"hasButtonGroup",2),a([h()],i.prototype,"errorMessage",2),a([h()],i.prototype,"defaultValue",2),a([n()],i.prototype,"label",2),a([n({attribute:"help-text"})],i.prototype,"helpText",2),a([n()],i.prototype,"name",2),a([n({reflect:!0})],i.prototype,"value",2),a([n({reflect:!0})],i.prototype,"form",2),a([n({type:Boolean,reflect:!0})],i.prototype,"required",2),a([f("value")],i.prototype,"handleValueChange",1),i=a([p("sl-radio-group")],i);export{i as a};
