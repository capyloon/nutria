import{a as v}from"./chunk.ED54TTFE.js";import{a as M}from"./chunk.TFXCRWDD.js";import{c as k}from"./chunk.PYPBGY2O.js";import{a as p,c}from"./chunk.LXSZTUPS.js";import{a as m,c as f}from"./chunk.SWQG23VR.js";import{c as T}from"./chunk.ISLNSUAB.js";import{a as w}from"./chunk.LSNASYMO.js";import{a as b}from"./chunk.DBCWAMJH.js";import{a as l,b as u}from"./chunk.JUX3LFDW.js";import{a as y,b as a,d,f as E}from"./chunk.X7Q42RGY.js";import{c as g}from"./chunk.3G4FHXSN.js";import{g as s}from"./chunk.OAQCUA7X.js";var n=class extends E{constructor(){super(...arguments);this.localize=new T(this);this.open=!1;this.placement="bottom-start";this.disabled=!1;this.stayOpenOnSelect=!1;this.distance=0;this.skidding=0;this.hoist=!1}connectedCallback(){super.connectedCallback(),this.handleMenuItemActivate=this.handleMenuItemActivate.bind(this),this.handlePanelSelect=this.handlePanelSelect.bind(this),this.handleDocumentKeyDown=this.handleDocumentKeyDown.bind(this),this.handleDocumentMouseDown=this.handleDocumentMouseDown.bind(this),this.containingElement||(this.containingElement=this)}firstUpdated(){this.panel.hidden=!this.open,this.open&&(this.addOpenListeners(),this.popup.active=!0)}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners(),this.hide()}focusOnTrigger(){let t=this.trigger.querySelector("slot").assignedElements({flatten:!0})[0];typeof(t==null?void 0:t.focus)=="function"&&t.focus()}getMenu(){return this.panel.querySelector("slot").assignedElements({flatten:!0}).find(t=>t.tagName.toLowerCase()==="sl-menu")}handleDocumentKeyDown(e){var t;if(e.key==="Escape"){this.hide(),this.focusOnTrigger();return}if(e.key==="Tab"){if(this.open&&((t=document.activeElement)==null?void 0:t.tagName.toLowerCase())==="sl-menu-item"){e.preventDefault(),this.hide(),this.focusOnTrigger();return}setTimeout(()=>{var o,r,h;let i=((o=this.containingElement)==null?void 0:o.getRootNode())instanceof ShadowRoot?(h=(r=document.activeElement)==null?void 0:r.shadowRoot)==null?void 0:h.activeElement:document.activeElement;(!this.containingElement||(i==null?void 0:i.closest(this.containingElement.tagName.toLowerCase()))!==this.containingElement)&&this.hide()})}}handleDocumentMouseDown(e){let t=e.composedPath();this.containingElement&&!t.includes(this.containingElement)&&this.hide()}handleMenuItemActivate(e){let t=e.target;k(t,this.panel)}handlePanelSelect(e){let t=e.target;!this.stayOpenOnSelect&&t.tagName.toLowerCase()==="sl-menu"&&(this.hide(),this.focusOnTrigger())}handleTriggerClick(){this.open?this.hide():this.show()}handleTriggerKeyDown(e){if(e.key==="Escape"){this.focusOnTrigger(),this.hide();return}if([" ","Enter"].includes(e.key)){e.preventDefault(),this.handleTriggerClick();return}let t=this.getMenu();if(t){let i=t.defaultSlot.assignedElements({flatten:!0}),o=i[0],r=i[i.length-1];["ArrowDown","ArrowUp","Home","End"].includes(e.key)&&(e.preventDefault(),this.open||this.show(),i.length>0&&requestAnimationFrame(()=>{(e.key==="ArrowDown"||e.key==="Home")&&(t.setCurrentItem(o),o.focus()),(e.key==="ArrowUp"||e.key==="End")&&(t.setCurrentItem(r),r.focus())}));let h=["Tab","Shift","Meta","Ctrl","Alt"];this.open&&!h.includes(e.key)&&t.typeToSelect(e)}}handleTriggerKeyUp(e){e.key===" "&&e.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){let i=this.trigger.querySelector("slot").assignedElements({flatten:!0}).find(r=>M(r).start),o;if(i){switch(i.tagName.toLowerCase()){case"sl-button":case"sl-icon-button":o=i.button;break;default:o=i}o.setAttribute("aria-haspopup","true"),o.setAttribute("aria-expanded",this.open?"true":"false")}}async show(){if(!this.open)return this.open=!0,u(this,"sl-after-show")}async hide(){if(!!this.open)return this.open=!1,u(this,"sl-after-hide")}reposition(){this.popup.reposition()}addOpenListeners(){this.panel.addEventListener("sl-activate",this.handleMenuItemActivate),this.panel.addEventListener("sl-select",this.handlePanelSelect),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){this.panel.removeEventListener("sl-activate",this.handleMenuItemActivate),this.panel.removeEventListener("sl-select",this.handlePanelSelect),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown)}async handleOpenChange(){if(this.disabled){this.open=!1;return}if(this.updateAccessibleTrigger(),this.open){l(this,"sl-show"),this.addOpenListeners(),await c(this),this.panel.hidden=!1,this.popup.active=!0;let{keyframes:e,options:t}=f(this,"dropdown.show",{dir:this.localize.dir()});await p(this.popup.popup,e,t),l(this,"sl-after-show")}else{l(this,"sl-hide"),this.removeOpenListeners(),await c(this);let{keyframes:e,options:t}=f(this,"dropdown.hide",{dir:this.localize.dir()});await p(this.popup.popup,e,t),this.panel.hidden=!0,this.popup.active=!1,l(this,"sl-after-hide")}}render(){return g`
      <sl-popup
        part="base"
        id="dropdown"
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        class=${w({dropdown:!0,"dropdown--open":this.open})}
      >
        <span
          slot="anchor"
          part="trigger"
          class="dropdown__trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
        >
          <slot name="trigger" @slotchange=${this.handleTriggerSlotChange}></slot>
        </span>

        <div
          part="panel"
          class="dropdown__panel"
          aria-hidden=${this.open?"false":"true"}
          aria-labelledby="dropdown"
        >
          <slot></slot>
        </div>
      </sl-popup>
    `}};n.styles=v,s([d(".dropdown")],n.prototype,"popup",2),s([d(".dropdown__trigger")],n.prototype,"trigger",2),s([d(".dropdown__panel")],n.prototype,"panel",2),s([a({type:Boolean,reflect:!0})],n.prototype,"open",2),s([a({reflect:!0})],n.prototype,"placement",2),s([a({type:Boolean,reflect:!0})],n.prototype,"disabled",2),s([a({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],n.prototype,"stayOpenOnSelect",2),s([a({attribute:!1})],n.prototype,"containingElement",2),s([a({type:Number})],n.prototype,"distance",2),s([a({type:Number})],n.prototype,"skidding",2),s([a({type:Boolean})],n.prototype,"hoist",2),s([b("open",{waitUntilFirstUpdate:!0})],n.prototype,"handleOpenChange",1),n=s([y("sl-dropdown")],n);m("dropdown.show",{keyframes:[{opacity:0,transform:"scale(0.9)"},{opacity:1,transform:"scale(1)"}],options:{duration:100,easing:"ease"}});m("dropdown.hide",{keyframes:[{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.9)"}],options:{duration:100,easing:"ease"}});export{n as a};
