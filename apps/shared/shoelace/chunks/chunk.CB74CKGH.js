import{a as g}from"./chunk.AY3CZ3W5.js";import{a as c}from"./chunk.S2WOXQYM.js";import{a as n,b as a}from"./chunk.BF5OYBCL.js";import{c as b}from"./chunk.ISLNSUAB.js";import{a as p}from"./chunk.RHW2XED2.js";import{a as i}from"./chunk.AFO4PD3A.js";import{a as h}from"./chunk.LSNASYMO.js";import{a as l}from"./chunk.JUX3LFDW.js";import{a as u,b as s,c as f,d,f as m}from"./chunk.X7Q42RGY.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends m{constructor(){super(...arguments);this.formSubmitController=new c(this,{form:r=>{if(r.hasAttribute("form")){let o=r.getRootNode(),y=r.getAttribute("form");return o.getElementById(y)}return r.closest("form")}});this.hasSlotController=new p(this,"[default]","prefix","suffix");this.localize=new b(this);this.hasFocus=!1;this.variant="default";this.size="medium";this.caret=!1;this.disabled=!1;this.loading=!1;this.outline=!1;this.pill=!1;this.circle=!1;this.type="button"}click(){this.button.click()}focus(r){this.button.focus(r)}blur(){this.button.blur()}handleBlur(){this.hasFocus=!1,l(this,"sl-blur")}handleFocus(){this.hasFocus=!0,l(this,"sl-focus")}handleClick(r){if(this.disabled||this.loading){r.preventDefault(),r.stopPropagation();return}this.type==="submit"&&this.formSubmitController.submit(this),this.type==="reset"&&this.formSubmitController.reset(this)}render(){let r=!!this.href,o=r?n`a`:n`button`;return a`
      <${o}
        part="base"
        class=${h({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${i(r?void 0:this.disabled)}
        type=${i(r?void 0:this.type)}
        name=${i(r?void 0:this.name)}
        value=${i(r?void 0:this.value)}
        href=${i(r?this.href:void 0)}
        target=${i(r?this.target:void 0)}
        download=${i(r?this.download:void 0)}
        rel=${i(r&&this.target?"noreferrer noopener":void 0)}
        role=${i(r?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        tabindex=${this.disabled?"-1":"0"}
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
        ${this.caret?a`
                <span part="caret" class="button__caret">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              `:""}
        ${this.loading?a`<sl-spinner></sl-spinner>`:""}
      </${o}>
    `}};t.styles=g,e([d(".button")],t.prototype,"button",2),e([f()],t.prototype,"hasFocus",2),e([s({reflect:!0})],t.prototype,"variant",2),e([s({reflect:!0})],t.prototype,"size",2),e([s({type:Boolean,reflect:!0})],t.prototype,"caret",2),e([s({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([s({type:Boolean,reflect:!0})],t.prototype,"loading",2),e([s({type:Boolean,reflect:!0})],t.prototype,"outline",2),e([s({type:Boolean,reflect:!0})],t.prototype,"pill",2),e([s({type:Boolean,reflect:!0})],t.prototype,"circle",2),e([s()],t.prototype,"type",2),e([s()],t.prototype,"name",2),e([s()],t.prototype,"value",2),e([s()],t.prototype,"href",2),e([s()],t.prototype,"target",2),e([s()],t.prototype,"download",2),e([s()],t.prototype,"form",2),e([s({attribute:"formaction"})],t.prototype,"formAction",2),e([s({attribute:"formmethod"})],t.prototype,"formMethod",2),e([s({attribute:"formnovalidate",type:Boolean})],t.prototype,"formNoValidate",2),e([s({attribute:"formtarget"})],t.prototype,"formTarget",2),t=e([u("sl-button")],t);export{t as a};
