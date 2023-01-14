import{a as C}from"./chunk.S6NMUYIP.js";import{b as y}from"./chunk.7DRWJBWU.js";import{a as g}from"./chunk.RHW2XED2.js";import{a as v}from"./chunk.RUACWBWF.js";import{a as f}from"./chunk.AR2QSYXF.js";import{a as m,b as n,c as h,d as c,f as b}from"./chunk.JFPKWAAH.js";import{c as u}from"./chunk.SYBSOZNG.js";import{e as a}from"./chunk.I4CX4JT3.js";var l=class extends b{constructor(){super(...arguments);this.formControlController=new y(this);this.hasSlotController=new g(this,"help-text","label");this.customValidityMessage="";this.hasButtonGroup=!1;this.errorMessage="";this.defaultValue="";this.label="";this.helpText="";this.name="option";this.value="";this.form="";this.required=!1}connectedCallback(){super.connectedCallback(),this.defaultValue=this.value}firstUpdated(){this.formControlController.updateValidity()}getAllRadios(){return[...this.querySelectorAll("sl-radio, sl-radio-button")]}handleRadioClick(t){let e=t.target,o=this.getAllRadios(),r=this.value;e.disabled||(this.value=e.value,o.forEach(s=>s.checked=s===e),this.value!==r&&(this.emit("sl-change"),this.emit("sl-input")))}handleKeyDown(t){var p;if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(t.key))return;let e=this.getAllRadios().filter(d=>!d.disabled),o=(p=e.find(d=>d.checked))!=null?p:e[0],r=t.key===" "?0:["ArrowUp","ArrowLeft"].includes(t.key)?-1:1,s=this.value,i=e.indexOf(o)+r;i<0&&(i=e.length-1),i>e.length-1&&(i=0),this.getAllRadios().forEach(d=>{d.checked=!1,this.hasButtonGroup||(d.tabIndex=-1)}),this.value=e[i].value,e[i].checked=!0,this.hasButtonGroup?e[i].shadowRoot.querySelector("button").focus():(e[i].tabIndex=0,e[i].focus()),this.value!==s&&(this.emit("sl-change"),this.emit("sl-input")),t.preventDefault()}handleLabelClick(){let t=this.getAllRadios(),o=t.find(r=>r.checked)||t[0];o&&o.focus()}handleSlotChange(){var e;let t=this.getAllRadios();if(t.forEach(o=>o.checked=o.value===this.value),this.hasButtonGroup=t.some(o=>o.tagName.toLowerCase()==="sl-radio-button"),!t.some(o=>o.checked))if(this.hasButtonGroup){let o=t[0].shadowRoot.querySelector("button");o.tabIndex=0}else t[0].tabIndex=0;if(this.hasButtonGroup){let o=(e=this.shadowRoot)==null?void 0:e.querySelector("sl-button-group");o&&(o.disableRole=!0)}}updateCheckedRadio(){this.getAllRadios().forEach(e=>e.checked=e.value===this.value),this.formControlController.setValidity(this.checkValidity())}handleValueChange(){this.hasUpdated&&this.updateCheckedRadio()}checkValidity(){let t=this.required&&!this.value,e=this.customValidityMessage!=="";return!(t||e)}setCustomValidity(t=""){this.customValidityMessage=t,this.errorMessage=t,this.validationInput.setCustomValidity(t),this.formControlController.updateValidity()}reportValidity(){let t=this.checkValidity();return this.errorMessage=this.customValidityMessage||t?"":this.validationInput.validationMessage,this.formControlController.setValidity(t),this.validationInput.hidden=!0,clearTimeout(this.validationTimeout),t||(this.validationInput.hidden=!1,this.validationInput.reportValidity(),this.validationTimeout=setTimeout(()=>this.validationInput.hidden=!0,1e4)),t}render(){let t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),o=this.label?!0:!!t,r=this.helpText?!0:!!e,s=u`
      <slot
        @click=${this.handleRadioClick}
        @keydown=${this.handleKeyDown}
        @slotchange=${this.handleSlotChange}
        role="presentation"
      ></slot>
    `;return u`
      <fieldset
        part="form-control"
        class=${v({"form-control":!0,"form-control--medium":!0,"form-control--radio-group":!0,"form-control--has-label":o,"form-control--has-help-text":r})}
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
              />
            </label>
          </div>

          ${this.hasButtonGroup?u`
                <sl-button-group part="button-group" exportparts="base:button-group__base">
                  ${s}
                </sl-button-group>
              `:s}
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${r?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </fieldset>
    `}};l.styles=C,a([c("slot:not([name])")],l.prototype,"defaultSlot",2),a([c(".radio-group__validation-input")],l.prototype,"validationInput",2),a([h()],l.prototype,"hasButtonGroup",2),a([h()],l.prototype,"errorMessage",2),a([h()],l.prototype,"defaultValue",2),a([n()],l.prototype,"label",2),a([n({attribute:"help-text"})],l.prototype,"helpText",2),a([n()],l.prototype,"name",2),a([n({reflect:!0})],l.prototype,"value",2),a([n({reflect:!0})],l.prototype,"form",2),a([n({type:Boolean,reflect:!0})],l.prototype,"required",2),a([f("value")],l.prototype,"handleValueChange",1),l=a([m("sl-radio-group")],l);export{l as a};
