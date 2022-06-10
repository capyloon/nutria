import{a as o}from"./chunk.7JG5Q52A.js";import{a as l}from"./chunk.DS4CRFON.js";import{a as i,b as a}from"./chunk.GVR6SJVE.js";import{c as r,h as s}from"./chunk.7EIHAL55.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends s{constructor(){super(...arguments);this.attrId=l();this.componentId=`sl-tab-panel-${this.attrId}`;this.name="";this.active=!1}connectedCallback(){super.connectedCallback(),this.id=this.id.length>0?this.id:this.componentId}render(){return this.style.display=this.active?"block":"none",r`
      <div part="base" class="tab-panel" role="tabpanel" aria-hidden=${this.active?"false":"true"}>
        <slot></slot>
      </div>
    `}};t.styles=o,e([a({reflect:!0})],t.prototype,"name",2),e([a({type:Boolean,reflect:!0})],t.prototype,"active",2),t=e([i("sl-tab-panel")],t);export{t as a};
