import{a as w}from"./chunk.TMTSVOBE.js";import{a as g}from"./chunk.WWGKY4AH.js";import{a as c}from"./chunk.Z35U7IGS.js";import{h as b}from"./chunk.RLLTRZYL.js";import{a as d}from"./chunk.OSEV3RCT.js";import{a as u}from"./chunk.V4OMSSO6.js";import{a as y}from"./chunk.2XQLLZV4.js";import{a as v,b as a,d as f}from"./chunk.GVR6SJVE.js";import{c as p,h as m}from"./chunk.7EIHAL55.js";import{g as s}from"./chunk.OAQCUA7X.js";var i=class extends m{constructor(){super(...arguments);this.localize=new b(this);this.position=50;this.vertical=!1;this.disabled=!1;this.snapThreshold=12}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>this.handleResize(e)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this)}detectSize(){let{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){let t=this.localize.dir()==="rtl";this.disabled||(e.preventDefault(),g(this,{onMove:(o,h)=>{let r=this.vertical?h:o;this.primary==="end"&&(r=this.size-r),this.snap&&this.snap.split(" ").forEach(l=>{let n;l.endsWith("%")?n=this.size*(parseFloat(l)/100):n=parseFloat(l),t&&!this.vertical&&(n=this.size-n),r>=n-this.snapThreshold&&r<=n+this.snapThreshold&&(r=n)}),this.position=c(this.pixelsToPercentage(r),0,100)},initialEvent:e}))}handleKeyDown(e){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key)){let t=this.position,o=(e.shiftKey?10:1)*(this.primary==="end"?-1:1);e.preventDefault(),(e.key==="ArrowLeft"&&!this.vertical||e.key==="ArrowUp"&&this.vertical)&&(t-=o),(e.key==="ArrowRight"&&!this.vertical||e.key==="ArrowDown"&&this.vertical)&&(t+=o),e.key==="Home"&&(t=this.primary==="end"?100:0),e.key==="End"&&(t=this.primary==="end"?0:100),this.position=c(t,0,100)}}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.positionInPixels=this.percentageToPixels(this.position),u(this,"sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}handleResize(e){let{width:t,height:o}=e[0].contentRect;this.size=this.vertical?o:t,this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}render(){let e=this.vertical?"gridTemplateRows":"gridTemplateColumns",t=this.vertical?"gridTemplateColumns":"gridTemplateRows",o=this.localize.dir()==="rtl",h=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,r="auto";return this.primary==="end"?o&&!this.vertical?this.style[e]=`${h} var(--divider-width) ${r}`:this.style[e]=`${r} var(--divider-width) ${h}`:o&&!this.vertical?this.style[e]=`${r} var(--divider-width) ${h}`:this.style[e]=`${h} var(--divider-width) ${r}`,this.style[t]="",p`
      <div part="panel start" class="start">
        <slot name="start"></slot>
      </div>

      <div
        part="divider"
        class="divider"
        tabindex=${y(this.disabled?void 0:"0")}
        role="separator"
        aria-label=${this.localize.term("resize")}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleDrag}
        @touchstart=${this.handleDrag}
      >
        <slot name="handle"></slot>
      </div>

      <div part="panel end" class="end">
        <slot name="end"></slot>
      </div>
    `}};i.styles=w,s([f(".divider")],i.prototype,"divider",2),s([a({type:Number,reflect:!0})],i.prototype,"position",2),s([a({attribute:"position-in-pixels",type:Number})],i.prototype,"positionInPixels",2),s([a({type:Boolean,reflect:!0})],i.prototype,"vertical",2),s([a({type:Boolean,reflect:!0})],i.prototype,"disabled",2),s([a()],i.prototype,"primary",2),s([a()],i.prototype,"snap",2),s([a({type:Number,attribute:"snap-threshold"})],i.prototype,"snapThreshold",2),s([d("position")],i.prototype,"handlePositionChange",1),s([d("positionInPixels")],i.prototype,"handlePositionInPixelsChange",1),s([d("vertical")],i.prototype,"handleVerticalChange",1),i=s([v("sl-split-panel")],i);export{i as a};
