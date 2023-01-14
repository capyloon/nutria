import{a as f}from"./chunk.ZDWJIEOY.js";import{a,b}from"./chunk.EPWZSCI7.js";import{a as s}from"./chunk.NUWDNXKI.js";import{a as h}from"./chunk.RUACWBWF.js";import{a as n,b as r,c as d,d as o,f as u}from"./chunk.JFPKWAAH.js";import{e as i}from"./chunk.I4CX4JT3.js";var e=class extends u{constructor(){super(...arguments);this.hasFocus=!1;this.label="";this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){let t=!!this.href,l=t?a`a`:a`button`;return b`
      <${l}
        part="base"
        class=${h({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${s(t?void 0:this.disabled)}
        type=${s(t?void 0:"button")}
        href=${s(t?this.href:void 0)}
        target=${s(t?this.target:void 0)}
        download=${s(t?this.download:void 0)}
        rel=${s(t&&this.target?"noreferrer noopener":void 0)}
        role=${s(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${s(this.name)}
          library=${s(this.library)}
          src=${s(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${l}>
    `}};e.styles=f,i([o(".icon-button")],e.prototype,"button",2),i([d()],e.prototype,"hasFocus",2),i([r()],e.prototype,"name",2),i([r()],e.prototype,"library",2),i([r()],e.prototype,"src",2),i([r()],e.prototype,"href",2),i([r()],e.prototype,"target",2),i([r()],e.prototype,"download",2),i([r()],e.prototype,"label",2),i([r({type:Boolean,reflect:!0})],e.prototype,"disabled",2),e=i([n("sl-icon-button")],e);export{e as a};
