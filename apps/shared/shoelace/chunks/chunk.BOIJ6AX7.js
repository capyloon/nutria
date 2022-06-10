import{a as C}from"./chunk.4CLSN6UG.js";import{a as u,b as y}from"./chunk.PYPBGY2O.js";import{h as _}from"./chunk.RLLTRZYL.js";import{a as T}from"./chunk.AFKQ6GT2.js";import{a as l,c as d}from"./chunk.F64FS4SB.js";import{a as r,c as n}from"./chunk.O2JEMOVA.js";import{a as w}from"./chunk.RHW2XED2.js";import{a as m}from"./chunk.2XQLLZV4.js";import{a as b}from"./chunk.PC5WGFOA.js";import{a as k}from"./chunk.OSEV3RCT.js";import{a as i,b as f}from"./chunk.V4OMSSO6.js";import{a as v,b as c,d as h}from"./chunk.GVR6SJVE.js";import{c as p,h as g}from"./chunk.7EIHAL55.js";import{g as a}from"./chunk.OAQCUA7X.js";var t=class extends g{constructor(){super(...arguments);this.hasSlotController=new w(this,"footer");this.localize=new _(this);this.open=!1;this.label="";this.noHeader=!1}connectedCallback(){super.connectedCallback(),this.modal=new C(this)}firstUpdated(){this.dialog.hidden=!this.open,this.open&&(this.modal.activate(),u(this))}disconnectedCallback(){super.disconnectedCallback(),y(this)}async show(){if(!this.open)return this.open=!0,f(this,"sl-after-show")}async hide(){if(!!this.open)return this.open=!1,f(this,"sl-after-hide")}requestClose(e){if(i(this,"sl-request-close",{cancelable:!0,detail:{source:e}}).defaultPrevented){let o=n(this,"dialog.denyClose");l(this.panel,o.keyframes,o.options);return}this.hide()}handleKeyDown(e){e.key==="Escape"&&(e.stopPropagation(),this.requestClose("keyboard"))}async handleOpenChange(){if(this.open){i(this,"sl-show"),this.originalTrigger=document.activeElement,this.modal.activate(),u(this);let e=this.querySelector("[autofocus]");e&&e.removeAttribute("autofocus"),await Promise.all([d(this.dialog),d(this.overlay)]),this.dialog.hidden=!1,requestAnimationFrame(()=>{i(this,"sl-initial-focus",{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute("autofocus","")});let s=n(this,"dialog.show"),o=n(this,"dialog.overlay.show");await Promise.all([l(this.panel,s.keyframes,s.options),l(this.overlay,o.keyframes,o.options)]),i(this,"sl-after-show")}else{i(this,"sl-hide"),this.modal.deactivate(),await Promise.all([d(this.dialog),d(this.overlay)]);let e=n(this,"dialog.hide"),s=n(this,"dialog.overlay.hide");await Promise.all([l(this.panel,e.keyframes,e.options),l(this.overlay,s.keyframes,s.options)]),this.dialog.hidden=!0,y(this);let o=this.originalTrigger;typeof(o==null?void 0:o.focus)=="function"&&setTimeout(()=>o.focus()),i(this,"sl-after-hide")}}render(){return p`
      <div
        part="base"
        class=${b({dialog:!0,"dialog--open":this.open,"dialog--has-footer":this.hasSlotController.test("footer")})}
        @keydown=${this.handleKeyDown}
      >
        <div part="overlay" class="dialog__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${m(this.noHeader?this.label:void 0)}
          aria-labelledby=${m(this.noHeader?void 0:"title")}
          tabindex="0"
        >
          ${this.noHeader?"":p`
                <header part="header" class="dialog__header">
                  <h2 part="title" class="dialog__title" id="title">
                    <slot name="label"> ${this.label.length>0?this.label:String.fromCharCode(65279)} </slot>
                  </h2>
                  <sl-icon-button
                    part="close-button"
                    exportparts="base:close-button__base"
                    class="dialog__close"
                    name="x"
                    label=${this.localize.term("close")}
                    library="system"
                    @click="${()=>this.requestClose("close-button")}"
                  ></sl-icon-button>
                </header>
              `}

          <div part="body" class="dialog__body">
            <slot></slot>
          </div>

          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `}};t.styles=T,a([h(".dialog")],t.prototype,"dialog",2),a([h(".dialog__panel")],t.prototype,"panel",2),a([h(".dialog__overlay")],t.prototype,"overlay",2),a([c({type:Boolean,reflect:!0})],t.prototype,"open",2),a([c({reflect:!0})],t.prototype,"label",2),a([c({attribute:"no-header",type:Boolean,reflect:!0})],t.prototype,"noHeader",2),a([k("open",{waitUntilFirstUpdate:!0})],t.prototype,"handleOpenChange",1),t=a([v("sl-dialog")],t);r("dialog.show",{keyframes:[{opacity:0,transform:"scale(0.8)"},{opacity:1,transform:"scale(1)"}],options:{duration:250,easing:"ease"}});r("dialog.hide",{keyframes:[{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.8)"}],options:{duration:250,easing:"ease"}});r("dialog.denyClose",{keyframes:[{transform:"scale(1)"},{transform:"scale(1.02)"},{transform:"scale(1)"}],options:{duration:250}});r("dialog.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}});r("dialog.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}});export{t as a};
