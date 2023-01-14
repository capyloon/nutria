import{a as m}from"./chunk.IOBCXNCZ.js";import{a as l}from"./chunk.AR2QSYXF.js";import{a as h,b as i,c as s,d,f as c}from"./chunk.JFPKWAAH.js";import{c as r}from"./chunk.SYBSOZNG.js";import{e as t}from"./chunk.I4CX4JT3.js";var a=class extends c{constructor(){super(...arguments);this.isLoaded=!1}handleClick(){this.play=!this.play}handleLoad(){let e=document.createElement("canvas"),{width:o,height:n}=this.animatedImage;e.width=o,e.height=n,e.getContext("2d").drawImage(this.animatedImage,0,0,o,n),this.frozenFrame=e.toDataURL("image/gif"),this.isLoaded||(this.emit("sl-load"),this.isLoaded=!0)}handleError(){this.emit("sl-error")}handlePlayChange(){this.play&&(this.animatedImage.src="",this.animatedImage.src=this.src)}handleSrcChange(){this.isLoaded=!1}render(){return r`
      <div class="animated-image">
        <img
          class="animated-image__animated"
          src=${this.src}
          alt=${this.alt}
          crossorigin="anonymous"
          aria-hidden=${this.play?"false":"true"}
          @click=${this.handleClick}
          @load=${this.handleLoad}
          @error=${this.handleError}
        />

        ${this.isLoaded?r`
              <img
                class="animated-image__frozen"
                src=${this.frozenFrame}
                alt=${this.alt}
                aria-hidden=${this.play?"true":"false"}
                @click=${this.handleClick}
              />

              <div part="control-box" class="animated-image__control-box">
                <slot name="play-icon"><sl-icon name="play-fill" library="system"></sl-icon></slot>
                <slot name="pause-icon"><sl-icon name="pause-fill" library="system"></sl-icon></slot>
              </div>
            `:""}
      </div>
    `}};a.styles=m,t([d(".animated-image__animated")],a.prototype,"animatedImage",2),t([s()],a.prototype,"frozenFrame",2),t([s()],a.prototype,"isLoaded",2),t([i()],a.prototype,"src",2),t([i()],a.prototype,"alt",2),t([i({type:Boolean,reflect:!0})],a.prototype,"play",2),t([l("play",{waitUntilFirstUpdate:!0})],a.prototype,"handlePlayChange",1),t([l("src")],a.prototype,"handleSrcChange",1),a=t([h("sl-animated-image")],a);export{a};
