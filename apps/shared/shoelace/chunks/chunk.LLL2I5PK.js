import{a as m}from"./chunk.3TTTJEI7.js";import{a as c,b as d,d as g}from"./chunk.GVR6SJVE.js";import{c as r,h as i}from"./chunk.7EIHAL55.js";import{g as u}from"./chunk.OAQCUA7X.js";var h=["sl-button","sl-radio-button"],s=class extends i{constructor(){super(...arguments);this.label=""}handleFocus(e){let t=l(e.target);t==null||t.classList.add("sl-button-group__button--focus")}handleBlur(e){let t=l(e.target);t==null||t.classList.remove("sl-button-group__button--focus")}handleMouseOver(e){let t=l(e.target);t==null||t.classList.add("sl-button-group__button--hover")}handleMouseOut(e){let t=l(e.target);t==null||t.classList.remove("sl-button-group__button--hover")}handleSlotChange(){let e=[...this.defaultSlot.assignedElements({flatten:!0})];e.forEach(t=>{let a=e.indexOf(t),o=l(t);o!==null&&(o.classList.add("sl-button-group__button"),o.classList.toggle("sl-button-group__button--first",a===0),o.classList.toggle("sl-button-group__button--inner",a>0&&a<e.length-1),o.classList.toggle("sl-button-group__button--last",a===e.length-1))})}render(){return r`
      <div
        part="base"
        class="button-group"
        role="group"
        aria-label=${this.label}
        @focusout=${this.handleBlur}
        @focusin=${this.handleFocus}
        @mouseover=${this.handleMouseOver}
        @mouseout=${this.handleMouseOut}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `}};s.styles=m,u([g("slot")],s.prototype,"defaultSlot",2),u([d()],s.prototype,"label",2),s=u([c("sl-button-group")],s);function l(n){return h.includes(n.tagName.toLowerCase())?n:n.querySelector(h.join(","))}export{s as a};
