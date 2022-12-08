import{a as p}from"./chunk.LEPGJIIT.js";import{a as s}from"./chunk.DUQXEIJD.js";import{a as l}from"./chunk.DBCWAMJH.js";import{a as i,b as r,f as o}from"./chunk.N2CXUFX7.js";import{c as a}from"./chunk.I36YJ673.js";import{g as e}from"./chunk.OAQCUA7X.js";var c=0,t=class extends o{constructor(){super(...arguments);this.attrId=++c;this.componentId=`sl-tab-panel-${this.attrId}`;this.name="";this.active=!1}connectedCallback(){super.connectedCallback(),this.id=this.id.length>0?this.id:this.componentId,this.setAttribute("role","tabpanel")}handleActiveChange(){this.setAttribute("aria-hidden",this.active?"false":"true")}render(){return a`
      <slot
        part="base"
        class=${s({"tab-panel":!0,"tab-panel--active":this.active})}
      ></slot>
    `}};t.styles=p,e([r({reflect:!0})],t.prototype,"name",2),e([r({type:Boolean,reflect:!0})],t.prototype,"active",2),e([l("active")],t.prototype,"handleActiveChange",1),t=e([i("sl-tab-panel")],t);export{t as a};
