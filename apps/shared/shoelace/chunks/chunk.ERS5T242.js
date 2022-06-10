import{a as E}from"./chunk.REGTBBPP.js";import{a as X}from"./chunk.4CLSN6UG.js";import{a as u,b as w}from"./chunk.PYPBGY2O.js";import{a as l,c}from"./chunk.F64FS4SB.js";import{a,c as d}from"./chunk.O7L2VUC4.js";import{h as T}from"./chunk.RLLTRZYL.js";import{a as _}from"./chunk.RHW2XED2.js";import{a as g}from"./chunk.PC5WGFOA.js";import{a as C}from"./chunk.OSEV3RCT.js";import{a as s,b as y}from"./chunk.V4OMSSO6.js";import{a as f}from"./chunk.2XQLLZV4.js";import{a as k,b as n,d as p}from"./chunk.GVR6SJVE.js";import{c as h,h as v}from"./chunk.7EIHAL55.js";import{g as r}from"./chunk.OAQCUA7X.js";function b(m){return m.charAt(0).toUpperCase()+m.slice(1)}var e=class extends v{constructor(){super(...arguments);this.hasSlotController=new _(this,"footer");this.localize=new T(this);this.open=!1;this.label="";this.placement="end";this.contained=!1;this.noHeader=!1}connectedCallback(){super.connectedCallback(),this.modal=new X(this)}firstUpdated(){this.drawer.hidden=!this.open,this.open&&!this.contained&&(this.modal.activate(),u(this))}disconnectedCallback(){super.disconnectedCallback(),w(this)}async show(){if(!this.open)return this.open=!0,y(this,"sl-after-show")}async hide(){if(!!this.open)return this.open=!1,y(this,"sl-after-hide")}requestClose(t){if(s(this,"sl-request-close",{cancelable:!0,detail:{source:t}}).defaultPrevented){let o=d(this,"drawer.denyClose",{dir:this.localize.dir()});l(this.panel,o.keyframes,o.options);return}this.hide()}handleKeyDown(t){t.key==="Escape"&&(t.stopPropagation(),this.requestClose("keyboard"))}async handleOpenChange(){if(this.open){s(this,"sl-show"),this.originalTrigger=document.activeElement,this.contained||(this.modal.activate(),u(this));let t=this.querySelector("[autofocus]");t&&t.removeAttribute("autofocus"),await Promise.all([c(this.drawer),c(this.overlay)]),this.drawer.hidden=!1,requestAnimationFrame(()=>{s(this,"sl-initial-focus",{cancelable:!0}).defaultPrevented||(t?t.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),t&&t.setAttribute("autofocus","")});let i=d(this,`drawer.show${b(this.placement)}`,{dir:this.localize.dir()}),o=d(this,"drawer.overlay.show",{dir:this.localize.dir()});await Promise.all([l(this.panel,i.keyframes,i.options),l(this.overlay,o.keyframes,o.options)]),s(this,"sl-after-show")}else{s(this,"sl-hide"),this.modal.deactivate(),w(this),await Promise.all([c(this.drawer),c(this.overlay)]);let t=d(this,`drawer.hide${b(this.placement)}`,{dir:this.localize.dir()}),i=d(this,"drawer.overlay.hide",{dir:this.localize.dir()});await Promise.all([l(this.panel,t.keyframes,t.options),l(this.overlay,i.keyframes,i.options)]),this.drawer.hidden=!0;let o=this.originalTrigger;typeof(o==null?void 0:o.focus)=="function"&&setTimeout(()=>o.focus()),s(this,"sl-after-hide")}}render(){return h`
      <div
        part="base"
        class=${g({drawer:!0,"drawer--open":this.open,"drawer--top":this.placement==="top","drawer--end":this.placement==="end","drawer--bottom":this.placement==="bottom","drawer--start":this.placement==="start","drawer--contained":this.contained,"drawer--fixed":!this.contained,"drawer--rtl":this.localize.dir()==="rtl","drawer--has-footer":this.hasSlotController.test("footer")})}
        @keydown=${this.handleKeyDown}
      >
        <div part="overlay" class="drawer__overlay" @click=${()=>this.requestClose("overlay")} tabindex="-1"></div>

        <div
          part="panel"
          class="drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${f(this.noHeader?this.label:void 0)}
          aria-labelledby=${f(this.noHeader?void 0:"title")}
          tabindex="0"
        >
          ${this.noHeader?"":h`
                <header part="header" class="drawer__header">
                  <h2 part="title" class="drawer__title" id="title">
                    <!-- If there's no label, use an invisible character to prevent the header from collapsing -->
                    <slot name="label"> ${this.label.length>0?this.label:String.fromCharCode(65279)} </slot>
                  </h2>
                  <sl-icon-button
                    part="close-button"
                    exportparts="base:close-button__base"
                    class="drawer__close"
                    name="x"
                    label=${this.localize.term("close")}
                    library="system"
                    @click=${()=>this.requestClose("close-button")}
                  ></sl-icon-button>
                </header>
              `}

          <div part="body" class="drawer__body">
            <slot></slot>
          </div>

          <footer part="footer" class="drawer__footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    `}};e.styles=E,r([p(".drawer")],e.prototype,"drawer",2),r([p(".drawer__panel")],e.prototype,"panel",2),r([p(".drawer__overlay")],e.prototype,"overlay",2),r([n({type:Boolean,reflect:!0})],e.prototype,"open",2),r([n({reflect:!0})],e.prototype,"label",2),r([n({reflect:!0})],e.prototype,"placement",2),r([n({type:Boolean,reflect:!0})],e.prototype,"contained",2),r([n({attribute:"no-header",type:Boolean,reflect:!0})],e.prototype,"noHeader",2),r([C("open",{waitUntilFirstUpdate:!0})],e.prototype,"handleOpenChange",1),e=r([k("sl-drawer")],e);a("drawer.showTop",{keyframes:[{opacity:0,transform:"translateY(-100%)"},{opacity:1,transform:"translateY(0)"}],options:{duration:250,easing:"ease"}});a("drawer.hideTop",{keyframes:[{opacity:1,transform:"translateY(0)"},{opacity:0,transform:"translateY(-100%)"}],options:{duration:250,easing:"ease"}});a("drawer.showEnd",{keyframes:[{opacity:0,transform:"translateX(100%)"},{opacity:1,transform:"translateX(0)"}],rtlKeyframes:[{opacity:0,transform:"translateX(-100%)"},{opacity:1,transform:"translateX(0)"}],options:{duration:250,easing:"ease"}});a("drawer.hideEnd",{keyframes:[{opacity:1,transform:"translateX(0)"},{opacity:0,transform:"translateX(100%)"}],rtlKeyframes:[{opacity:1,transform:"translateX(0)"},{opacity:0,transform:"translateX(-100%)"}],options:{duration:250,easing:"ease"}});a("drawer.showBottom",{keyframes:[{opacity:0,transform:"translateY(100%)"},{opacity:1,transform:"translateY(0)"}],options:{duration:250,easing:"ease"}});a("drawer.hideBottom",{keyframes:[{opacity:1,transform:"translateY(0)"},{opacity:0,transform:"translateY(100%)"}],options:{duration:250,easing:"ease"}});a("drawer.showStart",{keyframes:[{opacity:0,transform:"translateX(-100%)"},{opacity:1,transform:"translateX(0)"}],rtlKeyframes:[{opacity:0,transform:"translateX(100%)"},{opacity:1,transform:"translateX(0)"}],options:{duration:250,easing:"ease"}});a("drawer.hideStart",{keyframes:[{opacity:1,transform:"translateX(0)"},{opacity:0,transform:"translateX(-100%)"}],rtlKeyframes:[{opacity:1,transform:"translateX(0)"},{opacity:0,transform:"translateX(100%)"}],options:{duration:250,easing:"ease"}});a("drawer.denyClose",{keyframes:[{transform:"scale(1)"},{transform:"scale(1.01)"},{transform:"scale(1)"}],options:{duration:250}});a("drawer.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}});a("drawer.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}});export{e as a};
