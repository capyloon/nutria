import{a as l}from"./chunk.LSNASYMO.js";import{a as c}from"./chunk.4XYLWK2N.js";import{a as m}from"./chunk.DBCWAMJH.js";import{a as s,b as i,c as t,f as o}from"./chunk.X7Q42RGY.js";import{c as r}from"./chunk.3G4FHXSN.js";import{g as e}from"./chunk.OAQCUA7X.js";var a=class extends o{constructor(){super(...arguments);this.hasError=!1;this.image="";this.label="";this.initials="";this.shape="circle"}handleImageChange(){this.hasError=!1}render(){return r`
      <div
        part="base"
        class=${l({avatar:!0,"avatar--circle":this.shape==="circle","avatar--rounded":this.shape==="rounded","avatar--square":this.shape==="square"})}
        role="img"
        aria-label=${this.label}
      >
        ${this.initials?r` <div part="initials" class="avatar__initials">${this.initials}</div> `:r`
              <div part="icon" class="avatar__icon" aria-hidden="true">
                <slot name="icon">
                  <sl-icon name="person-fill" library="system"></sl-icon>
                </slot>
              </div>
            `}
        ${this.image&&!this.hasError?r`
              <img
                part="image"
                class="avatar__image"
                src="${this.image}"
                alt=""
                @error="${()=>this.hasError=!0}"
              />
            `:""}
      </div>
    `}};a.styles=c,e([t()],a.prototype,"hasError",2),e([i()],a.prototype,"image",2),e([i()],a.prototype,"label",2),e([i()],a.prototype,"initials",2),e([i({reflect:!0})],a.prototype,"shape",2),e([m("image")],a.prototype,"handleImageChange",1),a=e([s("sl-avatar")],a);export{a};
