import{a as n}from"./chunk.VNKMWZPH.js";import{a as l}from"./chunk.DUQXEIJD.js";import{a as m}from"./chunk.DBCWAMJH.js";import{a as s,b as r,c as t,f as o}from"./chunk.N2CXUFX7.js";import{c as i}from"./chunk.I36YJ673.js";import{g as e}from"./chunk.OAQCUA7X.js";var a=class extends o{constructor(){super(...arguments);this.hasError=!1;this.image="";this.label="";this.initials="";this.loading="eager";this.shape="circle"}handleImageChange(){this.hasError=!1}render(){return i`
      <div
        part="base"
        class=${l({avatar:!0,"avatar--circle":this.shape==="circle","avatar--rounded":this.shape==="rounded","avatar--square":this.shape==="square"})}
        role="img"
        aria-label=${this.label}
      >
        ${this.initials?i` <div part="initials" class="avatar__initials">${this.initials}</div> `:i`
              <slot name="icon" part="icon" class="avatar__icon" aria-hidden="true">
                <sl-icon name="person-fill" library="system"></sl-icon>
              </slot>
            `}
        ${this.image&&!this.hasError?i`
              <img
                part="image"
                class="avatar__image"
                src="${this.image}"
                loading="${this.loading}"
                alt=""
                @error="${()=>this.hasError=!0}"
              />
            `:""}
      </div>
    `}};a.styles=n,e([t()],a.prototype,"hasError",2),e([r()],a.prototype,"image",2),e([r()],a.prototype,"label",2),e([r()],a.prototype,"initials",2),e([r()],a.prototype,"loading",2),e([r({reflect:!0})],a.prototype,"shape",2),e([m("image")],a.prototype,"handleImageChange",1),a=e([s("sl-avatar")],a);export{a};
