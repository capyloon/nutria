import{a as _}from"./chunk.VF5DF77H.js";import{c as m}from"./chunk.PYPBGY2O.js";import{c as w}from"./chunk.ISLNSUAB.js";import{a as T}from"./chunk.LSNASYMO.js";import{a as p}from"./chunk.DBCWAMJH.js";import{a as d}from"./chunk.JUX3LFDW.js";import{a as g,b as h,c as y,d as n,f as A}from"./chunk.X7Q42RGY.js";import{c}from"./chunk.3G4FHXSN.js";import{a as f,g as l}from"./chunk.OAQCUA7X.js";var a=class extends A{constructor(){super(...arguments);this.localize=new w(this);this.tabs=[];this.panels=[];this.hasScrollControls=!1;this.placement="top";this.activation="auto";this.noScrollControls=!1}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>{this.preventIndicatorTransition(),this.repositionIndicator(),this.updateScrollControls()}),this.mutationObserver=new MutationObserver(t=>{t.some(s=>!["aria-labelledby","aria-controls"].includes(s.attributeName))&&setTimeout(()=>this.setAriaLabels()),t.some(s=>s.attributeName==="disabled")&&this.syncTabsAndPanels()}),this.updateComplete.then(()=>{this.syncTabsAndPanels(),this.mutationObserver.observe(this,{attributes:!0,childList:!0,subtree:!0}),this.resizeObserver.observe(this.nav),new IntersectionObserver((s,e)=>{var o;s[0].intersectionRatio>0&&(this.setAriaLabels(),this.setActiveTab((o=this.getActiveTab())!=null?o:this.tabs[0],{emitEvents:!1}),e.unobserve(s[0].target))}).observe(this.tabGroup)})}disconnectedCallback(){this.mutationObserver.disconnect(),this.resizeObserver.unobserve(this.nav)}show(t){let s=this.tabs.find(e=>e.panel===t);s&&this.setActiveTab(s,{scrollBehavior:"smooth"})}getAllTabs(t={includeDisabled:!0}){return[...this.shadowRoot.querySelector('slot[name="nav"]').assignedElements()].filter(e=>t.includeDisabled?e.tagName.toLowerCase()==="sl-tab":e.tagName.toLowerCase()==="sl-tab"&&!e.disabled)}getAllPanels(){return[...this.body.querySelector("slot").assignedElements()].filter(s=>s.tagName.toLowerCase()==="sl-tab-panel")}getActiveTab(){return this.tabs.find(t=>t.active)}handleClick(t){let e=t.target.closest("sl-tab");(e==null?void 0:e.closest("sl-tab-group"))===this&&e!==null&&this.setActiveTab(e,{scrollBehavior:"smooth"})}handleKeyDown(t){let e=t.target.closest("sl-tab");if((e==null?void 0:e.closest("sl-tab-group"))===this&&(["Enter"," "].includes(t.key)&&e!==null&&(this.setActiveTab(e,{scrollBehavior:"smooth"}),t.preventDefault()),["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(t.key))){let r=this.tabs.find(i=>i.matches(":focus")),b=this.localize.dir()==="rtl";if((r==null?void 0:r.tagName.toLowerCase())==="sl-tab"){let i=this.tabs.indexOf(r);t.key==="Home"?i=0:t.key==="End"?i=this.tabs.length-1:["top","bottom"].includes(this.placement)&&t.key===(b?"ArrowRight":"ArrowLeft")||["start","end"].includes(this.placement)&&t.key==="ArrowUp"?i--:(["top","bottom"].includes(this.placement)&&t.key===(b?"ArrowLeft":"ArrowRight")||["start","end"].includes(this.placement)&&t.key==="ArrowDown")&&i++,i<0&&(i=this.tabs.length-1),i>this.tabs.length-1&&(i=0),this.tabs[i].focus({preventScroll:!0}),this.activation==="auto"&&this.setActiveTab(this.tabs[i],{scrollBehavior:"smooth"}),["top","bottom"].includes(this.placement)&&m(this.tabs[i],this.nav,"horizontal"),t.preventDefault()}}}handleScrollToStart(){this.nav.scroll({left:this.localize.dir()==="rtl"?this.nav.scrollLeft+this.nav.clientWidth:this.nav.scrollLeft-this.nav.clientWidth,behavior:"smooth"})}handleScrollToEnd(){this.nav.scroll({left:this.localize.dir()==="rtl"?this.nav.scrollLeft-this.nav.clientWidth:this.nav.scrollLeft+this.nav.clientWidth,behavior:"smooth"})}updateScrollControls(){this.noScrollControls?this.hasScrollControls=!1:this.hasScrollControls=["top","bottom"].includes(this.placement)&&this.nav.scrollWidth>this.nav.clientWidth}setActiveTab(t,s){if(s=f({emitEvents:!0,scrollBehavior:"auto"},s),t!==this.activeTab&&!t.disabled){let e=this.activeTab;this.activeTab=t,this.tabs.map(o=>o.active=o===this.activeTab),this.panels.map(o=>{var r;return o.active=o.name===((r=this.activeTab)==null?void 0:r.panel)}),this.syncIndicator(),["top","bottom"].includes(this.placement)&&m(this.activeTab,this.nav,"horizontal",s.scrollBehavior),s.emitEvents&&(e&&d(this,"sl-tab-hide",{detail:{name:e.panel}}),d(this,"sl-tab-show",{detail:{name:this.activeTab.panel}}))}}setAriaLabels(){this.tabs.forEach(t=>{let s=this.panels.find(e=>e.name===t.panel);s&&(t.setAttribute("aria-controls",s.getAttribute("id")),s.setAttribute("aria-labelledby",t.getAttribute("id")))})}syncIndicator(){this.getActiveTab()?(this.indicator.style.display="block",this.repositionIndicator()):this.indicator.style.display="none"}repositionIndicator(){let t=this.getActiveTab();if(!t)return;let s=t.clientWidth,e=t.clientHeight,o=this.localize.dir()==="rtl",r=this.getAllTabs(),i=r.slice(0,r.indexOf(t)).reduce((u,v)=>({left:u.left+v.clientWidth,top:u.top+v.clientHeight}),{left:0,top:0});switch(this.placement){case"top":case"bottom":this.indicator.style.width=`${s}px`,this.indicator.style.height="auto",this.indicator.style.transform=o?`translateX(${-1*i.left}px)`:`translateX(${i.left}px)`;break;case"start":case"end":this.indicator.style.width="auto",this.indicator.style.height=`${e}px`,this.indicator.style.transform=`translateY(${i.top}px)`;break}}preventIndicatorTransition(){let t=this.indicator.style.transition;this.indicator.style.transition="none",requestAnimationFrame(()=>{this.indicator.style.transition=t})}syncTabsAndPanels(){this.tabs=this.getAllTabs({includeDisabled:!1}),this.panels=this.getAllPanels(),this.syncIndicator()}render(){let t=this.localize.dir()==="rtl";return c`
      <div
        part="base"
        class=${T({"tab-group":!0,"tab-group--top":this.placement==="top","tab-group--bottom":this.placement==="bottom","tab-group--start":this.placement==="start","tab-group--end":this.placement==="end","tab-group--rtl":this.localize.dir()==="rtl","tab-group--has-scroll-controls":this.hasScrollControls})}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="tab-group__nav-container" part="nav">
          ${this.hasScrollControls?c`
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

          ${this.hasScrollControls?c`
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
    `}};a.styles=_,l([n(".tab-group")],a.prototype,"tabGroup",2),l([n(".tab-group__body")],a.prototype,"body",2),l([n(".tab-group__nav")],a.prototype,"nav",2),l([n(".tab-group__indicator")],a.prototype,"indicator",2),l([y()],a.prototype,"hasScrollControls",2),l([h()],a.prototype,"placement",2),l([h()],a.prototype,"activation",2),l([h({attribute:"no-scroll-controls",type:Boolean})],a.prototype,"noScrollControls",2),l([p("noScrollControls",{waitUntilFirstUpdate:!0})],a.prototype,"updateScrollControls",1),l([p("placement",{waitUntilFirstUpdate:!0})],a.prototype,"syncIndicator",1),a=l([g("sl-tab-group")],a);export{a};
