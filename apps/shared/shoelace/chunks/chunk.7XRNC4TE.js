import{a as f}from"./chunk.RS3IEIJG.js";import{a as p}from"./chunk.DCPKKQHR.js";import{a as m}from"./chunk.M2CI3PIT.js";import{a as u}from"./chunk.ZLZ62WZD.js";import{a as o}from"./chunk.UBF6MLHX.js";import{a as n}from"./chunk.DUQXEIJD.js";import{a}from"./chunk.DBCWAMJH.js";import{a as r,b as s,c as l,d as c,f as d}from"./chunk.N2CXUFX7.js";import{c as h}from"./chunk.I36YJ673.js";import{g as i}from"./chunk.OAQCUA7X.js";var e=class extends d{constructor(){super(...arguments);this.formSubmitController=new u(this,{value:t=>t.checked?t.value:void 0,defaultValue:t=>t.defaultChecked,setValue:(t,k)=>t.checked=k});this.hasFocus=!1;this.invalid=!1;this.title="";this.name="";this.disabled=!1;this.required=!1;this.checked=!1;this.defaultChecked=!1}firstUpdated(){this.invalid=!this.input.checkValidity()}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}checkValidity(){return this.input.checkValidity()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.invalid=!this.input.checkValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleCheckedChange(){this.input.checked=this.checked,this.invalid=!this.input.checkValidity()}handleClick(){this.checked=!this.checked,this.emit("sl-change")}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleKeyDown(t){t.key==="ArrowLeft"&&(t.preventDefault(),this.checked=!1,this.emit("sl-change"),this.emit("sl-input")),t.key==="ArrowRight"&&(t.preventDefault(),this.checked=!0,this.emit("sl-change"),this.emit("sl-input"))}render(){return h`
      <label
        part="base"
        class=${n({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled,"switch--focused":this.hasFocus})}
      >
        <input
          class="switch__input"
          type="checkbox"
          title=${this.title}
          name=${this.name}
          value=${o(this.value)}
          .checked=${p(this.checked)}
          .disabled=${this.disabled}
          .required=${this.required}
          role="switch"
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @input=${this.handleInput}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @keydown=${this.handleKeyDown}
        />

        <span part="control" class="switch__control">
          <span part="thumb" class="switch__thumb"></span>
        </span>

        <slot part="label" class="switch__label"></slot>
      </label>
    `}};e.styles=f,i([c('input[type="checkbox"]')],e.prototype,"input",2),i([l()],e.prototype,"hasFocus",2),i([l()],e.prototype,"invalid",2),i([s()],e.prototype,"title",2),i([s()],e.prototype,"name",2),i([s()],e.prototype,"value",2),i([s({type:Boolean,reflect:!0})],e.prototype,"disabled",2),i([s({type:Boolean,reflect:!0})],e.prototype,"required",2),i([s({type:Boolean,reflect:!0})],e.prototype,"checked",2),i([m("checked")],e.prototype,"defaultChecked",2),i([a("checked",{waitUntilFirstUpdate:!0})],e.prototype,"handleCheckedChange",1),i([a("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),e=i([r("sl-switch")],e);export{e as a};
