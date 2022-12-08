import{a as h}from"./chunk.CFTD3FZS.js";import{a as c,b as g,c as m,d,f as b}from"./chunk.N2CXUFX7.js";import{c as i}from"./chunk.I36YJ673.js";import{g as l}from"./chunk.OAQCUA7X.js";var s=class extends b{constructor(){super(...arguments);this.disableRole=!1;this.label=""}handleFocus(e){let t=n(e.target);t==null||t.classList.add("sl-button-group__button--focus")}handleBlur(e){let t=n(e.target);t==null||t.classList.remove("sl-button-group__button--focus")}handleMouseOver(e){let t=n(e.target);t==null||t.classList.add("sl-button-group__button--hover")}handleMouseOut(e){let t=n(e.target);t==null||t.classList.remove("sl-button-group__button--hover")}handleSlotChange(){let e=[...this.defaultSlot.assignedElements({flatten:!0})];e.forEach(t=>{let a=e.indexOf(t),o=n(t);o!==null&&(o.classList.add("sl-button-group__button"),o.classList.toggle("sl-button-group__button--first",a===0),o.classList.toggle("sl-button-group__button--inner",a>0&&a<e.length-1),o.classList.toggle("sl-button-group__button--last",a===e.length-1),o.classList.toggle("sl-button-group__button--radio",o.tagName.toLowerCase()==="sl-radio-button"))})}render(){return i`
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
    `}};s.styles=h,l([d("slot")],s.prototype,"defaultSlot",2),l([m()],s.prototype,"disableRole",2),l([g()],s.prototype,"label",2),s=l([c("sl-button-group")],s);function n(u){var e;let r="sl-button, sl-radio-button";return(e=u.closest(r))!=null?e:u.querySelector(r)}export{s as a};
