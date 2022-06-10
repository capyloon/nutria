import{a as p}from"./chunk.SMMSUKR7.js";import{a as i,b as m,d as s}from"./chunk.GVR6SJVE.js";import{c as l,h as n}from"./chunk.7EIHAL55.js";import{g as r}from"./chunk.OAQCUA7X.js";var t=class extends n{constructor(){super(...arguments);this.label="Breadcrumb"}getSeparator(){let e=this.separatorSlot.assignedElements({flatten:!0})[0].cloneNode(!0);return[e,...e.querySelectorAll("[id]")].forEach(o=>o.removeAttribute("id")),e.slot="separator",e}handleSlotChange(){let a=[...this.defaultSlot.assignedElements({flatten:!0})].filter(e=>e.tagName.toLowerCase()==="sl-breadcrumb-item");a.forEach((e,o)=>{e.querySelector('[slot="separator"]')===null&&e.append(this.getSeparator()),o===a.length-1?e.setAttribute("aria-current","page"):e.removeAttribute("aria-current")})}render(){return l`
      <nav part="base" class="breadcrumb" aria-label=${this.label}>
        <slot @slotchange=${this.handleSlotChange}></slot>
      </nav>

      <slot name="separator" hidden aria-hidden="true">
        <sl-icon name="chevron-right" library="system"></sl-icon>
      </slot>
    `}};t.styles=p,r([s("slot")],t.prototype,"defaultSlot",2),r([s('slot[name="separator"]')],t.prototype,"separatorSlot",2),r([m()],t.prototype,"label",2),t=r([i("sl-breadcrumb")],t);export{t as a};
