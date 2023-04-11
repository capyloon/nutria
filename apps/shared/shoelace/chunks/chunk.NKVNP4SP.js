import{a as c}from"./chunk.7UD5426H.js";import{a as n}from"./chunk.RUACWBWF.js";import{a as o}from"./chunk.AR2QSYXF.js";import{a as s,b as i,c as l,g as m}from"./chunk.IKUI3UUK.js";import{c as r}from"./chunk.SYBSOZNG.js";import{e}from"./chunk.I4CX4JT3.js";var a=class extends m{constructor(){super(...arguments);this.hasError=!1;this.image="";this.label="";this.initials="";this.loading="eager";this.shape="circle"}handleImageChange(){this.hasError=!1}render(){let h=r`
      <img
        part="image"
        class="avatar__image"
        src="${this.image}"
        loading="${this.loading}"
        alt=""
        @error="${()=>this.hasError=!0}"
      />
    `,t=r``;return this.initials?t=r`<div part="initials" class="avatar__initials">${this.initials}</div>`:t=r`
        <slot name="icon" part="icon" class="avatar__icon" aria-hidden="true">
          <sl-icon name="person-fill" library="system"></sl-icon>
        </slot>
      `,r`
      <div
        part="base"
        class=${n({avatar:!0,"avatar--circle":this.shape==="circle","avatar--rounded":this.shape==="rounded","avatar--square":this.shape==="square"})}
        role="img"
        aria-label=${this.label}
      >
        ${this.image&&!this.hasError?h:t}
      </div>
    `}};a.styles=c,e([l()],a.prototype,"hasError",2),e([i()],a.prototype,"image",2),e([i()],a.prototype,"label",2),e([i()],a.prototype,"initials",2),e([i()],a.prototype,"loading",2),e([i({reflect:!0})],a.prototype,"shape",2),e([o("image")],a.prototype,"handleImageChange",1),a=e([s("sl-avatar")],a);export{a};
