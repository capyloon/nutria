import{a as p}from"./chunk.ZLZ62WZD.js";import{a as y}from"./chunk.HXKUB74J.js";import{a as n,b as o}from"./chunk.QNVUJYPN.js";import{c as b}from"./chunk.MJKKE2MR.js";import{a as m}from"./chunk.RHW2XED2.js";import{a as s}from"./chunk.UBF6MLHX.js";import{a as f}from"./chunk.DUQXEIJD.js";import{a as c}from"./chunk.DBCWAMJH.js";import{a as u,b as r,c as l,d,f as h}from"./chunk.N2CXUFX7.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends h{constructor(){super(...arguments);this.formSubmitController=new p(this,{form:i=>{if(i.hasAttribute("form")){let a=i.getRootNode(),g=i.getAttribute("form");return a.getElementById(g)}return i.closest("form")}});this.hasSlotController=new m(this,"[default]","prefix","suffix");this.localize=new b(this);this.hasFocus=!1;this.invalid=!1;this.title="";this.variant="default";this.size="medium";this.caret=!1;this.disabled=!1;this.loading=!1;this.outline=!1;this.pill=!1;this.circle=!1;this.type="button";this.name="";this.value="";this.href=""}firstUpdated(){this.isButton()&&(this.invalid=!this.button.checkValidity())}click(){this.button.click()}focus(i){this.button.focus(i)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(i){this.isButton()&&(this.button.setCustomValidity(i),this.invalid=!this.button.checkValidity())}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(i){if(this.disabled||this.loading){i.preventDefault(),i.stopPropagation();return}this.type==="submit"&&this.formSubmitController.submit(this),this.type==="reset"&&this.formSubmitController.reset(this)}handleDisabledChange(){this.isButton()&&(this.button.disabled=this.disabled,this.invalid=!this.button.checkValidity())}isButton(){return!this.href}isLink(){return!!this.href}render(){let i=this.isLink(),a=i?n`a`:n`button`;return o`
      <${a}
        part="base"
        class=${f({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${s(i?void 0:this.disabled)}
        type=${s(i?void 0:this.type)}
        title=${this.title}
        name=${s(i?void 0:this.name)}
        value=${s(i?void 0:this.value)}
        href=${s(i?this.href:void 0)}
        target=${s(i?this.target:void 0)}
        download=${s(i?this.download:void 0)}
        rel=${s(i&&this.target?"noreferrer noopener":void 0)}
        role=${s(i?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret?o` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?o`<sl-spinner></sl-spinner>`:""}
      </${a}>
    `}};t.styles=y,e([d(".button")],t.prototype,"button",2),e([l()],t.prototype,"hasFocus",2),e([l()],t.prototype,"invalid",2),e([r()],t.prototype,"title",2),e([r({reflect:!0})],t.prototype,"variant",2),e([r({reflect:!0})],t.prototype,"size",2),e([r({type:Boolean,reflect:!0})],t.prototype,"caret",2),e([r({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([r({type:Boolean,reflect:!0})],t.prototype,"loading",2),e([r({type:Boolean,reflect:!0})],t.prototype,"outline",2),e([r({type:Boolean,reflect:!0})],t.prototype,"pill",2),e([r({type:Boolean,reflect:!0})],t.prototype,"circle",2),e([r()],t.prototype,"type",2),e([r()],t.prototype,"name",2),e([r()],t.prototype,"value",2),e([r()],t.prototype,"href",2),e([r()],t.prototype,"target",2),e([r()],t.prototype,"download",2),e([r()],t.prototype,"form",2),e([r({attribute:"formaction"})],t.prototype,"formAction",2),e([r({attribute:"formenctype"})],t.prototype,"formEnctype",2),e([r({attribute:"formmethod"})],t.prototype,"formMethod",2),e([r({attribute:"formnovalidate",type:Boolean})],t.prototype,"formNoValidate",2),e([r({attribute:"formtarget"})],t.prototype,"formTarget",2),e([c("disabled",{waitUntilFirstUpdate:!0})],t.prototype,"handleDisabledChange",1),t=e([u("sl-button")],t);export{t as a};
