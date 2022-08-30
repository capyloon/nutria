import{a as _}from"./chunk.Y5NITLUC.js";import{a as u,b as y}from"./chunk.PYPBGY2O.js";import{a as T}from"./chunk.F7Y3INSO.js";import{a as l,c as d}from"./chunk.LXSZTUPS.js";import{a as r,c as n}from"./chunk.SWQG23VR.js";import{c as C}from"./chunk.ISLNSUAB.js";import{a as k}from"./chunk.RHW2XED2.js";import{a as f}from"./chunk.AFO4PD3A.js";import{a as v}from"./chunk.LSNASYMO.js";import{a as w}from"./chunk.DBCWAMJH.js";import{a,b as m}from"./chunk.JUX3LFDW.js";import{a as g,b as h,d as c,f as b}from"./chunk.X7Q42RGY.js";import{c as p}from"./chunk.3G4FHXSN.js";import{g as i}from"./chunk.OAQCUA7X.js";var t=class extends b{constructor(){super(...arguments);this.hasSlotController=new k(this,"footer");this.localize=new C(this);this.open=!1;this.label="";this.noHeader=!1}connectedCallback(){super.connectedCallback(),this.modal=new _(this)}firstUpdated(){this.dialog.hidden=!this.open,this.open&&(this.modal.activate(),u(this))}disconnectedCallback(){super.disconnectedCallback(),y(this)}async show(){if(!this.open)return this.open=!0,m(this,"sl-after-show")}async hide(){if(!!this.open)return this.open=!1,m(this,"sl-after-hide")}requestClose(e){if(a(this,"sl-request-close",{cancelable:!0,detail:{source:e}}).defaultPrevented){let o=n(this,"dialog.denyClose",{dir:this.localize.dir()});l(this.panel,o.keyframes,o.options);return}this.hide()}handleKeyDown(e){e.key==="Escape"&&(e.stopPropagation(),this.requestClose("keyboard"))}async handleOpenChange(){if(this.open){a(this,"sl-show"),this.originalTrigger=document.activeElement,this.modal.activate(),u(this);let e=this.querySelector("[autofocus]");e&&e.removeAttribute("autofocus"),await Promise.all([d(this.dialog),d(this.overlay)]),this.dialog.hidden=!1,requestAnimationFrame(()=>{a(this,"sl-initial-focus",{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute("autofocus","")});let s=n(this,"dialog.show",{dir:this.localize.dir()}),o=n(this,"dialog.overlay.show",{dir:this.localize.dir()});await Promise.all([l(this.panel,s.keyframes,s.options),l(this.overlay,o.keyframes,o.options)]),a(this,"sl-after-show")}else{a(this,"sl-hide"),this.modal.deactivate(),await Promise.all([d(this.dialog),d(this.overlay)]);let e=n(this,"dialog.hide",{dir:this.localize.dir()}),s=n(this,"dialog.overlay.hide",{dir:this.localize.dir()});await Promise.all([l(this.overlay,s.keyframes,s.options).then(()=>{this.overlay.hidden=!0}),l(this.panel,e.keyframes,e.options).then(()=>{this.panel.hidden=!0})]),this.dialog.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1,y(this);let o=this.originalTrigger;typeof(o==null?void 0:o.focus)=="function"&&setTimeout(()=>o.focus()),a(this,"sl-after-hide")}}render(){return p`
      <div
        part="base"
        class=${v({dialog:!0,"dialog--open":this.open,"dialog--has-footer":this.hasSlotController.test("footer")})}
        @keydown=${this.handleKeyDown}
      >
        <div part="overlay" class="dialog__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${f(this.noHeader?this.label:void 0)}
          aria-labelledby=${f(this.noHeader?void 0:"title")}
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
    `}};t.styles=T,i([c(".dialog")],t.prototype,"dialog",2),i([c(".dialog__panel")],t.prototype,"panel",2),i([c(".dialog__overlay")],t.prototype,"overlay",2),i([h({type:Boolean,reflect:!0})],t.prototype,"open",2),i([h({reflect:!0})],t.prototype,"label",2),i([h({attribute:"no-header",type:Boolean,reflect:!0})],t.prototype,"noHeader",2),i([w("open",{waitUntilFirstUpdate:!0})],t.prototype,"handleOpenChange",1),t=i([g("sl-dialog")],t);r("dialog.show",{keyframes:[{opacity:0,transform:"scale(0.8)"},{opacity:1,transform:"scale(1)"}],options:{duration:250,easing:"ease"}});r("dialog.hide",{keyframes:[{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.8)"}],options:{duration:250,easing:"ease"}});r("dialog.denyClose",{keyframes:[{transform:"scale(1)"},{transform:"scale(1.02)"},{transform:"scale(1)"}],options:{duration:250}});r("dialog.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}});r("dialog.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}});export{t as a};
