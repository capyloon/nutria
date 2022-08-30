import{a as y}from"./chunk.YRHFVYUE.js";import{a as b}from"./chunk.S2WOXQYM.js";import{a as p}from"./chunk.LSNASYMO.js";import{a as v}from"./chunk.DBCWAMJH.js";import{a as m}from"./chunk.JUX3LFDW.js";import{a as f,b as o,c as d,d as h,f as g}from"./chunk.X7Q42RGY.js";import{c as u}from"./chunk.3G4FHXSN.js";import{g as i}from"./chunk.OAQCUA7X.js";var a=class extends g{constructor(){super(...arguments);this.formSubmitController=new b(this,{defaultValue:e=>e.defaultValue});this.hasButtonGroup=!1;this.errorMessage="";this.customErrorMessage="";this.defaultValue="";this.label="";this.value="";this.name="option";this.invalid=!1;this.fieldset=!1;this.required=!1}handleValueChange(){this.hasUpdated&&(m(this,"sl-change"),this.updateCheckedRadio())}connectedCallback(){super.connectedCallback(),this.defaultValue=this.value}setCustomValidity(e=""){this.customErrorMessage=e,this.errorMessage=e,e?(this.invalid=!0,this.input.setCustomValidity(e)):this.invalid=!1}get validity(){let e=!(this.value&&this.required||!this.required),t=this.customErrorMessage!=="";return{badInput:!1,customError:t,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!(e||t),valueMissing:!e}}reportValidity(){let e=this.validity;return this.errorMessage=this.customErrorMessage||e.valid?"":this.input.validationMessage,this.invalid=!e.valid,e.valid||this.showNativeErrorMessage(),!this.invalid}getAllRadios(){return[...this.querySelectorAll("sl-radio, sl-radio-button")]}handleRadioClick(e){let t=e.target;if(t.disabled)return;this.value=t.value,this.getAllRadios().forEach(n=>n.checked=n===t)}handleKeyDown(e){var c;if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))return;let t=this.getAllRadios().filter(l=>!l.disabled),r=(c=t.find(l=>l.checked))!=null?c:t[0],n=e.key===" "?0:["ArrowUp","ArrowLeft"].includes(e.key)?-1:1,s=t.indexOf(r)+n;s<0&&(s=t.length-1),s>t.length-1&&(s=0),this.getAllRadios().forEach(l=>{l.checked=!1,this.hasButtonGroup||(l.tabIndex=-1)}),this.value=t[s].value,t[s].checked=!0,this.hasButtonGroup?t[s].shadowRoot.querySelector("button").focus():(t[s].tabIndex=0,t[s].focus()),e.preventDefault()}handleSlotChange(){var t;let e=this.getAllRadios();if(e.forEach(r=>r.checked=r.value===this.value),this.hasButtonGroup=e.some(r=>r.tagName.toLowerCase()==="sl-radio-button"),!e.some(r=>r.checked))if(this.hasButtonGroup){let r=e[0].shadowRoot.querySelector("button");r.tabIndex=0}else e[0].tabIndex=0;if(this.hasButtonGroup){let r=(t=this.shadowRoot)==null?void 0:t.querySelector("sl-button-group");r&&(r.disableRole=!0)}}showNativeErrorMessage(){this.input.hidden=!1,this.input.reportValidity(),setTimeout(()=>this.input.hidden=!0,1e4)}updateCheckedRadio(){this.getAllRadios().forEach(t=>t.checked=t.value===this.value)}render(){let e=u`
      <slot
        @click=${this.handleRadioClick}
        @keydown=${this.handleKeyDown}
        @slotchange=${this.handleSlotChange}
        role="presentation"
      ></slot>
    `;return u`
      <fieldset
        part="base"
        role="radiogroup"
        aria-errormessage="radio-error-message"
        aria-invalid="${this.invalid}"
        class=${p({"radio-group":!0,"radio-group--has-fieldset":this.fieldset,"radio-group--required":this.required})}
      >
        <legend part="label" class="radio-group__label">
          <slot name="label">${this.label}</slot>
        </legend>
        <div class="visually-hidden">
          <div id="radio-error-message" aria-live="assertive">${this.errorMessage}</div>
          <label class="radio-group__validation visually-hidden">
            <input type="text" class="radio-group__validation-input" ?required=${this.required} tabindex="-1" hidden />
          </label>
        </div>
        ${this.hasButtonGroup?u`<sl-button-group part="button-group">${e}</sl-button-group>`:e}
      </fieldset>
    `}};a.styles=y,i([h("slot:not([name])")],a.prototype,"defaultSlot",2),i([h(".radio-group__validation-input")],a.prototype,"input",2),i([d()],a.prototype,"hasButtonGroup",2),i([d()],a.prototype,"errorMessage",2),i([d()],a.prototype,"customErrorMessage",2),i([d()],a.prototype,"defaultValue",2),i([o()],a.prototype,"label",2),i([o({reflect:!0})],a.prototype,"value",2),i([o()],a.prototype,"name",2),i([o({type:Boolean,reflect:!0})],a.prototype,"invalid",2),i([o({type:Boolean,attribute:"fieldset",reflect:!0})],a.prototype,"fieldset",2),i([o({type:Boolean,reflect:!0})],a.prototype,"required",2),i([v("value")],a.prototype,"handleValueChange",1),a=i([f("sl-radio-group")],a);export{a};
