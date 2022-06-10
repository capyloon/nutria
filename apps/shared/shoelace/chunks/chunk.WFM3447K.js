import{a as c}from"./chunk.2DISV4V2.js";import{a,b as f}from"./chunk.52TP6P7G.js";import{a as b}from"./chunk.PC5WGFOA.js";import{a as l}from"./chunk.V4OMSSO6.js";import{a as i}from"./chunk.2XQLLZV4.js";import{a as o,b as r,c as h,d as u}from"./chunk.GVR6SJVE.js";import{h as d}from"./chunk.7EIHAL55.js";import{g as s}from"./chunk.OAQCUA7X.js";var e=class extends d{constructor(){super(...arguments);this.hasFocus=!1;this.label="";this.disabled=!1}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}handleBlur(){this.hasFocus=!1,l(this,"sl-blur")}handleFocus(){this.hasFocus=!0,l(this,"sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}render(){let t=!!this.href,n=t?a`a`:a`button`;return f`
      <${n}
        part="base"
        class=${b({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
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
    `}};e.styles=c,s([h()],e.prototype,"hasFocus",2),s([u(".icon-button")],e.prototype,"button",2),s([r()],e.prototype,"name",2),s([r()],e.prototype,"library",2),s([r()],e.prototype,"src",2),s([r()],e.prototype,"href",2),s([r()],e.prototype,"target",2),s([r()],e.prototype,"download",2),s([r()],e.prototype,"label",2),s([r({type:Boolean,reflect:!0})],e.prototype,"disabled",2),e=s([o("sl-icon-button")],e);export{e as a};
