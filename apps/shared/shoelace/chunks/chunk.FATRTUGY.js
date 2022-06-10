import{a as g}from"./chunk.TMTSVOBE.js";import{a as b}from"./chunk.KKUEBWI7.js";import{a as l}from"./chunk.Z35U7IGS.js";import{h as u}from"./chunk.RLLTRZYL.js";import{a as f}from"./chunk.2XQLLZV4.js";import{a as h}from"./chunk.OSEV3RCT.js";import{a as y}from"./chunk.V4OMSSO6.js";import{a as m,b as n,d as v}from"./chunk.GVR6SJVE.js";import{c as p,h as c}from"./chunk.7EIHAL55.js";import{g as s}from"./chunk.OAQCUA7X.js";var i=class extends c{constructor(){super(...arguments);this.localize=new u(this);this.position=50;this.vertical=!1;this.disabled=!1;this.snapThreshold=12}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>this.handleResize(e)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this)}detectSize(){let{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){this.disabled||(e.preventDefault(),b(this,(t,r)=>{let o=this.vertical?r:t;this.primary==="end"&&(o=this.size-o),this.snap&&this.snap.split(" ").forEach(d=>{let a;d.endsWith("%")?a=this.size*(parseFloat(d)/100):a=parseFloat(d),o>=a-this.snapThreshold&&o<=a+this.snapThreshold&&(o=a)}),this.position=l(this.pixelsToPercentage(o),0,100)}))}handleKeyDown(e){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key)){let t=this.position,r=(e.shiftKey?10:1)*(this.primary==="end"?-1:1);e.preventDefault(),(e.key==="ArrowLeft"&&!this.vertical||e.key==="ArrowUp"&&this.vertical)&&(t-=r),(e.key==="ArrowRight"&&!this.vertical||e.key==="ArrowDown"&&this.vertical)&&(t+=r),e.key==="Home"&&(t=this.primary==="end"?100:0),e.key==="End"&&(t=this.primary==="end"?0:100),this.position=l(t,0,100)}}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.positionInPixels=this.percentageToPixels(this.position),y(this,"sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}handleResize(e){let{width:t,height:r}=e[0].contentRect;this.size=this.vertical?r:t,this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}render(){let e=this.vertical?"gridTemplateRows":"gridTemplateColumns",t=this.vertical?"gridTemplateColumns":"gridTemplateRows",r=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,o="auto";return this.primary==="end"?this.style[e]=`${o} var(--divider-width) ${r}`:this.style[e]=`${r} var(--divider-width) ${o}`,this.style[t]="",p`
      <div part="panel start" class="start">
        <slot name="start"></slot>
      </div>

      <div
        part="divider"
        class="divider"
        tabindex=${f(this.disabled?void 0:"0")}
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
    `}};i.styles=g,s([v(".divider")],i.prototype,"divider",2),s([n({type:Number,reflect:!0})],i.prototype,"position",2),s([n({attribute:"position-in-pixels",type:Number})],i.prototype,"positionInPixels",2),s([n({type:Boolean,reflect:!0})],i.prototype,"vertical",2),s([n({type:Boolean,reflect:!0})],i.prototype,"disabled",2),s([n()],i.prototype,"primary",2),s([n()],i.prototype,"snap",2),s([n({type:Number,attribute:"snap-threshold"})],i.prototype,"snapThreshold",2),s([h("position")],i.prototype,"handlePositionChange",1),s([h("positionInPixels")],i.prototype,"handlePositionInPixelsChange",1),s([h("vertical")],i.prototype,"handleVerticalChange",1),i=s([m("sl-split-panel")],i);export{i as a};
