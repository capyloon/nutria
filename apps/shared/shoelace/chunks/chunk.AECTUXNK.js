import{a as k}from"./chunk.MGPXS372.js";import{a as f}from"./chunk.IGBRI7DM.js";import{a as m}from"./chunk.MILZEQYZ.js";import{a as p}from"./chunk.S2WOXQYM.js";import{a as r}from"./chunk.AFO4PD3A.js";import{a as u}from"./chunk.LSNASYMO.js";import{a as l}from"./chunk.DBCWAMJH.js";import{a}from"./chunk.JUX3LFDW.js";import{a as c,b as s,c as d,d as o,f as n}from"./chunk.X7Q42RGY.js";import{c as h}from"./chunk.3G4FHXSN.js";import{g as i}from"./chunk.OAQCUA7X.js";var e=class extends n{constructor(){super(...arguments);this.formSubmitController=new p(this,{value:t=>t.checked?t.value:void 0,defaultValue:t=>t.defaultChecked,setValue:(t,b)=>t.checked=b});this.hasFocus=!1;this.disabled=!1;this.required=!1;this.checked=!1;this.invalid=!1;this.defaultChecked=!1}firstUpdated(){this.invalid=!this.input.checkValidity()}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}reportValidity(){return this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.invalid=!this.input.checkValidity()}handleBlur(){this.hasFocus=!1,a(this,"sl-blur")}handleCheckedChange(){this.input.checked=this.checked,this.invalid=!this.input.checkValidity()}handleClick(){this.checked=!this.checked,a(this,"sl-change")}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,a(this,"sl-focus")}handleKeyDown(t){t.key==="ArrowLeft"&&(t.preventDefault(),this.checked=!1,a(this,"sl-change")),t.key==="ArrowRight"&&(t.preventDefault(),this.checked=!0,a(this,"sl-change"))}render(){return h`
      <label
        part="base"
        class=${u({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled,"switch--focused":this.hasFocus})}
      >
        <input
          class="switch__input"
          type="checkbox"
          name=${r(this.name)}
          value=${r(this.value)}
          .checked=${f(this.checked)}
          .disabled=${this.disabled}
          .required=${this.required}
          role="switch"
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @keydown=${this.handleKeyDown}
        />

        <span part="control" class="switch__control">
          <span part="thumb" class="switch__thumb"></span>
        </span>

        <span part="label" class="switch__label">
          <slot></slot>
        </span>
      </label>
    `}};e.styles=k,i([o('input[type="checkbox"]')],e.prototype,"input",2),i([d()],e.prototype,"hasFocus",2),i([s()],e.prototype,"name",2),i([s()],e.prototype,"value",2),i([s({type:Boolean,reflect:!0})],e.prototype,"disabled",2),i([s({type:Boolean,reflect:!0})],e.prototype,"required",2),i([s({type:Boolean,reflect:!0})],e.prototype,"checked",2),i([s({type:Boolean,reflect:!0})],e.prototype,"invalid",2),i([m("checked")],e.prototype,"defaultChecked",2),i([l("checked",{waitUntilFirstUpdate:!0})],e.prototype,"handleCheckedChange",1),i([l("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),e=i([c("sl-switch")],e);export{e as a};
