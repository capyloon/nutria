import{a as m}from"./chunk.CLTAZZGS.js";import{b as n}from"./chunk.RHW2XED2.js";import{a as o}from"./chunk.RUACWBWF.js";import{a as s}from"./chunk.AR2QSYXF.js";import{a as r,b as a,d as l,f as h}from"./chunk.JFPKWAAH.js";import{c}from"./chunk.SYBSOZNG.js";import{e as t}from"./chunk.I4CX4JT3.js";var e=class extends h{constructor(){super(...arguments);this.type="normal";this.checked=!1;this.value="";this.disabled=!1}handleDefaultSlotChange(){let i=this.getTextLabel();if(typeof this.cachedTextLabel=="undefined"){this.cachedTextLabel=i;return}i!==this.cachedTextLabel&&(this.cachedTextLabel=i,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1}))}handleCheckedChange(){if(this.checked&&this.type!=="checkbox"){this.checked=!1,console.error('The checked attribute can only be used on menu items with type="checkbox"',this);return}this.type==="checkbox"?this.setAttribute("aria-checked",this.checked?"true":"false"):this.removeAttribute("aria-checked")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleTypeChange(){this.type==="checkbox"?(this.setAttribute("role","menuitemcheckbox"),this.setAttribute("aria-checked",this.checked?"true":"false")):(this.setAttribute("role","menuitem"),this.removeAttribute("aria-checked"))}getTextLabel(){return n(this.defaultSlot)}render(){return c`
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
    `}};e.styles=m,t([l("slot:not([name])")],e.prototype,"defaultSlot",2),t([l(".menu-item")],e.prototype,"menuItem",2),t([a()],e.prototype,"type",2),t([a({type:Boolean,reflect:!0})],e.prototype,"checked",2),t([a()],e.prototype,"value",2),t([a({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([s("checked")],e.prototype,"handleCheckedChange",1),t([s("disabled")],e.prototype,"handleDisabledChange",1),t([s("type")],e.prototype,"handleTypeChange",1),e=t([r("sl-menu-item")],e);export{e as a};
