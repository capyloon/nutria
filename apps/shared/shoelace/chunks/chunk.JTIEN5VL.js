import{a as b}from"./chunk.DS4CRFON.js";import{a as m}from"./chunk.KESXMU63.js";import{c as d}from"./chunk.ISLNSUAB.js";import{a as r}from"./chunk.LSNASYMO.js";import{a as l}from"./chunk.DBCWAMJH.js";import{a as c}from"./chunk.JUX3LFDW.js";import{a as i,b as s,d as o,f as n}from"./chunk.X7Q42RGY.js";import{c as a}from"./chunk.3G4FHXSN.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends n{constructor(){super(...arguments);this.localize=new d(this);this.attrId=b();this.componentId=`sl-tab-${this.attrId}`;this.panel="";this.active=!1;this.closable=!1;this.disabled=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tab")}focus(p){this.tab.focus(p)}blur(){this.tab.blur()}handleCloseClick(){c(this,"sl-close")}handleActiveChange(){this.setAttribute("aria-selected",this.active?"true":"false")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}render(){return this.id=this.id.length>0?this.id:this.componentId,a`
      <div
        part="base"
        class=${r({tab:!0,"tab--active":this.active,"tab--closable":this.closable,"tab--disabled":this.disabled})}
        tabindex=${this.disabled?"-1":"0"}
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
    `}};t.styles=m,e([o(".tab")],t.prototype,"tab",2),e([s({reflect:!0})],t.prototype,"panel",2),e([s({type:Boolean,reflect:!0})],t.prototype,"active",2),e([s({type:Boolean})],t.prototype,"closable",2),e([s({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([l("active")],t.prototype,"handleActiveChange",1),e([l("disabled")],t.prototype,"handleDisabledChange",1),t=e([i("sl-tab")],t);export{t as a};
