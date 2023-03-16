import{a as f}from"./chunk.OJYUEA53.js";import{a as p}from"./chunk.YY5A5RUI.js";import{a as m}from"./chunk.3HZVBDU4.js";import{b as c}from"./chunk.LS63UDWI.js";import{a as u}from"./chunk.NUWDNXKI.js";import{a as d}from"./chunk.RUACWBWF.js";import{a as s}from"./chunk.AR2QSYXF.js";import{a as r,b as l,c as a,e as o,g as h}from"./chunk.IKUI3UUK.js";import{c as n}from"./chunk.SYBSOZNG.js";import{e as i}from"./chunk.I4CX4JT3.js";var e=class extends h{constructor(){super(...arguments);this.formControlController=new c(this,{value:t=>t.checked?t.value||"on":void 0,defaultValue:t=>t.defaultChecked,setValue:(t,k)=>t.checked=k});this.hasFocus=!1;this.title="";this.name="";this.size="medium";this.disabled=!1;this.checked=!1;this.defaultChecked=!1;this.form="";this.required=!1}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleClick(){this.checked=!this.checked,this.emit("sl-change")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleKeyDown(t){t.key==="ArrowLeft"&&(t.preventDefault(),this.checked=!1,this.emit("sl-change"),this.emit("sl-input")),t.key==="ArrowRight"&&(t.preventDefault(),this.checked=!0,this.emit("sl-change"),this.emit("sl-input"))}handleCheckedChange(){this.input.checked=this.checked,this.formControlController.updateValidity()}handleDisabledChange(){this.formControlController.setValidity(!0)}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){return n`
      <label
        part="base"
        class=${d({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled,"switch--focused":this.hasFocus,"switch--small":this.size==="small","switch--medium":this.size==="medium","switch--large":this.size==="large"})}
      >
        <input
          class="switch__input"
          type="checkbox"
          title=${this.title}
          name=${this.name}
          value=${u(this.value)}
          .checked=${p(this.checked)}
          .disabled=${this.disabled}
          .required=${this.required}
          role="switch"
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @input=${this.handleInput}
          @invalid=${this.handleInvalid}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @keydown=${this.handleKeyDown}
        />

        <span part="control" class="switch__control">
          <span part="thumb" class="switch__thumb"></span>
        </span>

        <slot part="label" class="switch__label"></slot>
      </label>
    `}};e.styles=f,i([o('input[type="checkbox"]')],e.prototype,"input",2),i([a()],e.prototype,"hasFocus",2),i([l()],e.prototype,"title",2),i([l()],e.prototype,"name",2),i([l()],e.prototype,"value",2),i([l({reflect:!0})],e.prototype,"size",2),i([l({type:Boolean,reflect:!0})],e.prototype,"disabled",2),i([l({type:Boolean,reflect:!0})],e.prototype,"checked",2),i([m("checked")],e.prototype,"defaultChecked",2),i([l({reflect:!0})],e.prototype,"form",2),i([l({type:Boolean,reflect:!0})],e.prototype,"required",2),i([s("checked",{waitUntilFirstUpdate:!0})],e.prototype,"handleCheckedChange",1),i([s("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),e=i([r("sl-switch")],e);export{e as a};
