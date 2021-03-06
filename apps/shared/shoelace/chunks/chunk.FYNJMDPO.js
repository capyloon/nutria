import{a as d,c as m}from"./chunk.F64FS4SB.js";import{a as c,c as u}from"./chunk.O7L2VUC4.js";import{h as w}from"./chunk.RLLTRZYL.js";import{a as v}from"./chunk.RHW2XED2.js";import{a as g}from"./chunk.TOEH4PPA.js";import{a as b}from"./chunk.PC5WGFOA.js";import{a as h}from"./chunk.OSEV3RCT.js";import{a as r,b as l}from"./chunk.V4OMSSO6.js";import{a as f,b as s,d as y}from"./chunk.GVR6SJVE.js";import{c as n,h as p}from"./chunk.7EIHAL55.js";import{g as e}from"./chunk.OAQCUA7X.js";var a=Object.assign(document.createElement("div"),{className:"sl-toast-stack"}),t=class extends p{constructor(){super(...arguments);this.hasSlotController=new v(this,"icon","suffix");this.localize=new w(this);this.open=!1;this.closable=!1;this.variant="primary";this.duration=1/0}firstUpdated(){this.base.hidden=!this.open}async show(){if(!this.open)return this.open=!0,l(this,"sl-after-show")}async hide(){if(!!this.open)return this.open=!1,l(this,"sl-after-hide")}async toast(){return new Promise(i=>{a.parentElement===null&&document.body.append(a),a.appendChild(this),requestAnimationFrame(()=>{this.clientWidth,this.show()}),this.addEventListener("sl-after-hide",()=>{a.removeChild(this),i(),a.querySelector("sl-alert")===null&&a.remove()},{once:!0})})}restartAutoHide(){clearTimeout(this.autoHideTimeout),this.open&&this.duration<1/0&&(this.autoHideTimeout=window.setTimeout(()=>this.hide(),this.duration))}handleCloseClick(){this.hide()}handleMouseMove(){this.restartAutoHide()}async handleOpenChange(){if(this.open){r(this,"sl-show"),this.duration<1/0&&this.restartAutoHide(),await m(this.base),this.base.hidden=!1;let{keyframes:i,options:o}=u(this,"alert.show",{dir:this.localize.dir()});await d(this.base,i,o),r(this,"sl-after-show")}else{r(this,"sl-hide"),clearTimeout(this.autoHideTimeout),await m(this.base);let{keyframes:i,options:o}=u(this,"alert.hide",{dir:this.localize.dir()});await d(this.base,i,o),this.base.hidden=!0,r(this,"sl-after-hide")}}handleDurationChange(){this.restartAutoHide()}render(){return n`
      <div
        part="base"
        class=${b({alert:!0,"alert--open":this.open,"alert--closable":this.closable,"alert--has-icon":this.hasSlotController.test("icon"),"alert--primary":this.variant==="primary","alert--success":this.variant==="success","alert--neutral":this.variant==="neutral","alert--warning":this.variant==="warning","alert--danger":this.variant==="danger"})}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        aria-hidden=${this.open?"false":"true"}
        @mousemove=${this.handleMouseMove}
      >
        <span part="icon" class="alert__icon">
          <slot name="icon"></slot>
        </span>

        <span part="message" class="alert__message">
          <slot></slot>
        </span>

        ${this.closable?n`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                class="alert__close-button"
                name="x"
                library="system"
                @click=${this.handleCloseClick}
              ></sl-icon-button>
            `:""}
      </div>
    `}};t.styles=g,e([y('[part="base"]')],t.prototype,"base",2),e([s({type:Boolean,reflect:!0})],t.prototype,"open",2),e([s({type:Boolean,reflect:!0})],t.prototype,"closable",2),e([s({reflect:!0})],t.prototype,"variant",2),e([s({type:Number})],t.prototype,"duration",2),e([h("open",{waitUntilFirstUpdate:!0})],t.prototype,"handleOpenChange",1),e([h("duration")],t.prototype,"handleDurationChange",1),t=e([f("sl-alert")],t);c("alert.show",{keyframes:[{opacity:0,transform:"scale(0.8)"},{opacity:1,transform:"scale(1)"}],options:{duration:250,easing:"ease"}});c("alert.hide",{keyframes:[{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.8)"}],options:{duration:250,easing:"ease"}});export{t as a};
