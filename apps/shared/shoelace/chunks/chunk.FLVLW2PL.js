import{a as g}from"./chunk.NX2TKJ43.js";import{a as h,c as n,d as l}from"./chunk.F64FS4SB.js";import{a as m,c as y}from"./chunk.O7L2VUC4.js";import{h as w}from"./chunk.RLLTRZYL.js";import{a as u}from"./chunk.PC5WGFOA.js";import{a as b}from"./chunk.OSEV3RCT.js";import{a as s,b as d}from"./chunk.V4OMSSO6.js";import{a as c,b as a,d as o}from"./chunk.GVR6SJVE.js";import{c as p,h as f}from"./chunk.7EIHAL55.js";import{g as i}from"./chunk.OAQCUA7X.js";var t=class extends f{constructor(){super(...arguments);this.localize=new w(this);this.open=!1;this.disabled=!1}firstUpdated(){this.body.hidden=!this.open,this.body.style.height=this.open?"auto":"0"}async show(){if(!(this.open||this.disabled))return this.open=!0,d(this,"sl-after-show")}async hide(){if(!(!this.open||this.disabled))return this.open=!1,d(this,"sl-after-hide")}handleSummaryClick(){this.disabled||(this.open?this.hide():this.show(),this.header.focus())}handleSummaryKeyDown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.open?this.hide():this.show()),(e.key==="ArrowUp"||e.key==="ArrowLeft")&&(e.preventDefault(),this.hide()),(e.key==="ArrowDown"||e.key==="ArrowRight")&&(e.preventDefault(),this.show())}async handleOpenChange(){if(this.open){s(this,"sl-show"),await n(this.body),this.body.hidden=!1;let{keyframes:e,options:r}=y(this,"details.show",{dir:this.localize.dir()});await h(this.body,l(e,this.body.scrollHeight),r),this.body.style.height="auto",s(this,"sl-after-show")}else{s(this,"sl-hide"),await n(this.body);let{keyframes:e,options:r}=y(this,"details.hide",{dir:this.localize.dir()});await h(this.body,l(e,this.body.scrollHeight),r),this.body.hidden=!0,this.body.style.height="auto",s(this,"sl-after-hide")}}render(){return p`
      <div
        part="base"
        class=${u({details:!0,"details--open":this.open,"details--disabled":this.disabled})}
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
          <div part="summary" class="details__summary">
            <slot name="summary">${this.summary}</slot>
          </div>

          <span part="summary-icon" class="details__summary-icon">
            <sl-icon name="chevron-right" library="system"></sl-icon>
          </span>
        </header>

        <div class="details__body">
          <div part="content" id="content" class="details__content" role="region" aria-labelledby="header">
            <slot></slot>
          </div>
        </div>
      </div>
    `}};t.styles=g,i([o(".details")],t.prototype,"details",2),i([o(".details__header")],t.prototype,"header",2),i([o(".details__body")],t.prototype,"body",2),i([a({type:Boolean,reflect:!0})],t.prototype,"open",2),i([a()],t.prototype,"summary",2),i([a({type:Boolean,reflect:!0})],t.prototype,"disabled",2),i([b("open",{waitUntilFirstUpdate:!0})],t.prototype,"handleOpenChange",1),t=i([c("sl-details")],t);m("details.show",{keyframes:[{height:"0",opacity:"0"},{height:"auto",opacity:"1"}],options:{duration:250,easing:"linear"}});m("details.hide",{keyframes:[{height:"auto",opacity:"1"},{height:"0",opacity:"0"}],options:{duration:250,easing:"linear"}});export{t as a};
