import{a as d}from"./chunk.4CSUIDSR.js";import{b as h}from"./chunk.RHW2XED2.js";import{a as c}from"./chunk.LSNASYMO.js";import{a as l}from"./chunk.DBCWAMJH.js";import{a as o}from"./chunk.JUX3LFDW.js";import{a as n,b as a,d as i,f as m}from"./chunk.X7Q42RGY.js";import{c as r}from"./chunk.3G4FHXSN.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends m{constructor(){super(...arguments);this.checked=!1;this.value="";this.disabled=!1}firstUpdated(){this.setAttribute("role","menuitem")}getTextLabel(){return h(this.defaultSlot)}handleCheckedChange(){this.setAttribute("aria-checked",this.checked?"true":"false")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleDefaultSlotChange(){let s=this.getTextLabel();if(typeof this.cachedTextLabel=="undefined"){this.cachedTextLabel=s;return}s!==this.cachedTextLabel&&(this.cachedTextLabel=s,o(this,"sl-label-change"))}render(){return r`
      <div
        part="base"
        class=${c({"menu-item":!0,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled,"menu-item--has-submenu":!1})}
      >
        <span part="checked-icon" class="menu-item__check">
          <sl-icon name="check-lg" library="system" aria-hidden="true"></sl-icon>
        </span>

        <span part="prefix" class="menu-item__prefix">
          <slot name="prefix"></slot>
        </span>

        <span part="label" class="menu-item__label">
          <slot @slotchange=${this.handleDefaultSlotChange}></slot>
        </span>

        <span part="suffix" class="menu-item__suffix">
          <slot name="suffix"></slot>
        </span>

        <span class="menu-item__chevron">
          <sl-icon name="chevron-right" library="system" aria-hidden="true"></sl-icon>
        </span>
      </div>
    `}};e.styles=d,t([i("slot:not([name])")],e.prototype,"defaultSlot",2),t([i(".menu-item")],e.prototype,"menuItem",2),t([a({type:Boolean,reflect:!0})],e.prototype,"checked",2),t([a()],e.prototype,"value",2),t([a({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([l("checked")],e.prototype,"handleCheckedChange",1),t([l("disabled")],e.prototype,"handleDisabledChange",1),e=t([n("sl-menu-item")],e);export{e as a};
