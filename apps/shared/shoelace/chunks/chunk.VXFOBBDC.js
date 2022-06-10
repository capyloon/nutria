import{a as _}from"./chunk.SSB5VJUN.js";import{c as m}from"./chunk.PYPBGY2O.js";import{h as w}from"./chunk.RLLTRZYL.js";import{a as A}from"./chunk.PC5WGFOA.js";import{a as p}from"./chunk.OSEV3RCT.js";import{a as d}from"./chunk.V4OMSSO6.js";import{a as y,b as n,c as T,d as c}from"./chunk.GVR6SJVE.js";import{c as h,h as g}from"./chunk.7EIHAL55.js";import{a as f,g as o}from"./chunk.OAQCUA7X.js";var i=class extends g{constructor(){super(...arguments);this.localize=new w(this);this.tabs=[];this.panels=[];this.hasScrollControls=!1;this.placement="top";this.activation="auto";this.noScrollControls=!1}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>{this.preventIndicatorTransition(),this.repositionIndicator(),this.updateScrollControls()}),this.mutationObserver=new MutationObserver(t=>{t.some(s=>!["aria-labelledby","aria-controls"].includes(s.attributeName))&&setTimeout(()=>this.setAriaLabels()),t.some(s=>s.attributeName==="disabled")&&this.syncTabsAndPanels()}),this.updateComplete.then(()=>{this.syncTabsAndPanels(),this.mutationObserver.observe(this,{attributes:!0,childList:!0,subtree:!0}),this.resizeObserver.observe(this.nav),new IntersectionObserver((s,e)=>{var l;s[0].intersectionRatio>0&&(this.setAriaLabels(),this.setActiveTab((l=this.getActiveTab())!=null?l:this.tabs[0],{emitEvents:!1}),e.unobserve(s[0].target))}).observe(this.tabGroup)})}disconnectedCallback(){this.mutationObserver.disconnect(),this.resizeObserver.unobserve(this.nav)}show(t){let s=this.tabs.find(e=>e.panel===t);s&&this.setActiveTab(s,{scrollBehavior:"smooth"})}getAllTabs(t=!1){return[...this.shadowRoot.querySelector('slot[name="nav"]').assignedElements()].filter(e=>t?e.tagName.toLowerCase()==="sl-tab":e.tagName.toLowerCase()==="sl-tab"&&!e.disabled)}getAllPanels(){return[...this.body.querySelector("slot").assignedElements()].filter(s=>s.tagName.toLowerCase()==="sl-tab-panel")}getActiveTab(){return this.tabs.find(t=>t.active)}handleClick(t){let e=t.target.closest("sl-tab");(e==null?void 0:e.closest("sl-tab-group"))===this&&e!==null&&this.setActiveTab(e,{scrollBehavior:"smooth"})}handleKeyDown(t){let e=t.target.closest("sl-tab");if((e==null?void 0:e.closest("sl-tab-group"))===this&&(["Enter"," "].includes(t.key)&&e!==null&&(this.setActiveTab(e,{scrollBehavior:"smooth"}),t.preventDefault()),["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(t.key))){let r=document.activeElement,b=this.localize.dir()==="rtl";if((r==null?void 0:r.tagName.toLowerCase())==="sl-tab"){let a=this.tabs.indexOf(r);t.key==="Home"?a=0:t.key==="End"?a=this.tabs.length-1:["top","bottom"].includes(this.placement)&&t.key===(b?"ArrowRight":"ArrowLeft")||["start","end"].includes(this.placement)&&t.key==="ArrowUp"?a--:(["top","bottom"].includes(this.placement)&&t.key===(b?"ArrowLeft":"ArrowRight")||["start","end"].includes(this.placement)&&t.key==="ArrowDown")&&a++,a<0&&(a=this.tabs.length-1),a>this.tabs.length-1&&(a=0),this.tabs[a].focus({preventScroll:!0}),this.activation==="auto"&&this.setActiveTab(this.tabs[a],{scrollBehavior:"smooth"}),["top","bottom"].includes(this.placement)&&m(this.tabs[a],this.nav,"horizontal"),t.preventDefault()}}}handleScrollToStart(){this.nav.scroll({left:this.localize.dir()==="rtl"?this.nav.scrollLeft+this.nav.clientWidth:this.nav.scrollLeft-this.nav.clientWidth,behavior:"smooth"})}handleScrollToEnd(){this.nav.scroll({left:this.localize.dir()==="rtl"?this.nav.scrollLeft-this.nav.clientWidth:this.nav.scrollLeft+this.nav.clientWidth,behavior:"smooth"})}updateScrollControls(){this.noScrollControls?this.hasScrollControls=!1:this.hasScrollControls=["top","bottom"].includes(this.placement)&&this.nav.scrollWidth>this.nav.clientWidth}setActiveTab(t,s){if(s=f({emitEvents:!0,scrollBehavior:"auto"},s),t!==this.activeTab&&!t.disabled){let e=this.activeTab;this.activeTab=t,this.tabs.map(l=>l.active=l===this.activeTab),this.panels.map(l=>{var r;return l.active=l.name===((r=this.activeTab)==null?void 0:r.panel)}),this.syncIndicator(),["top","bottom"].includes(this.placement)&&m(this.activeTab,this.nav,"horizontal",s.scrollBehavior),s.emitEvents&&(e&&d(this,"sl-tab-hide",{detail:{name:e.panel}}),d(this,"sl-tab-show",{detail:{name:this.activeTab.panel}}))}}setAriaLabels(){this.tabs.forEach(t=>{let s=this.panels.find(e=>e.name===t.panel);s&&(t.setAttribute("aria-controls",s.getAttribute("id")),s.setAttribute("aria-labelledby",t.getAttribute("id")))})}syncIndicator(){this.getActiveTab()?(this.indicator.style.display="block",this.repositionIndicator()):this.indicator.style.display="none"}repositionIndicator(){let t=this.getActiveTab();if(!t)return;let s=t.clientWidth,e=t.clientHeight,l=this.localize.dir()==="rtl",r=this.getAllTabs(!0),a=r.slice(0,r.indexOf(t)).reduce((u,v)=>({left:u.left+v.clientWidth,top:u.top+v.clientHeight}),{left:0,top:0});switch(this.placement){case"top":case"bottom":this.indicator.style.width=`${s}px`,this.indicator.style.height="auto",this.indicator.style.transform=l?`translateX(${-1*a.left}px)`:`translateX(${a.left}px)`;break;case"start":case"end":this.indicator.style.width="auto",this.indicator.style.height=`${e}px`,this.indicator.style.transform=`translateY(${a.top}px)`;break}}preventIndicatorTransition(){let t=this.indicator.style.transition;this.indicator.style.transition="none",requestAnimationFrame(()=>{this.indicator.style.transition=t})}syncTabsAndPanels(){this.tabs=this.getAllTabs(),this.panels=this.getAllPanels(),this.syncIndicator()}render(){let t=this.localize.dir()==="rtl";return h`
      <div
        part="base"
        class=${A({"tab-group":!0,"tab-group--top":this.placement==="top","tab-group--bottom":this.placement==="bottom","tab-group--start":this.placement==="start","tab-group--end":this.placement==="end","tab-group--rtl":this.localize.dir()==="rtl","tab-group--has-scroll-controls":this.hasScrollControls})}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container" part="nav">
          ${this.hasScrollControls?h`
                <sl-icon-button
                  part="scroll-button scroll-button--start"
                  exportparts="base:scroll-button__base"
                  class="tab-group__scroll-button tab-group__scroll-button--start"
                  name=${t?"chevron-right":"chevron-left"}
                  library="system"
                  label=${this.localize.term("scrollToStart")}
                  @click=${this.handleScrollToStart}
                ></sl-icon-button>
              `:""}

          <div class="tab-group__nav">
            <div part="tabs" class="tab-group__tabs" role="tablist">
              <div part="active-tab-indicator" class="tab-group__indicator"></div>
              <slot name="nav" @slotchange=${this.syncTabsAndPanels}></slot>
            </div>
          </div>

          ${this.hasScrollControls?h`
                <sl-icon-button
                  part="scroll-button scroll-button--end"
                  exportparts="base:scroll-button__base"
                  class="tab-group__scroll-button tab-group__scroll-button--end"
                  name=${t?"chevron-left":"chevron-right"}
                  library="system"
                  label=${this.localize.term("scrollToEnd")}
                  @click=${this.handleScrollToEnd}
                ></sl-icon-button>
              `:""}
        </div>

        <div part="body" class="tab-group__body">
          <slot @slotchange=${this.syncTabsAndPanels}></slot>
        </div>
      </div>
    `}};i.styles=_,o([c(".tab-group")],i.prototype,"tabGroup",2),o([c(".tab-group__body")],i.prototype,"body",2),o([c(".tab-group__nav")],i.prototype,"nav",2),o([c(".tab-group__indicator")],i.prototype,"indicator",2),o([T()],i.prototype,"hasScrollControls",2),o([n()],i.prototype,"placement",2),o([n()],i.prototype,"activation",2),o([n({attribute:"no-scroll-controls",type:Boolean})],i.prototype,"noScrollControls",2),o([n()],i.prototype,"lang",2),o([p("noScrollControls",{waitUntilFirstUpdate:!0})],i.prototype,"updateScrollControls",1),o([p("placement",{waitUntilFirstUpdate:!0})],i.prototype,"syncIndicator",1),i=o([y("sl-tab-group")],i);export{i as a};
