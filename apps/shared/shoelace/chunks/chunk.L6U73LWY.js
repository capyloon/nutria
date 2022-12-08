import{a as b}from"./chunk.J7KZ4VGM.js";import{a as l}from"./chunk.KLRPP4NQ.js";import{a as h,b as r,c as d}from"./chunk.LXSZTUPS.js";import{a as p,c as u}from"./chunk.SWQG23VR.js";import{c as g}from"./chunk.MJKKE2MR.js";import{a as f}from"./chunk.DUQXEIJD.js";import{a as o}from"./chunk.DBCWAMJH.js";import{a as m,b as s,d as a,f as y}from"./chunk.N2CXUFX7.js";import{c}from"./chunk.I36YJ673.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends y{constructor(){super(...arguments);this.localize=new g(this);this.content="";this.placement="top";this.disabled=!1;this.distance=8;this.open=!1;this.skidding=0;this.trigger="hover focus";this.hoist=!1}connectedCallback(){super.connectedCallback(),this.handleBlur=this.handleBlur.bind(this),this.handleClick=this.handleClick.bind(this),this.handleFocus=this.handleFocus.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handleMouseOver=this.handleMouseOver.bind(this),this.handleMouseOut=this.handleMouseOut.bind(this),this.updateComplete.then(()=>{this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("keydown",this.handleKeyDown),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)})}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("blur",this.handleBlur,!0),this.removeEventListener("focus",this.handleFocus,!0),this.removeEventListener("click",this.handleClick),this.removeEventListener("keydown",this.handleKeyDown),this.removeEventListener("mouseover",this.handleMouseOver),this.removeEventListener("mouseout",this.handleMouseOut)}async show(){if(!this.open)return this.open=!0,l(this,"sl-after-show")}async hide(){if(!!this.open)return this.open=!1,l(this,"sl-after-hide")}getTarget(){let i=[...this.children].find(n=>n.tagName.toLowerCase()!=="style"&&n.getAttribute("slot")!=="content");if(!i)throw new Error("Invalid tooltip target: no child element was found.");return i}handleBlur(){this.hasTrigger("focus")&&this.hide()}handleClick(){this.hasTrigger("click")&&(this.open?this.hide():this.show())}handleFocus(){this.hasTrigger("focus")&&this.show()}handleKeyDown(i){this.open&&i.key==="Escape"&&(i.stopPropagation(),this.hide())}handleMouseOver(){if(this.hasTrigger("hover")){let i=r(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),i)}}handleMouseOut(){if(this.hasTrigger("hover")){let i=r(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),i)}}async handleOpenChange(){if(this.open){if(this.disabled)return;this.emit("sl-show"),await d(this.body),this.body.hidden=!1,this.popup.active=!0;let{keyframes:i,options:n}=u(this,"tooltip.show",{dir:this.localize.dir()});await h(this.popup.popup,i,n),this.emit("sl-after-show")}else{this.emit("sl-hide"),await d(this.body);let{keyframes:i,options:n}=u(this,"tooltip.hide",{dir:this.localize.dir()});await h(this.popup.popup,i,n),this.popup.active=!1,this.body.hidden=!0,this.emit("sl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}hasTrigger(i){return this.trigger.split(" ").includes(i)}render(){return c`
      <sl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${f({tooltip:!0,"tooltip--open":this.open})}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        arrow
      >
        <slot slot="anchor" aria-describedby="tooltip"></slot>

        <slot
          name="content"
          part="body"
          id="tooltip"
          class="tooltip__body"
          role="tooltip"
          aria-live=${this.open?"polite":"off"}
        >
          ${this.content}
        </slot>
      </sl-popup>
    `}};e.styles=b,t([a("slot:not([name])")],e.prototype,"defaultSlot",2),t([a(".tooltip__body")],e.prototype,"body",2),t([a("sl-popup")],e.prototype,"popup",2),t([s()],e.prototype,"content",2),t([s()],e.prototype,"placement",2),t([s({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([s({type:Number})],e.prototype,"distance",2),t([s({type:Boolean,reflect:!0})],e.prototype,"open",2),t([s({type:Number})],e.prototype,"skidding",2),t([s()],e.prototype,"trigger",2),t([s({type:Boolean})],e.prototype,"hoist",2),t([o("open",{waitUntilFirstUpdate:!0})],e.prototype,"handleOpenChange",1),t([o("content"),o("distance"),o("hoist"),o("placement"),o("skidding")],e.prototype,"handleOptionsChange",1),t([o("disabled")],e.prototype,"handleDisabledChange",1),e=t([m("sl-tooltip")],e);p("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}});p("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}});export{e as a};
