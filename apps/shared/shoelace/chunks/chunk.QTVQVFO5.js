import{a as b}from"./chunk.EDTQWXPD.js";import{b as d}from"./chunk.7DJRGBBM.js";import{a as i}from"./chunk.AR2QSYXF.js";import{a as n}from"./chunk.RUACWBWF.js";import{a as o,b as s,e as r,g as c}from"./chunk.IKUI3UUK.js";import{c as l}from"./chunk.SYBSOZNG.js";import{e}from"./chunk.I4CX4JT3.js";var p=0,t=class extends c{constructor(){super(...arguments);this.localize=new d(this);this.attrId=++p;this.componentId=`sl-tab-${this.attrId}`;this.panel="";this.active=!1;this.closable=!1;this.disabled=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","tab")}handleCloseClick(a){a.stopPropagation(),this.emit("sl-close")}handleActiveChange(){this.setAttribute("aria-selected",this.active?"true":"false")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}focus(a){this.tab.focus(a)}blur(){this.tab.blur()}render(){return this.id=this.id.length>0?this.id:this.componentId,l`
      <div
        part="base"
        class=${n({tab:!0,"tab--active":this.active,"tab--closable":this.closable,"tab--disabled":this.disabled})}
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
    `}};t.styles=b,e([r(".tab")],t.prototype,"tab",2),e([s({reflect:!0})],t.prototype,"panel",2),e([s({type:Boolean,reflect:!0})],t.prototype,"active",2),e([s({type:Boolean})],t.prototype,"closable",2),e([s({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([i("active")],t.prototype,"handleActiveChange",1),e([i("disabled")],t.prototype,"handleDisabledChange",1),t=e([o("sl-tab")],t);export{t as a};
