import{a as d}from"./chunk.3N5EN6WP.js";import{b as n}from"./chunk.RHW2XED2.js";import{a as i}from"./chunk.AR2QSYXF.js";import{a as o}from"./chunk.RUACWBWF.js";import{a as c,b as s,e as l,g as h}from"./chunk.IKUI3UUK.js";import{c as r}from"./chunk.SYBSOZNG.js";import{e as t}from"./chunk.I4CX4JT3.js";var e=class extends h{constructor(){super(...arguments);this.type="normal";this.checked=!1;this.value="";this.disabled=!1}connectedCallback(){super.connectedCallback(),this.handleHostClick=this.handleHostClick.bind(this),this.addEventListener("click",this.handleHostClick)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleHostClick)}handleDefaultSlotChange(){let a=this.getTextLabel();if(typeof this.cachedTextLabel=="undefined"){this.cachedTextLabel=a;return}a!==this.cachedTextLabel&&(this.cachedTextLabel=a,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1}))}handleHostClick(a){this.disabled&&(a.preventDefault(),a.stopImmediatePropagation())}handleCheckedChange(){if(this.checked&&this.type!=="checkbox"){this.checked=!1,console.error('The checked attribute can only be used on menu items with type="checkbox"',this);return}this.type==="checkbox"?this.setAttribute("aria-checked",this.checked?"true":"false"):this.removeAttribute("aria-checked")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleTypeChange(){this.type==="checkbox"?(this.setAttribute("role","menuitemcheckbox"),this.setAttribute("aria-checked",this.checked?"true":"false")):(this.setAttribute("role","menuitem"),this.removeAttribute("aria-checked"))}getTextLabel(){return n(this.defaultSlot)}render(){return r`
      <div
        part="base"
        class=${o({"menu-item":!0,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled,"menu-item--has-submenu":!1})}
      >
        <span part="checked-icon" class="menu-item__check">
          <sl-icon name="check" library="default" aria-hidden="true"></sl-icon>
        </span>

        <slot name="prefix" part="prefix" class="menu-item__prefix"></slot>

        <slot part="label" class="menu-item__label" @slotchange=${this.handleDefaultSlotChange}></slot>

        <slot name="suffix" part="suffix" class="menu-item__suffix"></slot>

        <span class="menu-item__chevron">
          <sl-icon name="chevron-right" library="system" aria-hidden="true"></sl-icon>
        </span>
      </div>
    `}};e.styles=d,t([l("slot:not([name])")],e.prototype,"defaultSlot",2),t([l(".menu-item")],e.prototype,"menuItem",2),t([s()],e.prototype,"type",2),t([s({type:Boolean,reflect:!0})],e.prototype,"checked",2),t([s()],e.prototype,"value",2),t([s({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([i("checked")],e.prototype,"handleCheckedChange",1),t([i("disabled")],e.prototype,"handleDisabledChange",1),t([i("type")],e.prototype,"handleTypeChange",1),e=t([c("sl-menu-item")],e);export{e as a};
