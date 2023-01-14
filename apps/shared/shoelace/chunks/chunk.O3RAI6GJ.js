import{a as d}from"./chunk.EDTQWXPD.js";import{a as c}from"./chunk.RUACWBWF.js";import{c as n}from"./chunk.H6F6UAV4.js";import{a}from"./chunk.AR2QSYXF.js";import{a as i,b as s,d as o,f as r}from"./chunk.JFPKWAAH.js";import{c as l}from"./chunk.SYBSOZNG.js";import{e}from"./chunk.I4CX4JT3.js";var p=0,t=class extends r{constructor(){super(...arguments);this.localize=new n(this);this.attrId=++p;this.componentId=`sl-tab-${this.attrId}`;this.panel="";this.active=!1;this.closable=!1;this.disabled=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tab")}handleCloseClick(){this.emit("sl-close")}handleActiveChange(){this.setAttribute("aria-selected",this.active?"true":"false")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}focus(b){this.tab.focus(b)}blur(){this.tab.blur()}render(){return this.id=this.id.length>0?this.id:this.componentId,l`
      <div
        part="base"
        class=${c({tab:!0,"tab--active":this.active,"tab--closable":this.closable,"tab--disabled":this.disabled})}
        tabindex=${this.disabled?"-1":"0"}
      >
        <slot></slot>
        ${this.closable?l`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("close")}
                class="tab__close-button"
                @click=${this.handleCloseClick}
                tabindex="-1"
              ></sl-icon-button>
            `:""}
      </div>
    `}};t.styles=d,e([o(".tab")],t.prototype,"tab",2),e([s({reflect:!0})],t.prototype,"panel",2),e([s({type:Boolean,reflect:!0})],t.prototype,"active",2),e([s({type:Boolean})],t.prototype,"closable",2),e([s({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([a("active")],t.prototype,"handleActiveChange",1),e([a("disabled")],t.prototype,"handleDisabledChange",1),t=e([i("sl-tab")],t);export{t as a};
