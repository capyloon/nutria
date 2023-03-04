import{a as c}from"./chunk.PN745T7V.js";import{b as h}from"./chunk.6D3DWAMV.js";import{a as i,b as n,d as s,f as m}from"./chunk.PRU55YXS.js";import{c as p}from"./chunk.SYBSOZNG.js";import{e as r}from"./chunk.I4CX4JT3.js";var t=class extends m{constructor(){super(...arguments);this.localize=new h(this);this.separatorDir=this.localize.dir();this.label=""}getSeparator(){let e=this.separatorSlot.assignedElements({flatten:!0})[0].cloneNode(!0);return[e,...e.querySelectorAll("[id]")].forEach(l=>l.removeAttribute("id")),e.setAttribute("data-default",""),e.slot="separator",e}handleSlotChange(){let a=[...this.defaultSlot.assignedElements({flatten:!0})].filter(e=>e.tagName.toLowerCase()==="sl-breadcrumb-item");a.forEach((e,l)=>{let o=e.querySelector('[slot="separator"]');o===null?e.append(this.getSeparator()):o.hasAttribute("data-default")&&o.replaceWith(this.getSeparator()),l===a.length-1?e.setAttribute("aria-current","page"):e.removeAttribute("aria-current")})}render(){return this.separatorDir!==this.localize.dir()&&(this.separatorDir=this.localize.dir(),this.updateComplete.then(()=>this.handleSlotChange())),p`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>

      <slot name="separator" hidden aria-hidden="true">
        <sl-icon name=${this.localize.dir()==="rtl"?"chevron-left":"chevron-right"} library="system"></sl-icon>
      </slot>
    `}};t.styles=c,r([s("slot")],t.prototype,"defaultSlot",2),r([s('slot[name="separator"]')],t.prototype,"separatorSlot",2),r([n()],t.prototype,"label",2),t=r([i("sl-breadcrumb")],t);export{t as a};
