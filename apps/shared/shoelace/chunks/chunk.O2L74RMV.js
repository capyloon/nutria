import{a as u}from"./chunk.ATPW3MCL.js";import{b as d}from"./chunk.6D3DWAMV.js";import{a as n}from"./chunk.RUACWBWF.js";import{a as l}from"./chunk.AR2QSYXF.js";import{a as i,b as r,c as s,e as o,g as h}from"./chunk.IKUI3UUK.js";import{c}from"./chunk.SYBSOZNG.js";import{e as t}from"./chunk.I4CX4JT3.js";var e=class extends h{constructor(){super(...arguments);this.localize=new d(this);this.current=!1;this.selected=!1;this.hasHover=!1;this.value="";this.disabled=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","option"),this.setAttribute("aria-selected","false")}handleDefaultSlotChange(){let a=this.getTextLabel();if(typeof this.cachedTextLabel=="undefined"){this.cachedTextLabel=a;return}a!==this.cachedTextLabel&&(this.cachedTextLabel=a,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1}))}handleMouseEnter(){this.hasHover=!0}handleMouseLeave(){this.hasHover=!1}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleSelectedChange(){this.setAttribute("aria-selected",this.selected?"true":"false")}handleValueChange(){typeof this.value!="string"&&(this.value=String(this.value)),this.value.includes(" ")&&(console.error("Option values cannot include a space. All spaces have been replaced with underscores.",this),this.value=this.value.replace(/ /g,"_"))}getTextLabel(){var a;return((a=this.textContent)!=null?a:"").trim()}render(){return c`
      <div
        part="base"
        class=${n({option:!0,"option--current":this.current,"option--disabled":this.disabled,"option--selected":this.selected,"option--hover":this.hasHover})}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        <sl-icon part="checked-icon" class="option__check" name="check" library="system" aria-hidden="true"></sl-icon>
        <slot part="prefix" name="prefix" class="option__prefix"></slot>
        <slot part="label" class="option__label" @slotchange=${this.handleDefaultSlotChange}></slot>
        <slot part="suffix" name="suffix" class="option__suffix"></slot>
      </div>
    `}};e.styles=u,t([o(".option__label")],e.prototype,"defaultSlot",2),t([s()],e.prototype,"current",2),t([s()],e.prototype,"selected",2),t([s()],e.prototype,"hasHover",2),t([r({reflect:!0})],e.prototype,"value",2),t([r({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([l("disabled")],e.prototype,"handleDisabledChange",1),t([l("selected")],e.prototype,"handleSelectedChange",1),t([l("value")],e.prototype,"handleValueChange",1),e=t([i("sl-option")],e);export{e as a};
