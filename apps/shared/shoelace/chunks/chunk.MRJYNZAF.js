import{a as m}from"./chunk.YUG37NT3.js";import{h as o}from"./chunk.RLLTRZYL.js";import{a as l}from"./chunk.PC5WGFOA.js";import{a as n}from"./chunk.V4OMSSO6.js";import{a as i,b as a}from"./chunk.GVR6SJVE.js";import{c as r,h as s}from"./chunk.7EIHAL55.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends s{constructor(){super(...arguments);this.localize=new o(this);this.variant="neutral";this.size="medium";this.pill=!1;this.removable=!1}handleRemoveClick(){n(this,"sl-remove")}render(){return r`
      <span
        part="base"
        class=${l({tag:!0,"tag--primary":this.variant==="primary","tag--success":this.variant==="success","tag--neutral":this.variant==="neutral","tag--warning":this.variant==="warning","tag--danger":this.variant==="danger","tag--text":this.variant==="text","tag--small":this.size==="small","tag--medium":this.size==="medium","tag--large":this.size==="large","tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <span part="content" class="tag__content">
          <slot></slot>
        </span>

        ${this.removable?r`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x"
                library="system"
                label=${this.localize.term("remove")}
                class="tag__remove"
                @click=${this.handleRemoveClick}
              ></sl-icon-button>
            `:""}
      </span>
    `}};t.styles=m,e([a({reflect:!0})],t.prototype,"variant",2),e([a({reflect:!0})],t.prototype,"size",2),e([a({type:Boolean,reflect:!0})],t.prototype,"pill",2),e([a({type:Boolean})],t.prototype,"removable",2),t=e([i("sl-tag")],t);export{t as a};
