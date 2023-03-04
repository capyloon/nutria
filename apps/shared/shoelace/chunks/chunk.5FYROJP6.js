import{a as M}from"./chunk.OEZTPCQW.js";import{a as A}from"./chunk.JO5RMNSY.js";import{a as w}from"./chunk.FC4RDJJF.js";import{a as _}from"./chunk.CBQWVOOS.js";import{a as x}from"./chunk.CTD36YN5.js";import{c as E}from"./chunk.HFPOGNHG.js";import{b as P}from"./chunk.2JOUTB7Y.js";import{a as m}from"./chunk.RUACWBWF.js";import{a as g}from"./chunk.AR2QSYXF.js";import{a as f,b as d,c as y,d as b,f as S}from"./chunk.PRU55YXS.js";import{c as v}from"./chunk.SYBSOZNG.js";import{e as r}from"./chunk.I4CX4JT3.js";function*$(p,h){if(p!==void 0){let t=0;for(let i of p)yield h(i,t++)}}function*O(p,h,t=1){let i=h===void 0?0:p;h!=null||(h=p);for(let e=i;t>0?e<h:h<e;e+=t)yield e}var o=class extends S{constructor(){super(...arguments);this.loop=!1;this.navigation=!1;this.pagination=!1;this.autoplay=!1;this.autoplayInterval=3e3;this.slidesPerPage=1;this.slidesPerMove=1;this.orientation="horizontal";this.mouseDragging=!1;this.activeSlide=0;this.autoplayController=new _(this,()=>this.next());this.scrollController=new M(this);this.slides=this.getElementsByTagName("sl-carousel-item");this.intersectionObserverEntries=new Map;this.localize=new P(this)}connectedCallback(){super.connectedCallback(),this.setAttribute("role","region"),this.setAttribute("aria-label",this.localize.term("carousel"));let t=new IntersectionObserver(i=>{i.forEach(e=>{this.intersectionObserverEntries.set(e.target,e);let s=e.target;s.toggleAttribute("inert",!e.isIntersecting),s.classList.toggle("--in-view",e.isIntersecting),s.setAttribute("aria-hidden",e.isIntersecting?"false":"true")})},{root:this,threshold:.6});this.intersectionObserver=t,t.takeRecords().forEach(i=>{this.intersectionObserverEntries.set(i.target,i)})}disconnectedCallback(){super.disconnectedCallback(),this.intersectionObserver.disconnect(),this.mutationObserver.disconnect()}firstUpdated(){this.initializeSlides(),this.mutationObserver=new MutationObserver(this.handleSlotChange.bind(this)),this.mutationObserver.observe(this,{childList:!0,subtree:!1})}getPageCount(){return Math.ceil(this.getSlides().length/this.slidesPerPage)}getCurrentPage(){return Math.floor(this.activeSlide/this.slidesPerPage)}getSlides({excludeClones:t=!0}={}){return[...this.slides].filter(i=>!t||!i.hasAttribute("data-clone"))}handleKeyDown(t){if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(t.key)){let i=t.target,e=this.localize.dir()==="rtl",s=i.closest('[part~="pagination-item"]')!==null,l=t.key==="ArrowDown"||!e&&t.key==="ArrowRight"||e&&t.key==="ArrowLeft",n=t.key==="ArrowUp"||!e&&t.key==="ArrowLeft"||e&&t.key==="ArrowRight";t.preventDefault(),n&&this.previous(),l&&this.next(),t.key==="Home"&&this.goToSlide(0),t.key==="End"&&this.goToSlide(this.getSlides().length-1),s&&this.updateComplete.then(()=>{var a;let c=(a=this.shadowRoot)==null?void 0:a.querySelector('[part~="pagination-item--active"]');c&&c.focus()})}}handleScrollEnd(){let t=this.getSlides(),e=[...this.intersectionObserverEntries.values()].find(s=>s.isIntersecting);if(this.loop&&(e!=null&&e.target.hasAttribute("data-clone"))){let s=Number(e.target.getAttribute("data-clone"));this.goToSlide(s,"auto");return}e&&(this.activeSlide=t.indexOf(e.target))}handleSlotChange(t){t.some(e=>[...e.addedNodes,...e.removedNodes].some(s=>A.isCarouselItem(s)&&!s.hasAttribute("data-clone")))&&this.initializeSlides(),this.requestUpdate()}initializeSlides(){let t=this.getSlides(),i=this.intersectionObserver;if(this.intersectionObserverEntries.clear(),this.getSlides({excludeClones:!1}).forEach((e,s)=>{i.unobserve(e),e.classList.remove("--in-view"),e.classList.remove("--is-active"),e.setAttribute("aria-label",this.localize.term("slide_num",s+1)),e.hasAttribute("data-clone")&&e.remove()}),this.loop){let e=this.slidesPerPage,s=t.slice(-e),l=t.slice(0,e);s.reverse().forEach((n,c)=>{let a=n.cloneNode(!0);a.setAttribute("data-clone",String(t.length-c-1)),this.prepend(a)}),l.forEach((n,c)=>{let a=n.cloneNode(!0);a.setAttribute("data-clone",String(c)),this.append(a)})}this.getSlides({excludeClones:!1}).forEach(e=>{i.observe(e)}),this.goToSlide(this.activeSlide,"auto")}handelSlideChange(){let t=this.getSlides();t.forEach((i,e)=>{i.classList.toggle("--is-active",e===this.activeSlide)}),this.hasUpdated&&this.emit("sl-slide-change",{detail:{index:this.activeSlide,slide:t[this.activeSlide]}})}handleSlidesPerMoveChange(){let t=this.getSlides({excludeClones:!1}),i=this.slidesPerMove;t.forEach((e,s)=>{Math.abs(s-i)%i===0?e.style.removeProperty("scroll-snap-align"):e.style.setProperty("scroll-snap-align","none")})}handleAutoplayChange(){this.autoplayController.stop(),this.autoplay&&this.autoplayController.start(this.autoplayInterval)}handleMouseDraggingChange(){this.scrollController.mouseDragging=this.mouseDragging}previous(t="smooth"){this.goToSlide(this.activeSlide-this.slidesPerMove,t)}next(t="smooth"){this.goToSlide(this.activeSlide+this.slidesPerMove,t)}goToSlide(t,i="smooth"){let{slidesPerPage:e,loop:s}=this,l=this.getSlides(),n=this.getSlides({excludeClones:!1}),c=(t+l.length)%l.length;this.activeSlide=c;let a=w(t+(s?e:0),0,n.length-1),u=n[a];this.scrollContainer.scrollTo({left:u.offsetLeft,top:u.offsetTop,behavior:E()?"auto":i})}render(){let{scrollController:t,slidesPerPage:i}=this,e=this.getPageCount(),s=this.getCurrentPage(),l=this.loop||s>0,n=this.loop||s<e-1,c=this.localize.dir()==="ltr";return v`
      <div part="base" class="carousel">
        <div
          id="scroll-container"
          part="scroll-container"
          class="${m({carousel__slides:!0,"carousel__slides--horizontal":this.orientation==="horizontal","carousel__slides--vertical":this.orientation==="vertical"})}"
          style="--slides-per-page: ${this.slidesPerPage};"
          aria-busy="${t.scrolling?"true":"false"}"
          aria-atomic="true"
          tabindex="0"
          @keydown=${this.handleKeyDown}
          @scrollend=${this.handleScrollEnd}
        >
          <slot></slot>
        </div>

        ${this.navigation?v`
              <div part="navigation" class="carousel__navigation">
                <button
                  part="navigation-button navigation-button--previous"
                  class="${m({"carousel__navigation-button":!0,"carousel__navigation-button--previous":!0,"carousel__navigation-button--disabled":!l})}"
                  aria-label="${this.localize.term("previousSlide")}"
                  aria-controls="scroll-container"
                  aria-disabled="${l?"false":"true"}"
                  @click=${l?()=>this.previous():null}
                >
                  <slot name="previous-icon">
                    <sl-icon library="system" name="${c?"chevron-left":"chevron-right"}"></sl-icon>
                  </slot>
                </button>

                <button
                  part="navigation-button navigation-button--next"
                  class=${m({"carousel__navigation-button":!0,"carousel__navigation-button--next":!0,"carousel__navigation-button--disabled":!n})}
                  aria-label="${this.localize.term("nextSlide")}"
                  aria-controls="scroll-container"
                  aria-disabled="${n?"false":"true"}"
                  @click=${n?()=>this.next():null}
                >
                  <slot name="next-icon">
                    <sl-icon library="system" name="${c?"chevron-right":"chevron-left"}"></sl-icon>
                  </slot>
                </button>
              </div>
            `:""}
        ${this.pagination?v`
              <div part="pagination" role="tablist" class="carousel__pagination" aria-controls="scroll-container">
                ${$(O(e),a=>{let u=a===s;return v`
                    <button
                      part="pagination-item ${u?"pagination-item--active":""}"
                      class="${m({"carousel__pagination-item":!0,"carousel__pagination-item--active":u})}"
                      role="tab"
                      aria-selected="${u?"true":"false"}"
                      aria-label="${this.localize.term("goToSlide",a+1,e)}"
                      tabindex=${u?"0":"-1"}
                      @click=${()=>this.goToSlide(a*i)}
                      @keydown=${this.handleKeyDown}
                    ></button>
                  `})}
              </div>
            `:""}
      </div>
    `}};o.styles=x,r([d({type:Boolean,reflect:!0})],o.prototype,"loop",2),r([d({type:Boolean,reflect:!0})],o.prototype,"navigation",2),r([d({type:Boolean,reflect:!0})],o.prototype,"pagination",2),r([d({type:Boolean,reflect:!0})],o.prototype,"autoplay",2),r([d({type:Number,attribute:"autoplay-interval"})],o.prototype,"autoplayInterval",2),r([d({type:Number,attribute:"slides-per-page"})],o.prototype,"slidesPerPage",2),r([d({type:Number,attribute:"slides-per-move"})],o.prototype,"slidesPerMove",2),r([d()],o.prototype,"orientation",2),r([d({type:Boolean,reflect:!0,attribute:"mouse-dragging"})],o.prototype,"mouseDragging",2),r([b("slot:not([name])")],o.prototype,"defaultSlot",2),r([b(".carousel__slides")],o.prototype,"scrollContainer",2),r([b(".carousel__pagination")],o.prototype,"paginationContainer",2),r([y()],o.prototype,"activeSlide",2),r([g("loop",{waitUntilFirstUpdate:!0}),g("slidesPerPage",{waitUntilFirstUpdate:!0})],o.prototype,"initializeSlides",1),r([g("activeSlide")],o.prototype,"handelSlideChange",1),r([g("slidesPerMove")],o.prototype,"handleSlidesPerMoveChange",1),r([g("autoplay")],o.prototype,"handleAutoplayChange",1),r([g("mouseDragging")],o.prototype,"handleMouseDraggingChange",1),o=r([f("sl-carousel")],o);export{o as a};
/*! Bundled license information:

lit-html/directives/map.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/range.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
