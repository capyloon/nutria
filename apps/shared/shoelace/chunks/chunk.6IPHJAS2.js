import{b}from"./chunk.7DRWJBWU.js";import{a as y}from"./chunk.LTYGHALI.js";import{a as n,b as a}from"./chunk.EPWZSCI7.js";import{a as c}from"./chunk.RHW2XED2.js";import{a as s}from"./chunk.NUWDNXKI.js";import{a as m}from"./chunk.RUACWBWF.js";import{c as p}from"./chunk.H6F6UAV4.js";import{a as d}from"./chunk.AR2QSYXF.js";import{a as u,b as i,c as l,d as f,f as h}from"./chunk.JFPKWAAH.js";import{e}from"./chunk.I4CX4JT3.js";var t=class extends h{constructor(){super(...arguments);this.formControlController=new b(this,{form:r=>{if(r.hasAttribute("form")){let o=r.getRootNode(),g=r.getAttribute("form");return o.getElementById(g)}return r.closest("form")}});this.hasSlotController=new c(this,"[default]","prefix","suffix");this.localize=new p(this);this.hasFocus=!1;this.invalid=!1;this.title="";this.variant="default";this.size="medium";this.caret=!1;this.disabled=!1;this.loading=!1;this.outline=!1;this.pill=!1;this.circle=!1;this.type="button";this.name="";this.value="";this.href=""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(r){if(this.disabled||this.loading){r.preventDefault(),r.stopPropagation();return}this.type==="submit"&&this.formControlController.submit(this),this.type==="reset"&&this.formControlController.reset(this)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}click(){this.button.click()}focus(r){this.button.focus(r)}blur(){this.button.blur()}checkValidity(){return this.isButton()?this.button.checkValidity():!0}reportValidity(){return this.isButton()?this.button.reportValidity():!0}setCustomValidity(r){this.isButton()&&(this.button.setCustomValidity(r),this.formControlController.updateValidity())}render(){let r=this.isLink(),o=r?n`a`:n`button`;return a`
      <${o}
        part="base"
        class=${m({button:!0,"button--default":this.variant==="default","button--primary":this.variant==="primary","button--success":this.variant==="success","button--neutral":this.variant==="neutral","button--warning":this.variant==="warning","button--danger":this.variant==="danger","button--text":this.variant==="text","button--small":this.size==="small","button--medium":this.size==="medium","button--large":this.size==="large","button--caret":this.caret,"button--circle":this.circle,"button--disabled":this.disabled,"button--focused":this.hasFocus,"button--loading":this.loading,"button--standard":!this.outline,"button--outline":this.outline,"button--pill":this.pill,"button--rtl":this.localize.dir()==="rtl","button--has-label":this.hasSlotController.test("[default]"),"button--has-prefix":this.hasSlotController.test("prefix"),"button--has-suffix":this.hasSlotController.test("suffix")})}
        ?disabled=${s(r?void 0:this.disabled)}
        type=${s(r?void 0:this.type)}
        title=${this.title}
        name=${s(r?void 0:this.name)}
        value=${s(r?void 0:this.value)}
        href=${s(r?this.href:void 0)}
        target=${s(r?this.target:void 0)}
        download=${s(r?this.download:void 0)}
        rel=${s(r&&this.target?"noreferrer noopener":void 0)}
        role=${s(r?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret?a` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> `:""}
        ${this.loading?a`<sl-spinner></sl-spinner>`:""}
      </${o}>
    `}};t.styles=y,e([f(".button")],t.prototype,"button",2),e([l()],t.prototype,"hasFocus",2),e([l()],t.prototype,"invalid",2),e([i()],t.prototype,"title",2),e([i({reflect:!0})],t.prototype,"variant",2),e([i({reflect:!0})],t.prototype,"size",2),e([i({type:Boolean,reflect:!0})],t.prototype,"caret",2),e([i({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([i({type:Boolean,reflect:!0})],t.prototype,"loading",2),e([i({type:Boolean,reflect:!0})],t.prototype,"outline",2),e([i({type:Boolean,reflect:!0})],t.prototype,"pill",2),e([i({type:Boolean,reflect:!0})],t.prototype,"circle",2),e([i()],t.prototype,"type",2),e([i()],t.prototype,"name",2),e([i()],t.prototype,"value",2),e([i()],t.prototype,"href",2),e([i()],t.prototype,"target",2),e([i()],t.prototype,"download",2),e([i()],t.prototype,"form",2),e([i({attribute:"formaction"})],t.prototype,"formAction",2),e([i({attribute:"formenctype"})],t.prototype,"formEnctype",2),e([i({attribute:"formmethod"})],t.prototype,"formMethod",2),e([i({attribute:"formnovalidate",type:Boolean})],t.prototype,"formNoValidate",2),e([i({attribute:"formtarget"})],t.prototype,"formTarget",2),e([d("disabled",{waitUntilFirstUpdate:!0})],t.prototype,"handleDisabledChange",1),t=e([u("sl-button")],t);export{t as a};
