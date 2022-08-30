import{a as c}from"./chunk.CEWONPQ7.js";import{c as h}from"./chunk.ISLNSUAB.js";import{a as n,b as m,d as s,f as p}from"./chunk.X7Q42RGY.js";import{c as i}from"./chunk.3G4FHXSN.js";import{g as r}from"./chunk.OAQCUA7X.js";var t=class extends p{constructor(){super(...arguments);this.localize=new h(this);this.separatorDir=this.localize.dir();this.label="Breadcrumb"}getSeparator(){let e=this.separatorSlot.assignedElements({flatten:!0})[0].cloneNode(!0);return[e,...e.querySelectorAll("[id]")].forEach(l=>l.removeAttribute("id")),e.setAttribute("data-default",""),e.slot="separator",e}handleSlotChange(){let a=[...this.defaultSlot.assignedElements({flatten:!0})].filter(e=>e.tagName.toLowerCase()==="sl-breadcrumb-item");a.forEach((e,l)=>{let o=e.querySelector('[slot="separator"]');o===null?e.append(this.getSeparator()):o.hasAttribute("data-default")&&o.replaceWith(this.getSeparator()),l===a.length-1?e.setAttribute("aria-current","page"):e.removeAttribute("aria-current")})}render(){return this.separatorDir!==this.localize.dir()&&(this.separatorDir=this.localize.dir(),this.updateComplete.then(()=>this.handleSlotChange())),i`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>

      <slot name="separator" hidden aria-hidden="true">
        <sl-icon name=${this.localize.dir()==="rtl"?"chevron-left":"chevron-right"} library="system"></sl-icon>
      </slot>
    `}};t.styles=c,r([s("slot")],t.prototype,"defaultSlot",2),r([s('slot[name="separator"]')],t.prototype,"separatorSlot",2),r([m()],t.prototype,"label",2),t=r([n("sl-breadcrumb")],t);export{t as a};
