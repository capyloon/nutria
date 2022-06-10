import{a as d}from"./chunk.DS4CRFON.js";import{a as b}from"./chunk.RTHY6CYN.js";import{h as n}from"./chunk.RLLTRZYL.js";import{a as r}from"./chunk.PC5WGFOA.js";import{a as c}from"./chunk.V4OMSSO6.js";import{a as i,b as s,d as o}from"./chunk.GVR6SJVE.js";import{c as a,h as l}from"./chunk.7EIHAL55.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends l{constructor(){super(...arguments);this.localize=new n(this);this.attrId=d();this.componentId=`sl-tab-${this.attrId}`;this.panel="";this.active=!1;this.closable=!1;this.disabled=!1}focus(m){this.tab.focus(m)}blur(){this.tab.blur()}handleCloseClick(){c(this,"sl-close")}render(){return this.id=this.id.length>0?this.id:this.componentId,a`
      <div
        part="base"
        class=${r({tab:!0,"tab--active":this.active,"tab--closable":this.closable,"tab--disabled":this.disabled})}
        role="tab"
        aria-disabled=${this.disabled?"true":"false"}
        aria-selected=${this.active?"true":"false"}
        tabindex=${this.disabled||!this.active?"-1":"0"}
      >
        <slot></slot>
        ${this.closable?a`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                name="x"
                library="system"
                label=${this.localize.term("close")}
                class="tab__close-button"
                @click=${this.handleCloseClick}
                tabindex="-1"
              ></sl-icon-button>
            `:""}
      </div>
    `}};t.styles=b,e([o(".tab")],t.prototype,"tab",2),e([s({reflect:!0})],t.prototype,"panel",2),e([s({type:Boolean,reflect:!0})],t.prototype,"active",2),e([s({type:Boolean})],t.prototype,"closable",2),e([s({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([s()],t.prototype,"lang",2),t=e([i("sl-tab")],t);export{t as a};
