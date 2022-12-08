import{a as L}from"./chunk.LCPMCLIF.js";import{a as E}from"./chunk.I5DENNVB.js";import{a as y,b as f}from"./chunk.PYPBGY2O.js";import{a as m}from"./chunk.KLRPP4NQ.js";import{a as n,c as d}from"./chunk.LXSZTUPS.js";import{a,c as l}from"./chunk.SWQG23VR.js";import{c as _}from"./chunk.MJKKE2MR.js";import{a as g}from"./chunk.RHW2XED2.js";import{a as u}from"./chunk.UBF6MLHX.js";import{a as b}from"./chunk.DUQXEIJD.js";import{a as C}from"./chunk.DBCWAMJH.js";import{a as v,b as s,d as c,f as k}from"./chunk.N2CXUFX7.js";import{c as p}from"./chunk.I36YJ673.js";import{g as r}from"./chunk.OAQCUA7X.js";function w(h){return h.charAt(0).toUpperCase()+h.slice(1)}var e=class extends k{constructor(){super(...arguments);this.hasSlotController=new g(this,"footer");this.localize=new _(this);this.open=!1;this.label="";this.placement="end";this.contained=!1;this.noHeader=!1}connectedCallback(){super.connectedCallback(),this.handleDocumentKeyDown=this.handleDocumentKeyDown.bind(this),this.modal=new E(this)}firstUpdated(){this.drawer.hidden=!this.open,this.open&&!this.contained&&(this.addOpenListeners(),this.modal.activate(),y(this))}disconnectedCallback(){super.disconnectedCallback(),f(this)}async show(){if(!this.open)return this.open=!0,m(this,"sl-after-show")}async hide(){if(!!this.open)return this.open=!1,m(this,"sl-after-hide")}requestClose(t){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:t}}).defaultPrevented){let o=l(this,"drawer.denyClose",{dir:this.localize.dir()});n(this.panel,o.keyframes,o.options);return}this.hide()}addOpenListeners(){document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){document.removeEventListener("keydown",this.handleDocumentKeyDown)}handleDocumentKeyDown(t){this.open&&t.key==="Escape"&&(t.stopPropagation(),this.requestClose("keyboard"))}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),y(this));let t=this.querySelector("[autofocus]");t&&t.removeAttribute("autofocus"),await Promise.all([d(this.drawer),d(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(t?t.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),t&&t.setAttribute("autofocus","")});let i=l(this,`drawer.show${w(this.placement)}`,{dir:this.localize.dir()}),o=l(this,"drawer.overlay.show",{dir:this.localize.dir()});await Promise.all([n(this.panel,i.keyframes,i.options),n(this.overlay,o.keyframes,o.options)]),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),this.modal.deactivate(),f(this),await Promise.all([d(this.drawer),d(this.overlay)]);let t=l(this,`drawer.hide${w(this.placement)}`,{dir:this.localize.dir()}),i=l(this,"drawer.overlay.hide",{dir:this.localize.dir()});await Promise.all([n(this.overlay,i.keyframes,i.options).then(()=>{this.overlay.hidden=!0}),n(this.panel,t.keyframes,t.options).then(()=>{this.panel.hidden=!0})]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;let o=this.originalTrigger;typeof(o==null?void 0:o.focus)=="function"&&setTimeout(()=>o.focus()),this.emit("sl-after-hide")}}render(){return p`
      <div
        part="base"
        class=${b({drawer:!0,"drawer--open":this.open,"drawer--top":this.placement==="top","drawer--end":this.placement==="end","drawer--bottom":this.placement==="bottom","drawer--start":this.placement==="start","drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":this.localize.dir()==="rtl","drawer--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="drawer__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${u(this.noHeader?this.label:void 0)}
          aria-labelledby=${u(this.noHeader?void 0:"title")}
          tabindex="0"
        >
          ${this.noHeader?"":p`
                <header part="header" class="drawer__header">
                  <h2 part="title" class="drawer__title" id="title">
                    <!-- If there's no label, use an invisible character to prevent the header from collapsing -->
                    <slot name="label"> ${this.label.length>0?this.label:String.fromCharCode(65279)} </slot>
                  </h2>
                  <div part="header-actions" class="drawer__header-actions">
                    <slot name="header-actions"></slot>
                    <sl-icon-button
                      part="close-button"
                      exportparts="base:close-button__base"
                      class="drawer__close"
                      name="x-lg"
                      label=${this.localize.term("close")}
                      library="system"
                      @click=${()=>this.requestClose("close-button")}
                    ></sl-icon-button>
                  </div>
                </header>
              `}

          <slot part="body" class="drawer__body"></slot>

          <footer part="footer" class="drawer__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `}};e.styles=L,r([c(".drawer")],e.prototype,"drawer",2),r([c(".drawer__panel")],e.prototype,"panel",2),r([c(".drawer__overlay")],e.prototype,"overlay",2),r([s({type:Boolean,reflect:!0})],e.prototype,"open",2),r([s({reflect:!0})],e.prototype,"label",2),r([s({reflect:!0})],e.prototype,"placement",2),r([s({type:Boolean,reflect:!0})],e.prototype,"contained",2),r([s({attribute:"no-header",type:Boolean,reflect:!0})],e.prototype,"noHeader",2),r([C("open",{waitUntilFirstUpdate:!0})],e.prototype,"handleOpenChange",1),e=r([v("sl-drawer")],e);a("drawer.showTop",{keyframes:[{opacity:0,translate:"0 -100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}});a("drawer.hideTop",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 -100%"}],options:{duration:250,easing:"ease"}});a("drawer.showEnd",{keyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}});a("drawer.hideEnd",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],options:{duration:250,easing:"ease"}});a("drawer.showBottom",{keyframes:[{opacity:0,translate:"0 100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}});a("drawer.hideBottom",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 100%"}],options:{duration:250,easing:"ease"}});a("drawer.showStart",{keyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}});a("drawer.hideStart",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],options:{duration:250,easing:"ease"}});a("drawer.denyClose",{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}});a("drawer.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}});a("drawer.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}});export{e as a};
