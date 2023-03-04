import{a as m,c}from"./chunk.UJEHPUK2.js";import{a as d}from"./chunk.KLRPP4NQ.js";import{a as l,d as h}from"./chunk.HFPOGNHG.js";import{b as v}from"./chunk.6D3DWAMV.js";import{a as b}from"./chunk.RHW2XED2.js";import{a as y}from"./chunk.RUACWBWF.js";import{a as w}from"./chunk.6VOWGSLN.js";import{a as n}from"./chunk.AR2QSYXF.js";import{a as p,b as s,d as u,f}from"./chunk.PRU55YXS.js";import{c as r}from"./chunk.SYBSOZNG.js";import{e as t}from"./chunk.I4CX4JT3.js";var i=Object.assign(document.createElement("div"),{className:"sl-toast-stack"}),e=class extends f{constructor(){super(...arguments);this.hasSlotController=new b(this,"icon","suffix");this.localize=new v(this);this.open=!1;this.closable=!1;this.variant="primary";this.duration=1/0}firstUpdated(){this.base.hidden=!this.open}restartAutoHide(){clearTimeout(this.autoHideTimeout),this.open&&this.duration<1/0&&(this.autoHideTimeout=window.setTimeout(()=>this.hide(),this.duration))}handleCloseClick(){this.hide()}handleMouseMove(){this.restartAutoHide()}async handleOpenChange(){if(this.open){this.emit("sl-show"),this.duration<1/0&&this.restartAutoHide(),await h(this.base),this.base.hidden=!1;let{keyframes:a,options:o}=c(this,"alert.show",{dir:this.localize.dir()});await l(this.base,a,o),this.emit("sl-after-show")}else{this.emit("sl-hide"),clearTimeout(this.autoHideTimeout),await h(this.base);let{keyframes:a,options:o}=c(this,"alert.hide",{dir:this.localize.dir()});await l(this.base,a,o),this.base.hidden=!0,this.emit("sl-after-hide")}}handleDurationChange(){this.restartAutoHide()}async show(){if(!this.open)return this.open=!0,d(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,d(this,"sl-after-hide")}async toast(){return new Promise(a=>{i.parentElement===null&&document.body.append(i),i.appendChild(this),requestAnimationFrame(()=>{this.clientWidth,this.show()}),this.addEventListener("sl-after-hide",()=>{i.removeChild(this),a(),i.querySelector("sl-alert")===null&&i.remove()},{once:!0})})}render(){return r`
      <div
        part="base"
        class=${y({alert:!0,"alert--open":this.open,"alert--closable":this.closable,"alert--has-icon":this.hasSlotController.test("icon"),"alert--primary":this.variant==="primary","alert--success":this.variant==="success","alert--neutral":this.variant==="neutral","alert--warning":this.variant==="warning","alert--danger":this.variant==="danger"})}
        role="alert"
        aria-hidden=${this.open?"false":"true"}
        @mousemove=${this.handleMouseMove}
      >
        <slot name="icon" part="icon" class="alert__icon"></slot>

        <slot part="message" class="alert__message" aria-live="polite"></slot>

        ${this.closable?r`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                class="alert__close-button"
                name="x-lg"
                library="system"
                label=${this.localize.term("close")}
                @click=${this.handleCloseClick}
              ></sl-icon-button>
            `:""}
      </div>
    `}};e.styles=w,t([u('[part~="base"]')],e.prototype,"base",2),t([s({type:Boolean,reflect:!0})],e.prototype,"open",2),t([s({type:Boolean,reflect:!0})],e.prototype,"closable",2),t([s({reflect:!0})],e.prototype,"variant",2),t([s({type:Number})],e.prototype,"duration",2),t([n("open",{waitUntilFirstUpdate:!0})],e.prototype,"handleOpenChange",1),t([n("duration")],e.prototype,"handleDurationChange",1),e=t([p("sl-alert")],e);m("alert.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:"ease"}});m("alert.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:"ease"}});export{e as a};
