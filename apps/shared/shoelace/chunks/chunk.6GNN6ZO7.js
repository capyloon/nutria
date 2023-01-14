import{a as p}from"./chunk.BBBCCCKF.js";import{a as l}from"./chunk.RUACWBWF.js";import{a as s}from"./chunk.AR2QSYXF.js";import{a,b as r,f as o}from"./chunk.JFPKWAAH.js";import{c as i}from"./chunk.SYBSOZNG.js";import{e}from"./chunk.I4CX4JT3.js";var c=0,t=class extends o{constructor(){super(...arguments);this.attrId=++c;this.componentId=`sl-tab-panel-${this.attrId}`;this.name="";this.active=!1}connectedCallback(){super.connectedCallback(),this.id=this.id.length>0?this.id:this.componentId,this.setAttribute("role","tabpanel")}handleActiveChange(){this.setAttribute("aria-hidden",this.active?"false":"true")}render(){return i`
      <slot
        part="base"
        class=${l({"tab-panel":!0,"tab-panel--active":this.active})}
      ></slot>
    `}};t.styles=p,e([r({reflect:!0})],t.prototype,"name",2),e([r({type:Boolean,reflect:!0})],t.prototype,"active",2),e([s("active")],t.prototype,"handleActiveChange",1),t=e([a("sl-tab-panel")],t);export{t as a};
