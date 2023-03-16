import{a as h}from"./chunk.Z772HJSR.js";import{a as i,b as c,c as g,e as d,g as b}from"./chunk.IKUI3UUK.js";import{c as m}from"./chunk.SYBSOZNG.js";import{e as l}from"./chunk.I4CX4JT3.js";var s=class extends b{constructor(){super(...arguments);this.disableRole=!1;this.label=""}handleFocus(e){let t=a(e.target);t==null||t.classList.add("sl-button-group__button--focus")}handleBlur(e){let t=a(e.target);t==null||t.classList.remove("sl-button-group__button--focus")}handleMouseOver(e){let t=a(e.target);t==null||t.classList.add("sl-button-group__button--hover")}handleMouseOut(e){let t=a(e.target);t==null||t.classList.remove("sl-button-group__button--hover")}handleSlotChange(){let e=[...this.defaultSlot.assignedElements({flatten:!0})];e.forEach(t=>{let n=e.indexOf(t),o=a(t);o!==null&&(o.classList.add("sl-button-group__button"),o.classList.toggle("sl-button-group__button--first",n===0),o.classList.toggle("sl-button-group__button--inner",n>0&&n<e.length-1),o.classList.toggle("sl-button-group__button--last",n===e.length-1),o.classList.toggle("sl-button-group__button--radio",o.tagName.toLowerCase()==="sl-radio-button"))})}render(){return m`
      <slot
        part="base"
        class="button-group"
        role="${this.disableRole?"presentation":"group"}"
        aria-label=${this.label}
        @focusout=${this.handleBlur}
        @focusin=${this.handleFocus}
        @mouseover=${this.handleMouseOver}
        @mouseout=${this.handleMouseOut}
        @slotchange=${this.handleSlotChange}
      ></slot>
    `}};s.styles=h,l([d("slot")],s.prototype,"defaultSlot",2),l([g()],s.prototype,"disableRole",2),l([c()],s.prototype,"label",2),s=l([i("sl-button-group")],s);function a(r){var e;let u="sl-button, sl-radio-button";return(e=r.closest(u))!=null?e:r.querySelector(u)}export{s as a};
