import{a as _}from"./chunk.I5DENNVB.js";import{a as u,b as f}from"./chunk.SORXI2MG.js";import{a as C}from"./chunk.76SRAIND.js";import{a as l,c as r}from"./chunk.UJEHPUK2.js";import{a as m}from"./chunk.KLRPP4NQ.js";import{a as s,d as n}from"./chunk.HFPOGNHG.js";import{b as k}from"./chunk.7DJRGBBM.js";import{a as p}from"./chunk.NUWDNXKI.js";import{a as w}from"./chunk.RHW2XED2.js";import{a as v}from"./chunk.AR2QSYXF.js";import{a as b}from"./chunk.RUACWBWF.js";import{a as y,b as d,e as h,g}from"./chunk.IKUI3UUK.js";import{c}from"./chunk.SYBSOZNG.js";import{e as i}from"./chunk.I4CX4JT3.js";var t=class extends g{constructor(){super(...arguments);this.hasSlotController=new w(this,"footer");this.localize=new k(this);this.open=!1;this.label="";this.noHeader=!1}connectedCallback(){super.connectedCallback(),this.handleDocumentKeyDown=this.handleDocumentKeyDown.bind(this),this.modal=new _(this)}firstUpdated(){this.dialog.hidden=!this.open,this.open&&(this.addOpenListeners(),this.modal.activate(),u(this))}disconnectedCallback(){super.disconnectedCallback(),f(this)}requestClose(e){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:e}}).defaultPrevented){let o=r(this,"dialog.denyClose",{dir:this.localize.dir()});s(this.panel,o.keyframes,o.options);return}this.hide()}addOpenListeners(){document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){document.removeEventListener("keydown",this.handleDocumentKeyDown)}handleDocumentKeyDown(e){this.open&&e.key==="Escape"&&(e.stopPropagation(),this.requestClose("keyboard"))}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.modal.activate(),u(this);let e=this.querySelector("[autofocus]");e&&e.removeAttribute("autofocus"),await Promise.all([n(this.dialog),n(this.overlay)]),this.dialog.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute("autofocus","")});let a=r(this,"dialog.show",{dir:this.localize.dir()}),o=r(this,"dialog.overlay.show",{dir:this.localize.dir()});await Promise.all([s(this.panel,a.keyframes,a.options),s(this.overlay,o.keyframes,o.options)]),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),this.modal.deactivate(),await Promise.all([n(this.dialog),n(this.overlay)]);let e=r(this,"dialog.hide",{dir:this.localize.dir()}),a=r(this,"dialog.overlay.hide",{dir:this.localize.dir()});await Promise.all([s(this.overlay,a.keyframes,a.options).then(()=>{this.overlay.hidden=!0}),s(this.panel,e.keyframes,e.options).then(()=>{this.panel.hidden=!0})]),this.dialog.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1,f(this);let o=this.originalTrigger;typeof(o==null?void 0:o.focus)=="function"&&setTimeout(()=>o.focus()),this.emit("sl-after-hide")}}async show(){if(!this.open)return this.open=!0,m(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,m(this,"sl-after-hide")}render(){return c`
      <div
        part="base"
        class=${b({dialog:!0,"dialog--open":this.open,"dialog--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="dialog__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${p(this.noHeader?this.label:void 0)}
          aria-labelledby=${p(this.noHeader?void 0:"title")}
          tabindex="0"
        >
          ${this.noHeader?"":c`
                <header part="header" class="dialog__header">
                  <h2 part="title" class="dialog__title" id="title">
                    <slot name="label"> ${this.label.length>0?this.label:String.fromCharCode(65279)} </slot>
                  </h2>
                  <div part="header-actions" class="dialog__header-actions">
                    <slot name="header-actions"></slot>
                    <sl-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="dialog__close"
                      name="x-lg"
                      label=${this.localize.term("close")}
                      library="system"
                      @click="${()=>this.requestClose("close-button")}"
                    ></sl-icon-button>
                  </div>
                </header>
              `}

          <slot part="body" class="dialog__body"></slot>

          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `}};t.styles=C,i([h(".dialog")],t.prototype,"dialog",2),i([h(".dialog__panel")],t.prototype,"panel",2),i([h(".dialog__overlay")],t.prototype,"overlay",2),i([d({type:Boolean,reflect:!0})],t.prototype,"open",2),i([d({reflect:!0})],t.prototype,"label",2),i([d({attribute:"no-header",type:Boolean,reflect:!0})],t.prototype,"noHeader",2),i([v("open",{waitUntilFirstUpdate:!0})],t.prototype,"handleOpenChange",1),t=i([y("sl-dialog")],t);l("dialog.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:"ease"}});l("dialog.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:"ease"}});l("dialog.denyClose",{keyframes:[{scale:1},{scale:1.02},{scale:1}],options:{duration:250}});l("dialog.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}});l("dialog.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}});export{t as a};
