import{a as b}from"./chunk.DHPI3ZIP.js";import{a as f}from"./chunk.FOJ445RA.js";import{b as p}from"./chunk.52TP6P7G.js";import{a as c}from"./chunk.RHW2XED2.js";import{a as d}from"./chunk.PC5WGFOA.js";import{a as n}from"./chunk.OSEV3RCT.js";import{a as l}from"./chunk.V4OMSSO6.js";import{a as r}from"./chunk.2XQLLZV4.js";import{a as h,b as s,c as o,d as a}from"./chunk.GVR6SJVE.js";import{h as u}from"./chunk.7EIHAL55.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends u{constructor(){super(...arguments);this.formSubmitController=new f(this,{value:i=>i.checked?i.value:void 0});this.hasSlotController=new c(this,"[default]","prefix","suffix");this.hasFocus=!1;this.disabled=!1;this.checked=!1;this.invalid=!1;this.size="medium";this.pill=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","radio")}click(){this.input.click()}focus(i){this.input.focus(i)}blur(){this.input.blur()}reportValidity(){return this.hiddenInput.reportValidity()}setCustomValidity(i){this.hiddenInput.setCustomValidity(i)}handleBlur(){this.hasFocus=!1,l(this,"sl-blur")}handleClick(){this.disabled||(this.checked=!0)}handleFocus(){this.hasFocus=!0,l(this,"sl-focus")}handleCheckedChange(){this.setAttribute("aria-checked",this.checked?"true":"false"),this.hasUpdated&&l(this,"sl-change")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false"),this.hasUpdated&&(this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity())}render(){return p`
      <div part="base">
        <input class="hidden-input" type="radio" aria-hidden="true" tabindex="-1" />
        <button
          part="button"
          class=${d({button:!0,"button--default":!0,"button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--checked":this.checked,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--outline":!0,"button--pill":this.pill,"button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
          ?disabled=${this.disabled}
          type="button"
          name=${r(this.name)}
          value=${r(this.value)}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @click=${this.handleClick}
        >
          <span part="prefix" class="button__prefix">
            <slot name="prefix"></slot>
          </span>
          <span part="label" class="button__label">
            <slot></slot>
          </span>
          <span part="suffix" class="button__suffix">
            <slot name="suffix"></slot>
          </span>
        </button>
      </div>
    `}};t.styles=b,e([a(".button")],t.prototype,"input",2),e([a(".hidden-input")],t.prototype,"hiddenInput",2),e([o()],t.prototype,"hasFocus",2),e([s()],t.prototype,"name",2),e([s()],t.prototype,"value",2),e([s({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([s({type:Boolean,reflect:!0})],t.prototype,"checked",2),e([s({type:Boolean,reflect:!0})],t.prototype,"invalid",2),e([n("checked")],t.prototype,"handleCheckedChange",1),e([n("disabled",{waitUntilFirstUpdate:!0})],t.prototype,"handleDisabledChange",1),e([s({reflect:!0})],t.prototype,"size",2),e([s({type:Boolean,reflect:!0})],t.prototype,"pill",2),t=e([h("sl-radio-button")],t);export{t as a};
