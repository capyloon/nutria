import{a as E}from"./chunk.I5DENNVB.js";import{a as h,b as p}from"./chunk.SORXI2MG.js";import{a as L}from"./chunk.DXOXW63G.js";import{a as i,c as l}from"./chunk.UJEHPUK2.js";import{a as w}from"./chunk.KLRPP4NQ.js";import{a as n,d}from"./chunk.HFPOGNHG.js";import{b as _}from"./chunk.7DJRGBBM.js";import{a as y}from"./chunk.NUWDNXKI.js";import{a as C}from"./chunk.RHW2XED2.js";import{a as u}from"./chunk.AR2QSYXF.js";import{a as k}from"./chunk.RUACWBWF.js";import{a as b,b as s,e as c,g}from"./chunk.IKUI3UUK.js";import{c as f}from"./chunk.SYBSOZNG.js";import{e as a}from"./chunk.I4CX4JT3.js";function v(m){return m.charAt(0).toUpperCase()+m.slice(1)}var e=class extends g{constructor(){super(...arguments);this.hasSlotController=new C(this,"footer");this.localize=new _(this);this.open=!1;this.label="";this.placement="end";this.contained=!1;this.noHeader=!1}connectedCallback(){super.connectedCallback(),this.handleDocumentKeyDown=this.handleDocumentKeyDown.bind(this),this.modal=new E(this)}firstUpdated(){this.drawer.hidden=!this.open,this.open&&(this.addOpenListeners(),this.contained||(this.modal.activate(),h(this)))}disconnectedCallback(){super.disconnectedCallback(),p(this)}requestClose(t){if(this.emit("sl-request-close",{cancelable:!0,detail:{source:t}}).defaultPrevented){let o=l(this,"drawer.denyClose",{dir:this.localize.dir()});n(this.panel,o.keyframes,o.options);return}this.hide()}addOpenListeners(){document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){document.removeEventListener("keydown",this.handleDocumentKeyDown)}handleDocumentKeyDown(t){this.open&&!this.contained&&t.key==="Escape"&&(t.stopPropagation(),this.requestClose("keyboard"))}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),h(this));let t=this.querySelector("[autofocus]");t&&t.removeAttribute("autofocus"),await Promise.all([d(this.drawer),d(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame(()=>{this.emit("sl-initial-focus",{cancelable:!0}).defaultPrevented||(t?t.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),t&&t.setAttribute("autofocus","")});let r=l(this,`drawer.show${v(this.placement)}`,{dir:this.localize.dir()}),o=l(this,"drawer.overlay.show",{dir:this.localize.dir()});await Promise.all([n(this.panel,r.keyframes,r.options),n(this.overlay,o.keyframes,o.options)]),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),this.contained||(this.modal.deactivate(),p(this)),await Promise.all([d(this.drawer),d(this.overlay)]);let t=l(this,`drawer.hide${v(this.placement)}`,{dir:this.localize.dir()}),r=l(this,"drawer.overlay.hide",{dir:this.localize.dir()});await Promise.all([n(this.overlay,r.keyframes,r.options).then(()=>{this.overlay.hidden=!0}),n(this.panel,t.keyframes,t.options).then(()=>{this.panel.hidden=!0})]),this.drawer.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1;let o=this.originalTrigger;typeof(o==null?void 0:o.focus)=="function"&&setTimeout(()=>o.focus()),this.emit("sl-after-hide")}}handleNoModalChange(){this.open&&!this.contained&&(this.modal.activate(),h(this)),this.open&&this.contained&&(this.modal.deactivate(),p(this))}async show(){if(!this.open)return this.open=!0,w(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,w(this,"sl-after-hide")}render(){return f`
      <div
        part="base"
        class=${k({drawer:!0,"drawer--open":this.open,"drawer--top":this.placement==="top","drawer--end":this.placement==="end","drawer--bottom":this.placement==="bottom","drawer--start":this.placement==="start","drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":this.localize.dir()==="rtl","drawer--has-footer":this.hasSlotController.test("footer")})}
      >
        <div part="overlay" class="drawer__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${y(this.noHeader?this.label:void 0)}
          aria-labelledby=${y(this.noHeader?void 0:"title")}
          tabindex="0"
        >
          ${this.noHeader?"":f`
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
    `}};e.styles=L,a([c(".drawer")],e.prototype,"drawer",2),a([c(".drawer__panel")],e.prototype,"panel",2),a([c(".drawer__overlay")],e.prototype,"overlay",2),a([s({type:Boolean,reflect:!0})],e.prototype,"open",2),a([s({reflect:!0})],e.prototype,"label",2),a([s({reflect:!0})],e.prototype,"placement",2),a([s({type:Boolean,reflect:!0})],e.prototype,"contained",2),a([s({attribute:"no-header",type:Boolean,reflect:!0})],e.prototype,"noHeader",2),a([u("open",{waitUntilFirstUpdate:!0})],e.prototype,"handleOpenChange",1),a([u("contained",{waitUntilFirstUpdate:!0})],e.prototype,"handleNoModalChange",1),e=a([b("sl-drawer")],e);i("drawer.showTop",{keyframes:[{opacity:0,translate:"0 -100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}});i("drawer.hideTop",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 -100%"}],options:{duration:250,easing:"ease"}});i("drawer.showEnd",{keyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}});i("drawer.hideEnd",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],options:{duration:250,easing:"ease"}});i("drawer.showBottom",{keyframes:[{opacity:0,translate:"0 100%"},{opacity:1,translate:"0 0"}],options:{duration:250,easing:"ease"}});i("drawer.hideBottom",{keyframes:[{opacity:1,translate:"0 0"},{opacity:0,translate:"0 100%"}],options:{duration:250,easing:"ease"}});i("drawer.showStart",{keyframes:[{opacity:0,translate:"-100%"},{opacity:1,translate:"0"}],rtlKeyframes:[{opacity:0,translate:"100%"},{opacity:1,translate:"0"}],options:{duration:250,easing:"ease"}});i("drawer.hideStart",{keyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"-100%"}],rtlKeyframes:[{opacity:1,translate:"0"},{opacity:0,translate:"100%"}],options:{duration:250,easing:"ease"}});i("drawer.denyClose",{keyframes:[{scale:1},{scale:1.01},{scale:1}],options:{duration:250}});i("drawer.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}});i("drawer.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}});export{e as a};
