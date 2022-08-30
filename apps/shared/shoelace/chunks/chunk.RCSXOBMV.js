import{a as c}from"./chunk.ZEF3NQFV.js";import{a as l,b}from"./chunk.BF5OYBCL.js";import{a as i}from"./chunk.AFO4PD3A.js";import{a as h}from"./chunk.LSNASYMO.js";import{a}from"./chunk.JUX3LFDW.js";import{a as o,b as r,c as d,d as u,f}from"./chunk.X7Q42RGY.js";import{g as s}from"./chunk.OAQCUA7X.js";var e=class extends f{constructor(){super(...arguments);this.hasFocus=!1;this.label="";this.disabled=!1}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}handleBlur(){this.hasFocus=!1,a(this,"sl-blur")}handleFocus(){this.hasFocus=!0,a(this,"sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}render(){let t=!!this.href,n=t?l`a`:l`button`;return b`
      <${n}
        part="base"
        class=${h({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${i(t?void 0:this.disabled)}
        type=${i(t?void 0:"button")}
        href=${i(t?this.href:void 0)}
        target=${i(t?this.target:void 0)}
        download=${i(t?this.download:void 0)}
        rel=${i(t&&this.target?"noreferrer noopener":void 0)}
        role=${i(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${i(this.name)}
          library=${i(this.library)}
          src=${i(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${n}>
    `}};e.styles=c,s([d()],e.prototype,"hasFocus",2),s([u(".icon-button")],e.prototype,"button",2),s([r()],e.prototype,"name",2),s([r()],e.prototype,"library",2),s([r()],e.prototype,"src",2),s([r()],e.prototype,"href",2),s([r()],e.prototype,"target",2),s([r()],e.prototype,"download",2),s([r()],e.prototype,"label",2),s([r({type:Boolean,reflect:!0})],e.prototype,"disabled",2),e=s([o("sl-icon-button")],e);export{e as a};
