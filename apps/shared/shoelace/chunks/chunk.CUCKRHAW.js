import{a as f}from"./chunk.E3V2GR43.js";import{b as c}from"./chunk.BF5OYBCL.js";import{a as h}from"./chunk.RHW2XED2.js";import{a as d}from"./chunk.AFO4PD3A.js";import{a as u}from"./chunk.LSNASYMO.js";import{a as p}from"./chunk.DBCWAMJH.js";import{a as r}from"./chunk.JUX3LFDW.js";import{a as o,b as s,c as l,d as a,f as n}from"./chunk.X7Q42RGY.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends n{constructor(){super(...arguments);this.hasSlotController=new h(this,"[default]","prefix","suffix");this.hasFocus=!1;this.checked=!1;this.disabled=!1;this.size="medium";this.pill=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","presentation")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleBlur(){this.hasFocus=!1,r(this,"sl-blur")}handleClick(i){if(this.disabled){i.preventDefault(),i.stopPropagation();return}this.checked=!0}handleFocus(){this.hasFocus=!0,r(this,"sl-focus")}render(){return c`
      <div part="base" role="presentation">
        <button
          part="button"
          role="radio"
          aria-checked="${this.checked}"
          class=${u({button:!0,"button--default":!0,"button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--checked":this.checked,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--outline":!0,"button--pill":this.pill,"button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
          aria-disabled=${this.disabled}
          type="button"
          value=${d(this.value)}
          tabindex="${this.checked?"0":"-1"}"
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
    `}};t.styles=f,e([a(".button")],t.prototype,"input",2),e([a(".hidden-input")],t.prototype,"hiddenInput",2),e([l()],t.prototype,"hasFocus",2),e([l()],t.prototype,"checked",2),e([s()],t.prototype,"value",2),e([s({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([s({reflect:!0})],t.prototype,"size",2),e([s({type:Boolean,reflect:!0})],t.prototype,"pill",2),e([p("disabled",{waitUntilFirstUpdate:!0})],t.prototype,"handleDisabledChange",1),t=e([o("sl-radio-button")],t);export{t as a};
