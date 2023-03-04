import{a as g}from"./chunk.2KGY5GGC.js";import{a as b}from"./chunk.6S67HV2F.js";import{a as p}from"./chunk.FC4RDJJF.js";import{b as y}from"./chunk.6D3DWAMV.js";import{a as u}from"./chunk.NUWDNXKI.js";import{a as l}from"./chunk.AR2QSYXF.js";import{a as c,b as a,d as m,f}from"./chunk.PRU55YXS.js";import{c as v}from"./chunk.SYBSOZNG.js";import{e as s}from"./chunk.I4CX4JT3.js";var i=class extends f{constructor(){super(...arguments);this.localize=new y(this);this.position=50;this.vertical=!1;this.disabled=!1;this.snapThreshold=12}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(e=>this.handleResize(e)),this.updateComplete.then(()=>this.resizeObserver.observe(this)),this.detectSize(),this.cachedPositionInPixels=this.percentageToPixels(this.position)}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this)}detectSize(){let{width:e,height:t}=this.getBoundingClientRect();this.size=this.vertical?t:e}percentageToPixels(e){return this.size*(e/100)}pixelsToPercentage(e){return e/this.size*100}handleDrag(e){let t=this.localize.dir()==="rtl";this.disabled||(e.cancelable&&e.preventDefault(),b(this,{onMove:(o,h)=>{let r=this.vertical?h:o;this.primary==="end"&&(r=this.size-r),this.snap&&this.snap.split(" ").forEach(d=>{let n;d.endsWith("%")?n=this.size*(parseFloat(d)/100):n=parseFloat(d),t&&!this.vertical&&(n=this.size-n),r>=n-this.snapThreshold&&r<=n+this.snapThreshold&&(r=n)}),this.position=p(this.pixelsToPercentage(r),0,100)},initialEvent:e}))}handleKeyDown(e){if(!this.disabled&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key)){let t=this.position,o=(e.shiftKey?10:1)*(this.primary==="end"?-1:1);e.preventDefault(),(e.key==="ArrowLeft"&&!this.vertical||e.key==="ArrowUp"&&this.vertical)&&(t-=o),(e.key==="ArrowRight"&&!this.vertical||e.key==="ArrowDown"&&this.vertical)&&(t+=o),e.key==="Home"&&(t=this.primary==="end"?100:0),e.key==="End"&&(t=this.primary==="end"?0:100),this.position=p(t,0,100)}}handleResize(e){let{width:t,height:o}=e[0].contentRect;this.size=this.vertical?o:t,this.primary&&(this.position=this.pixelsToPercentage(this.cachedPositionInPixels))}handlePositionChange(){this.cachedPositionInPixels=this.percentageToPixels(this.position),this.positionInPixels=this.percentageToPixels(this.position),this.emit("sl-reposition")}handlePositionInPixelsChange(){this.position=this.pixelsToPercentage(this.positionInPixels)}handleVerticalChange(){this.detectSize()}render(){let e=this.vertical?"gridTemplateRows":"gridTemplateColumns",t=this.vertical?"gridTemplateColumns":"gridTemplateRows",o=this.localize.dir()==="rtl",h=`
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `,r="auto";return this.primary==="end"?o&&!this.vertical?this.style[e]=`${h} var(--divider-width) ${r}`:this.style[e]=`${r} var(--divider-width) ${h}`:o&&!this.vertical?this.style[e]=`${r} var(--divider-width) ${h}`:this.style[e]=`${h} var(--divider-width) ${r}`,this.style[t]="",v`
      <slot name="start" part="panel start" class="start"></slot>

      <slot
        name="divider"
        part="divider"
        class="divider"
        tabindex=${u(this.disabled?void 0:"0")}
        role="separator"
        aria-label=${this.localize.term("resize")}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleDrag}
        @touchstart=${this.handleDrag}
      ></slot>

      <slot name="end" part="panel end" class="end"></slot>
    `}};i.styles=g,s([m(".divider")],i.prototype,"divider",2),s([a({type:Number,reflect:!0})],i.prototype,"position",2),s([a({attribute:"position-in-pixels",type:Number})],i.prototype,"positionInPixels",2),s([a({type:Boolean,reflect:!0})],i.prototype,"vertical",2),s([a({type:Boolean,reflect:!0})],i.prototype,"disabled",2),s([a()],i.prototype,"primary",2),s([a()],i.prototype,"snap",2),s([a({type:Number,attribute:"snap-threshold"})],i.prototype,"snapThreshold",2),s([l("position")],i.prototype,"handlePositionChange",1),s([l("positionInPixels")],i.prototype,"handlePositionInPixelsChange",1),s([l("vertical")],i.prototype,"handleVerticalChange",1),i=s([c("sl-split-panel")],i);export{i as a};
