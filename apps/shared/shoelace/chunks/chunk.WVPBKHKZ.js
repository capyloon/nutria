import{a as m}from"./chunk.4E7ZQJBZ.js";import{a as b}from"./chunk.PC5WGFOA.js";import{a as f,b as c,c as p,d as g}from"./chunk.GVR6SJVE.js";import{c as d,h as u}from"./chunk.7EIHAL55.js";import{g as i}from"./chunk.OAQCUA7X.js";var h=["sl-radio","sl-radio-button"],o=class extends u{constructor(){super(...arguments);this.hasButtonGroup=!1;this.label="";this.fieldset=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","radiogroup")}getAllRadios(){return[...this.querySelectorAll(h.join(","))].filter(t=>h.includes(t.tagName.toLowerCase()))}handleRadioClick(t){let e=t.target.closest(h.map(r=>`${r}:not([disabled])`).join(","));e&&this.getAllRadios().forEach(a=>{a.checked=a===e,a.input.tabIndex=a===e?0:-1})}handleKeyDown(t){var s;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(t.key)){let e=this.getAllRadios().filter(n=>!n.disabled),r=(s=e.find(n=>n.checked))!=null?s:e[0],a=["ArrowUp","ArrowLeft"].includes(t.key)?-1:1,l=e.indexOf(r)+a;l<0&&(l=e.length-1),l>e.length-1&&(l=0),this.getAllRadios().forEach(n=>{n.checked=!1,n.input.tabIndex=-1}),e[l].focus(),e[l].checked=!0,e[l].input.tabIndex=0,t.preventDefault()}}handleSlotChange(){let t=this.getAllRadios(),s=t.find(e=>e.checked);this.hasButtonGroup=!!t.find(e=>e.tagName.toLowerCase()==="sl-radio-button"),t.forEach(e=>{e.setAttribute("role","radio"),e.input.tabIndex=-1}),s?s.input.tabIndex=0:t.length>0&&(t[0].input.tabIndex=0)}render(){let t=d`
      <slot @click=${this.handleRadioClick} @keydown=${this.handleKeyDown} @slotchange=${this.handleSlotChange}></slot>
    `;return d`
      <fieldset
        part="base"
        class=${b({"radio-group":!0,"radio-group--has-fieldset":this.fieldset})}
      >
        <legend part="label" class="radio-group__label">
          <slot name="label">${this.label}</slot>
        </legend>
        ${this.hasButtonGroup?d`<sl-button-group part="button-group">${t}</sl-button-group>`:t}
      </fieldset>
    `}};o.styles=m,i([g("slot:not([name])")],o.prototype,"defaultSlot",2),i([p()],o.prototype,"hasButtonGroup",2),i([c()],o.prototype,"label",2),i([c({type:Boolean,attribute:"fieldset"})],o.prototype,"fieldset",2),o=i([f("sl-radio-group")],o);export{o as a};
