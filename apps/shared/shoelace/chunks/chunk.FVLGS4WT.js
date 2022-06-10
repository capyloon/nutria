import{a as m}from"./chunk.7S3KZJ2Y.js";import{a as f}from"./chunk.R5UEL6LD.js";import{a as p}from"./chunk.E35DOPAL.js";import{a as l}from"./chunk.2XQLLZV4.js";import{a as u}from"./chunk.PC5WGFOA.js";import{a as r}from"./chunk.OSEV3RCT.js";import{a}from"./chunk.V4OMSSO6.js";import{a as n,b as s,c as d,d as o}from"./chunk.GVR6SJVE.js";import{c as h,h as c}from"./chunk.7EIHAL55.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends c{constructor(){super(...arguments);this.formSubmitController=new p(this,{value:i=>i.checked?i.value:void 0});this.hasFocus=!1;this.disabled=!1;this.required=!1;this.checked=!1;this.invalid=!1}firstUpdated(){this.invalid=!this.input.checkValidity()}click(){this.input.click()}focus(i){this.input.focus(i)}blur(){this.input.blur()}reportValidity(){return this.input.reportValidity()}setCustomValidity(i){this.input.setCustomValidity(i),this.invalid=!this.input.checkValidity()}handleBlur(){this.hasFocus=!1,a(this,"sl-blur")}handleCheckedChange(){this.input.checked=this.checked,this.invalid=!this.input.checkValidity()}handleClick(){this.checked=!this.checked,a(this,"sl-change")}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,a(this,"sl-focus")}handleKeyDown(i){i.key==="ArrowLeft"&&(i.preventDefault(),this.checked=!1,a(this,"sl-change")),i.key==="ArrowRight"&&(i.preventDefault(),this.checked=!0,a(this,"sl-change"))}render(){return h`
      <label
        part="base"
        class=${u({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled,"switch--focused":this.hasFocus})}
      >
        <input
          class="switch__input"
          type="checkbox"
          name=${l(this.name)}
          value=${l(this.value)}
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
    `}};e.styles=m,t([o('input[type="checkbox"]')],e.prototype,"input",2),t([d()],e.prototype,"hasFocus",2),t([s()],e.prototype,"name",2),t([s()],e.prototype,"value",2),t([s({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([s({type:Boolean,reflect:!0})],e.prototype,"required",2),t([s({type:Boolean,reflect:!0})],e.prototype,"checked",2),t([s({type:Boolean,reflect:!0})],e.prototype,"invalid",2),t([r("checked",{waitUntilFirstUpdate:!0})],e.prototype,"handleCheckedChange",1),t([r("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),e=t([n("sl-switch")],e);export{e as a};
