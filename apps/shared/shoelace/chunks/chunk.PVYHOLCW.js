import{a as n}from"./chunk.DCPKKQHR.js";import{a as m}from"./chunk.M2CI3PIT.js";import{a as f}from"./chunk.CCCYCAHU.js";import{a as p}from"./chunk.ZLZ62WZD.js";import{a as u}from"./chunk.UBF6MLHX.js";import{a as d}from"./chunk.DUQXEIJD.js";import{a as l}from"./chunk.DBCWAMJH.js";import{a as c,b as s,c as r,d as h,f as o}from"./chunk.N2CXUFX7.js";import{c as a}from"./chunk.I36YJ673.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends o{constructor(){super(...arguments);this.formSubmitController=new p(this,{value:i=>i.checked?i.value||"on":void 0,defaultValue:i=>i.defaultChecked,setValue:(i,k)=>i.checked=k});this.hasFocus=!1;this.invalid=!1;this.title="";this.name="";this.disabled=!1;this.required=!1;this.checked=!1;this.indeterminate=!1;this.defaultChecked=!1}firstUpdated(){this.invalid=!this.input.checkValidity()}click(){this.input.click()}focus(i){this.input.focus(i)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}reportValidity(){return this.input.reportValidity()}setCustomValidity(i){this.input.setCustomValidity(i),this.invalid=!this.input.checkValidity()}handleClick(){this.checked=!this.checked,this.indeterminate=!1,this.emit("sl-change")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleStateChange(){this.input.checked=this.checked,this.input.indeterminate=this.indeterminate,this.invalid=!this.input.checkValidity()}render(){return a`
      <label
        part="base"
        class=${d({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate})}
      >
        <input
          class="checkbox__input"
          type="checkbox"
          title=${this.title}
          name=${this.name}
          value=${u(this.value)}
          .indeterminate=${n(this.indeterminate)}
          .checked=${n(this.checked)}
          .disabled=${this.disabled}
          .required=${this.required}
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @input=${this.handleInput}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
        />

        <span part="control" class="checkbox__control">
          ${this.checked?a` <sl-icon part="checked-icon" library="system" name="check"></sl-icon> `:""}
          ${!this.checked&&this.indeterminate?a` <sl-icon part="indeterminate-icon" library="system" name="indeterminate"></sl-icon> `:""}
        </span>

        <slot part="label" class="checkbox__label"></slot>
      </label>
    `}};e.styles=f,t([h('input[type="checkbox"]')],e.prototype,"input",2),t([r()],e.prototype,"hasFocus",2),t([r()],e.prototype,"invalid",2),t([s()],e.prototype,"title",2),t([s()],e.prototype,"name",2),t([s()],e.prototype,"value",2),t([s({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([s({type:Boolean,reflect:!0})],e.prototype,"required",2),t([s({type:Boolean,reflect:!0})],e.prototype,"checked",2),t([s({type:Boolean,reflect:!0})],e.prototype,"indeterminate",2),t([m("checked")],e.prototype,"defaultChecked",2),t([l("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),t([l("checked",{waitUntilFirstUpdate:!0}),l("indeterminate",{waitUntilFirstUpdate:!0})],e.prototype,"handleStateChange",1),e=t([c("sl-checkbox")],e);export{e as a};
