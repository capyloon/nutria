import{a as c}from"./chunk.ASEDKHU4.js";import{a as p}from"./chunk.DS4CRFON.js";import{a as o}from"./chunk.LSNASYMO.js";import{a as l}from"./chunk.DBCWAMJH.js";import{a as i,b as r,f as s}from"./chunk.X7Q42RGY.js";import{c as a}from"./chunk.3G4FHXSN.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends s{constructor(){super(...arguments);this.attrId=p();this.componentId=`sl-tab-panel-${this.attrId}`;this.name="";this.active=!1}connectedCallback(){super.connectedCallback(),this.id=this.id.length>0?this.id:this.componentId,this.setAttribute("role","tabpanel")}handleActiveChange(){this.setAttribute("aria-hidden",this.active?"false":"true")}render(){return a`
      <div
        part="base"
        class=${o({"tab-panel":!0,"tab-panel--active":this.active})}
      >
        <slot></slot>
      </div>
    `}};t.styles=c,e([r({reflect:!0})],t.prototype,"name",2),e([r({type:Boolean,reflect:!0})],t.prototype,"active",2),e([l("active")],t.prototype,"handleActiveChange",1),t=e([i("sl-tab-panel")],t);export{t as a};
