import{a as b}from"./chunk.63A5EUUV.js";import{a as c,b as d,c as g,d as m,f as h}from"./chunk.X7Q42RGY.js";import{c as i}from"./chunk.3G4FHXSN.js";import{g as l}from"./chunk.OAQCUA7X.js";var s=class extends h{constructor(){super(...arguments);this.disableRole=!1;this.label=""}handleFocus(e){let t=n(e.target);t==null||t.classList.add("sl-button-group__button--focus")}handleBlur(e){let t=n(e.target);t==null||t.classList.remove("sl-button-group__button--focus")}handleMouseOver(e){let t=n(e.target);t==null||t.classList.add("sl-button-group__button--hover")}handleMouseOut(e){let t=n(e.target);t==null||t.classList.remove("sl-button-group__button--hover")}handleSlotChange(){let e=[...this.defaultSlot.assignedElements({flatten:!0})];e.forEach(t=>{let r=e.indexOf(t),o=n(t);o!==null&&(o.classList.add("sl-button-group__button"),o.classList.toggle("sl-button-group__button--first",r===0),o.classList.toggle("sl-button-group__button--inner",r>0&&r<e.length-1),o.classList.toggle("sl-button-group__button--last",r===e.length-1),o.classList.toggle("sl-button-group__button--radio",o.tagName.toLowerCase()==="sl-radio-button"))})}render(){return i`
      <div
        part="base"
        class="button-group"
        role="${this.disableRole?"presentation":"group"}"
        aria-label=${this.label}
        @focusout=${this.handleBlur}
        @focusin=${this.handleFocus}
        @mouseover=${this.handleMouseOver}
        @mouseout=${this.handleMouseOut}
      >
        <slot @slotchange=${this.handleSlotChange} role="none"></slot>
      </div>
    `}};s.styles=b,l([m("slot")],s.prototype,"defaultSlot",2),l([g()],s.prototype,"disableRole",2),l([d()],s.prototype,"label",2),s=l([c("sl-button-group")],s);function n(a){let u=["sl-button","sl-radio-button"];return u.includes(a.tagName.toLowerCase())?a:a.querySelector(u.join(","))}export{s as a};
