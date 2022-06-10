import{a as c}from"./chunk.3B5HZ4OZ.js";import{a as o}from"./chunk.PC5WGFOA.js";import{a as m}from"./chunk.OSEV3RCT.js";import{a as t,b as r,c as l}from"./chunk.GVR6SJVE.js";import{c as i,h as s}from"./chunk.7EIHAL55.js";import{g as e}from"./chunk.OAQCUA7X.js";var a=class extends s{constructor(){super(...arguments);this.hasError=!1;this.image="";this.label="";this.initials="";this.shape="circle"}handleImageChange(){this.hasError=!1}render(){return i`
      <div
        part="base"
        class=${o({avatar:!0,"avatar--circle":this.shape==="circle","avatar--rounded":this.shape==="rounded","avatar--square":this.shape==="square"})}
        role="img"
        aria-label=${this.label}
      >
        ${this.initials?i` <div part="initials" class="avatar__initials">${this.initials}</div> `:i`
              <div part="icon" class="avatar__icon" aria-hidden="true">
                <slot name="icon">
                  <sl-icon name="person-fill" library="system"></sl-icon>
                </slot>
              </div>
            `}
        ${this.image&&!this.hasError?i`
              <img
                part="image"
                class="avatar__image"
                src="${this.image}"
                alt=""
                @error="${()=>this.hasError=!0}"
              />
            `:""}
      </div>
    `}};a.styles=c,e([l()],a.prototype,"hasError",2),e([r()],a.prototype,"image",2),e([r()],a.prototype,"label",2),e([r()],a.prototype,"initials",2),e([r({reflect:!0})],a.prototype,"shape",2),e([m("image")],a.prototype,"handleImageChange",1),a=e([t("sl-avatar")],a);export{a};
