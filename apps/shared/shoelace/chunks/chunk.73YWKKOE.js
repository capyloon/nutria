import{a as $}from"./chunk.YZYAZMSI.js";import{a as M}from"./chunk.CBQWVOOS.js";import{a as O}from"./chunk.CTD36YN5.js";import{a as A}from"./chunk.OEZTPCQW.js";import{a as x}from"./chunk.FC4RDJJF.js";import{c as w}from"./chunk.HFPOGNHG.js";import{a as m}from"./chunk.RUACWBWF.js";import{b as _}from"./chunk.2JOUTB7Y.js";import{a as u}from"./chunk.AR2QSYXF.js";import{a as S,b as d,c as E,e as b,g as P}from"./chunk.IKUI3UUK.js";import{c as v}from"./chunk.SYBSOZNG.js";import{e as r}from"./chunk.I4CX4JT3.js";function*T(g,h){if(g!==void 0){let t=0;for(let i of g)yield h(i,t++)}}function*C(g,h,t=1){let i=h===void 0?0:g;h!=null||(h=g);for(let e=i;t>0?e<h:h<e;e+=t)yield e}var s=class extends P{constructor(){super(...arguments);this.loop=!1;this.navigation=!1;this.pagination=!1;this.autoplay=!1;this.autoplayInterval=3e3;this.slidesPerPage=1;this.slidesPerMove=1;this.orientation="horizontal";this.mouseDragging=!1;this.activeSlide=0;this.autoplayController=new M(this,()=>this.next());this.scrollController=new A(this);this.slides=this.getElementsByTagName("sl-carousel-item");this.intersectionObserverEntries=new Map;this.localize=new _(this)}connectedCallback(){super.connectedCallback(),this.setAttribute("role","region"),this.setAttribute("aria-label",this.localize.term("carousel"));let t=new IntersectionObserver(i=>{i.forEach(e=>{this.intersectionObserverEntries.set(e.target,e);let o=e.target;o.toggleAttribute("inert",!e.isIntersecting),o.classList.toggle("--in-view",e.isIntersecting),o.setAttribute("aria-hidden",e.isIntersecting?"false":"true")})},{root:this,threshold:.6});this.intersectionObserver=t,t.takeRecords().forEach(i=>{this.intersectionObserverEntries.set(i.target,i)})}disconnectedCallback(){super.disconnectedCallback(),this.intersectionObserver.disconnect(),this.mutationObserver.disconnect()}firstUpdated(){this.initializeSlides(),this.mutationObserver=new MutationObserver(this.handleSlotChange.bind(this)),this.mutationObserver.observe(this,{childList:!0,subtree:!1})}getPageCount(){return Math.ceil(this.getSlides().length/this.slidesPerPage)}getCurrentPage(){return Math.floor(this.activeSlide/this.slidesPerPage)}getSlides({excludeClones:t=!0}={}){return[...this.slides].filter(i=>!t||!i.hasAttribute("data-clone"))}handleKeyDown(t){if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(t.key)){let i=t.target,e=this.localize.dir()==="rtl",o=i.closest('[part~="pagination-item"]')!==null,n=t.key==="ArrowDown"||!e&&t.key==="ArrowRight"||e&&t.key==="ArrowLeft",l=t.key==="ArrowUp"||!e&&t.key==="ArrowLeft"||e&&t.key==="ArrowRight";t.preventDefault(),l&&this.previous(),n&&this.next(),t.key==="Home"&&this.goToSlide(0),t.key==="End"&&this.goToSlide(this.getSlides().length-1),o&&this.updateComplete.then(()=>{var a;let c=(a=this.shadowRoot)==null?void 0:a.querySelector('[part~="pagination-item--active"]');c&&c.focus()})}}handleScrollEnd(){let t=this.getSlides(),e=[...this.intersectionObserverEntries.values()].find(o=>o.isIntersecting);if(this.loop&&(e!=null&&e.target.hasAttribute("data-clone"))){let o=Number(e.target.getAttribute("data-clone"));this.goToSlide(o,"auto");return}e&&(this.activeSlide=t.indexOf(e.target))}handleSlotChange(t){t.some(e=>[...e.addedNodes,...e.removedNodes].some(o=>$.isCarouselItem(o)&&!o.hasAttribute("data-clone")))&&this.initializeSlides(),this.requestUpdate()}initializeSlides(){let t=this.getSlides(),i=this.intersectionObserver;if(this.intersectionObserverEntries.clear(),this.getSlides({excludeClones:!1}).forEach((e,o)=>{i.unobserve(e),e.classList.remove("--in-view"),e.classList.remove("--is-active"),e.setAttribute("aria-label",this.localize.term("slideNum",o+1)),e.hasAttribute("data-clone")&&e.remove()}),this.loop){let e=this.slidesPerPage,o=t.slice(-e),n=t.slice(0,e);o.reverse().forEach((l,c)=>{let a=l.cloneNode(!0);a.setAttribute("data-clone",String(t.length-c-1)),this.prepend(a)}),n.forEach((l,c)=>{let a=l.cloneNode(!0);a.setAttribute("data-clone",String(c)),this.append(a)})}this.getSlides({excludeClones:!1}).forEach(e=>{i.observe(e)}),this.goToSlide(this.activeSlide,"auto")}handelSlideChange(){let t=this.getSlides();t.forEach((i,e)=>{i.classList.toggle("--is-active",e===this.activeSlide)}),this.hasUpdated&&this.emit("sl-slide-change",{detail:{index:this.activeSlide,slide:t[this.activeSlide]}})}handleSlidesPerMoveChange(){let t=this.getSlides({excludeClones:!1}),i=this.slidesPerMove;t.forEach((e,o)=>{Math.abs(o-i)%i===0?e.style.removeProperty("scroll-snap-align"):e.style.setProperty("scroll-snap-align","none")})}handleAutoplayChange(){this.autoplayController.stop(),this.autoplay&&this.autoplayController.start(this.autoplayInterval)}handleMouseDraggingChange(){this.scrollController.mouseDragging=this.mouseDragging}previous(t="smooth"){this.goToSlide(this.activeSlide-this.slidesPerMove,t)}next(t="smooth"){this.goToSlide(this.activeSlide+this.slidesPerMove,t)}goToSlide(t,i="smooth"){let{slidesPerPage:e,loop:o,scrollContainer:n}=this,l=this.getSlides(),c=this.getSlides({excludeClones:!1}),a=(t+l.length)%l.length;this.activeSlide=a;let p=x(t+(o?e:0),0,c.length-1),L=c[p],f=n.getBoundingClientRect(),y=L.getBoundingClientRect();n.scrollTo({left:y.left-f.left+n.scrollLeft,top:y.top-f.top+n.scrollTop,behavior:w()?"auto":i})}render(){let{scrollController:t,slidesPerPage:i}=this,e=this.getPageCount(),o=this.getCurrentPage(),n=this.loop||o>0,l=this.loop||o<e-1,c=this.localize.dir()==="ltr";return v`
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
                  class="${m({"carousel__navigation-button":!0,"carousel__navigation-button--previous":!0,"carousel__navigation-button--disabled":!n})}"
                  aria-label="${this.localize.term("previousSlide")}"
                  aria-controls="scroll-container"
                  aria-disabled="${n?"false":"true"}"
                  @click=${n?()=>this.previous():null}
                >
                  <slot name="previous-icon">
                    <sl-icon library="system" name="${c?"chevron-left":"chevron-right"}"></sl-icon>
                  </slot>
                </button>

                <button
                  part="navigation-button navigation-button--next"
                  class=${m({"carousel__navigation-button":!0,"carousel__navigation-button--next":!0,"carousel__navigation-button--disabled":!l})}
                  aria-label="${this.localize.term("nextSlide")}"
                  aria-controls="scroll-container"
                  aria-disabled="${l?"false":"true"}"
                  @click=${l?()=>this.next():null}
                >
                  <slot name="next-icon">
                    <sl-icon library="system" name="${c?"chevron-right":"chevron-left"}"></sl-icon>
                  </slot>
                </button>
              </div>
            `:""}
        ${this.pagination?v`
              <div part="pagination" role="tablist" class="carousel__pagination" aria-controls="scroll-container">
                ${T(C(e),a=>{let p=a===o;return v`
                    <button
                      part="pagination-item ${p?"pagination-item--active":""}"
                      class="${m({"carousel__pagination-item":!0,"carousel__pagination-item--active":p})}"
                      role="tab"
                      aria-selected="${p?"true":"false"}"
                      aria-label="${this.localize.term("goToSlide",a+1,e)}"
                      tabindex=${p?"0":"-1"}
                      @click=${()=>this.goToSlide(a*i)}
                      @keydown=${this.handleKeyDown}
                    ></button>
                  `})}
              </div>
            `:""}
      </div>
    `}};s.styles=O,r([d({type:Boolean,reflect:!0})],s.prototype,"loop",2),r([d({type:Boolean,reflect:!0})],s.prototype,"navigation",2),r([d({type:Boolean,reflect:!0})],s.prototype,"pagination",2),r([d({type:Boolean,reflect:!0})],s.prototype,"autoplay",2),r([d({type:Number,attribute:"autoplay-interval"})],s.prototype,"autoplayInterval",2),r([d({type:Number,attribute:"slides-per-page"})],s.prototype,"slidesPerPage",2),r([d({type:Number,attribute:"slides-per-move"})],s.prototype,"slidesPerMove",2),r([d()],s.prototype,"orientation",2),r([d({type:Boolean,reflect:!0,attribute:"mouse-dragging"})],s.prototype,"mouseDragging",2),r([b("slot:not([name])")],s.prototype,"defaultSlot",2),r([b(".carousel__slides")],s.prototype,"scrollContainer",2),r([b(".carousel__pagination")],s.prototype,"paginationContainer",2),r([E()],s.prototype,"activeSlide",2),r([u("loop",{waitUntilFirstUpdate:!0}),u("slidesPerPage",{waitUntilFirstUpdate:!0})],s.prototype,"initializeSlides",1),r([u("activeSlide")],s.prototype,"handelSlideChange",1),r([u("slidesPerMove")],s.prototype,"handleSlidesPerMoveChange",1),r([u("autoplay")],s.prototype,"handleAutoplayChange",1),r([u("mouseDragging")],s.prototype,"handleMouseDraggingChange",1),s=r([S("sl-carousel")],s);export{s as a};
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
