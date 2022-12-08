import{a as p}from"./chunk.3PM3TH5D.js";import{b as d}from"./chunk.QNVUJYPN.js";import{a as n}from"./chunk.RHW2XED2.js";import{a as c}from"./chunk.UBF6MLHX.js";import{a as o}from"./chunk.DUQXEIJD.js";import{a as h}from"./chunk.DBCWAMJH.js";import{a,b as s,c as i,d as r,f as u}from"./chunk.N2CXUFX7.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends u{constructor(){super(...arguments);this.hasSlotController=new n(this,"[default]","prefix","suffix");this.hasFocus=!1;this.checked=!1;this.disabled=!1;this.size="medium";this.pill=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","presentation")}focus(l){this.input.focus(l)}blur(){this.input.blur()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleClick(l){if(this.disabled){l.preventDefault(),l.stopPropagation();return}this.checked=!0}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}render(){return d`
      <div part="base" role="presentation">
        <button
          part="${`button${this.checked?" button--checked":""}`}"
          role="radio"
          aria-checked="${this.checked}"
          class=${o({button:!0,"button--default":!0,"button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--checked":this.checked,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--outline":!0,"button--pill":this.pill,"button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
          aria-disabled=${this.disabled}
          type="button"
          value=${c(this.value)}
          tabindex="${this.checked?"0":"-1"}"
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @click=${this.handleClick}
        >
          <slot name="prefix" part="prefix" class="button__prefix"></slot>
          <slot part="label" class="button__label"></slot>
          <slot name="suffix" part="suffix" class="button__suffix"></slot>
        </button>
      </div>
    `}};t.styles=p,e([r(".button")],t.prototype,"input",2),e([r(".hidden-input")],t.prototype,"hiddenInput",2),e([i()],t.prototype,"hasFocus",2),e([i()],t.prototype,"checked",2),e([s()],t.prototype,"value",2),e([s({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([s({reflect:!0})],t.prototype,"size",2),e([s({type:Boolean,reflect:!0})],t.prototype,"pill",2),e([h("disabled",{waitUntilFirstUpdate:!0})],t.prototype,"handleDisabledChange",1),t=e([a("sl-radio-button")],t);export{t as a};
