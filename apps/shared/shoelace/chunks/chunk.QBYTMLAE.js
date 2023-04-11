import{a as m}from"./chunk.LU3N6SCV.js";import{a as i}from"./chunk.RUACWBWF.js";import{b as o}from"./chunk.7DJRGBBM.js";import{a as s,b as a,g as l}from"./chunk.IKUI3UUK.js";import{c as r}from"./chunk.SYBSOZNG.js";import{e}from"./chunk.I4CX4JT3.js";var t=class extends l{constructor(){super(...arguments);this.localize=new o(this);this.variant="neutral";this.size="medium";this.pill=!1;this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return r`
      <span
        part="base"
        class=${i({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?r`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("remove")}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></sl-icon-button>
            `:""}
      </span>
    `}};t.styles=m,e([a({reflect:!0})],t.prototype,"variant",2),e([a({reflect:!0})],t.prototype,"size",2),e([a({type:Boolean,reflect:!0})],t.prototype,"pill",2),e([a({type:Boolean})],t.prototype,"removable",2),t=e([s("sl-tag")],t);export{t as a};
