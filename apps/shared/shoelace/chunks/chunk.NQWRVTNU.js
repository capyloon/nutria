import{a as h}from"./chunk.J7SVVEVV.js";import{b as m}from"./chunk.RHW2XED2.js";import{a as n}from"./chunk.DUQXEIJD.js";import{a as l}from"./chunk.DBCWAMJH.js";import{a as c,b as a,d as i,f as o}from"./chunk.N2CXUFX7.js";import{c as r}from"./chunk.I36YJ673.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends o{constructor(){super(...arguments);this.checked=!1;this.value="";this.disabled=!1}firstUpdated(){this.setAttribute("role","menuitem")}getTextLabel(){return m(this.defaultSlot)}handleCheckedChange(){this.setAttribute("aria-checked",this.checked?"true":"false")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleDefaultSlotChange(){let s=this.getTextLabel();if(typeof this.cachedTextLabel=="undefined"){this.cachedTextLabel=s;return}s!==this.cachedTextLabel&&(this.cachedTextLabel=s,this.emit("sl-label-change"))}render(){return r`
      <div
        part="base"
        class=${n({"menu-item":!0,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled,"menu-item--has-submenu":!1})}
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
    `}};e.styles=h,t([i("slot:not([name])")],e.prototype,"defaultSlot",2),t([i(".menu-item")],e.prototype,"menuItem",2),t([a({type:Boolean,reflect:!0})],e.prototype,"checked",2),t([a()],e.prototype,"value",2),t([a({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([l("checked")],e.prototype,"handleCheckedChange",1),t([l("disabled")],e.prototype,"handleDisabledChange",1),e=t([c("sl-menu-item")],e);export{e as a};
