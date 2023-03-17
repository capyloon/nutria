import{a as d}from"./chunk.XRJZBMJR.js";import{b as h}from"./chunk.EPWZSCI7.js";import{a as c}from"./chunk.NUWDNXKI.js";import{a as p}from"./chunk.RHW2XED2.js";import{a as n}from"./chunk.RUACWBWF.js";import{a as o}from"./chunk.AR2QSYXF.js";import{a as r,b as s,c as a,e as i,g as u}from"./chunk.IKUI3UUK.js";import{e}from"./chunk.I4CX4JT3.js";var t=class extends u{constructor(){super(...arguments);this.hasSlotController=new p(this,"[default]","prefix","suffix");this.hasFocus=!1;this.checked=!1;this.disabled=!1;this.size="medium";this.pill=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","presentation")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleClick(l){if(this.disabled){l.preventDefault(),l.stopPropagation();return}this.checked=!0}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}focus(l){this.input.focus(l)}blur(){this.input.blur()}render(){return h`
      <div part="base" role="presentation">
        <button
          part="${`button${this.checked?" button--checked":""}`}"
          role="radio"
          aria-checked="${this.checked}"
          class=${n({button:!0,"button--default":!0,"button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--checked":this.checked,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--outline":!0,"button--pill":this.pill,"button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
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
    `}};t.styles=d,e([i(".button")],t.prototype,"input",2),e([i(".hidden-input")],t.prototype,"hiddenInput",2),e([a()],t.prototype,"hasFocus",2),e([s({type:Boolean,reflect:!0})],t.prototype,"checked",2),e([s()],t.prototype,"value",2),e([s({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([s({reflect:!0})],t.prototype,"size",2),e([s({type:Boolean,reflect:!0})],t.prototype,"pill",2),e([o("disabled",{waitUntilFirstUpdate:!0})],t.prototype,"handleDisabledChange",1),t=e([r("sl-radio-button")],t);export{t as a};
