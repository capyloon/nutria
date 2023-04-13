import{a as g}from"./chunk.XQJ2NCSG.js";import{a as h,c as m}from"./chunk.UJEHPUK2.js";import{a as p}from"./chunk.KLRPP4NQ.js";import{a as l,d,e as n}from"./chunk.HFPOGNHG.js";import{b as w}from"./chunk.7DJRGBBM.js";import{a as f}from"./chunk.AR2QSYXF.js";import{a as b}from"./chunk.RUACWBWF.js";import{a as c,b as a,e as s,g as u}from"./chunk.IKUI3UUK.js";import{c as y}from"./chunk.SYBSOZNG.js";import{e as i}from"./chunk.I4CX4JT3.js";var t=class extends u{constructor(){super(...arguments);this.localize=new w(this);this.open=!1;this.disabled=!1}firstUpdated(){this.body.hidden=!this.open,this.body.style.height=this.open?"auto":"0"}handleSummaryClick(){this.disabled||(this.open?this.hide():this.show(),this.header.focus())}handleSummaryKeyDown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.open?this.hide():this.show()),(e.key==="ArrowUp"||e.key==="ArrowLeft")&&(e.preventDefault(),this.hide()),(e.key==="ArrowDown"||e.key==="ArrowRight")&&(e.preventDefault(),this.show())}async handleOpenChange(){if(this.open){if(this.emit("sl-show",{cancelable:!0}).defaultPrevented){this.open=!1;return}await d(this.body),this.body.hidden=!1;let{keyframes:o,options:r}=m(this,"details.show",{dir:this.localize.dir()});await l(this.body,n(o,this.body.scrollHeight),r),this.body.style.height="auto",this.emit("sl-after-show")}else{if(this.emit("sl-hide",{cancelable:!0}).defaultPrevented){this.open=!0;return}await d(this.body);let{keyframes:o,options:r}=m(this,"details.hide",{dir:this.localize.dir()});await l(this.body,n(o,this.body.scrollHeight),r),this.body.hidden=!0,this.body.style.height="auto",this.emit("sl-after-hide")}}async show(){if(!(this.open||this.disabled))return this.open=!0,p(this,"sl-after-show")}async hide(){if(!(!this.open||this.disabled))return this.open=!1,p(this,"sl-after-hide")}render(){let e=this.localize.dir()==="rtl";return y`
      <div
        part="base"
        class=${b({details:!0,"details--open":this.open,"details--disabled":this.disabled,"details--rtl":e})}
      >
        <header
          part="header"
          id="header"
          class="details__header"
          role="button"
          aria-expanded=${this.open?"true":"false"}
          aria-controls="content"
          aria-disabled=${this.disabled?"true":"false"}
          tabindex=${this.disabled?"-1":"0"}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <slot name="summary" part="summary" class="details__summary">${this.summary}</slot>

          <span part="summary-icon" class="details__summary-icon">
            <slot name="expand-icon">
              <sl-icon library="system" name=${e?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
            <slot name="collapse-icon">
              <sl-icon library="system" name=${e?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
          </span>
        </header>

        <div class="details__body">
          <slot part="content" id="content" class="details__content" role="region" aria-labelledby="header"></slot>
        </div>
      </div>
    `}};t.styles=g,i([s(".details")],t.prototype,"details",2),i([s(".details__header")],t.prototype,"header",2),i([s(".details__body")],t.prototype,"body",2),i([s(".details__expand-icon-slot")],t.prototype,"expandIconSlot",2),i([a({type:Boolean,reflect:!0})],t.prototype,"open",2),i([a()],t.prototype,"summary",2),i([a({type:Boolean,reflect:!0})],t.prototype,"disabled",2),i([f("open",{waitUntilFirstUpdate:!0})],t.prototype,"handleOpenChange",1),t=i([c("sl-details")],t);h("details.show",{keyframes:[{height:"0",opacity:"0"},{height:"auto",opacity:"1"}],options:{duration:250,easing:"linear"}});h("details.hide",{keyframes:[{height:"auto",opacity:"1"},{height:"0",opacity:"0"}],options:{duration:250,easing:"linear"}});export{t as a};
