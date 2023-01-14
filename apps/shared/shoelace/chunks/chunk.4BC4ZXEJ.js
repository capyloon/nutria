import{a}from"./chunk.YY5A5RUI.js";import{a as p}from"./chunk.3HZVBDU4.js";import{a as f}from"./chunk.GJYRJJBA.js";import{b as u}from"./chunk.7DRWJBWU.js";import{a as m}from"./chunk.NUWDNXKI.js";import{a as d}from"./chunk.RUACWBWF.js";import{a as r}from"./chunk.AR2QSYXF.js";import{a as c,b as s,c as n,d as o,f as h}from"./chunk.JFPKWAAH.js";import{c as l}from"./chunk.SYBSOZNG.js";import{e as t}from"./chunk.I4CX4JT3.js";var e=class extends h{constructor(){super(...arguments);this.formControlController=new u(this,{value:i=>i.checked?i.value||"on":void 0,defaultValue:i=>i.defaultChecked,setValue:(i,k)=>i.checked=k});this.hasFocus=!1;this.title="";this.name="";this.size="medium";this.disabled=!1;this.checked=!1;this.indeterminate=!1;this.defaultChecked=!1;this.form="";this.required=!1}firstUpdated(){this.formControlController.updateValidity()}handleClick(){this.checked=!this.checked,this.indeterminate=!1,this.emit("sl-change")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStateChange(){this.input.checked=this.checked,this.input.indeterminate=this.indeterminate,this.formControlController.updateValidity()}click(){this.input.click()}focus(i){this.input.focus(i)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}reportValidity(){return this.input.reportValidity()}setCustomValidity(i){this.input.setCustomValidity(i),this.formControlController.updateValidity()}render(){return l`
      <label
        part="base"
        class=${d({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate,"checkbox--small":this.size==="small","checkbox--medium":this.size==="medium","checkbox--large":this.size==="large"})}
      >
        <input
          class="checkbox__input"
          type="checkbox"
          title=${this.title}
          name=${this.name}
          value=${m(this.value)}
          .indeterminate=${a(this.indeterminate)}
          .checked=${a(this.checked)}
          .disabled=${this.disabled}
          .required=${this.required}
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @input=${this.handleInput}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
        />

        <span
          part="control${this.checked?" control--checked":""}${this.indeterminate?" control--indeterminate":""}"
          class="checkbox__control"
        >
          ${this.checked?l`
                <sl-icon part="checked-icon" class="checkbox__checked-icon" library="system" name="check"></sl-icon>
              `:""}
          ${!this.checked&&this.indeterminate?l`
                <sl-icon
                  part="indeterminate-icon"
                  class="checkbox__indeterminate-icon"
                  library="system"
                  name="indeterminate"
                ></sl-icon>
              `:""}
        </span>

        <slot part="label" class="checkbox__label"></slot>
      </label>
    `}};e.styles=f,t([o('input[type="checkbox"]')],e.prototype,"input",2),t([n()],e.prototype,"hasFocus",2),t([s()],e.prototype,"title",2),t([s()],e.prototype,"name",2),t([s()],e.prototype,"value",2),t([s({reflect:!0})],e.prototype,"size",2),t([s({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([s({type:Boolean,reflect:!0})],e.prototype,"checked",2),t([s({type:Boolean,reflect:!0})],e.prototype,"indeterminate",2),t([p("checked")],e.prototype,"defaultChecked",2),t([s({reflect:!0})],e.prototype,"form",2),t([s({type:Boolean,reflect:!0})],e.prototype,"required",2),t([r("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),t([r(["checked","indeterminate"],{waitUntilFirstUpdate:!0})],e.prototype,"handleStateChange",1),e=t([c("sl-checkbox")],e);export{e as a};
