import{a as o}from"./chunk.OSEV3RCT.js";import{a as l}from"./chunk.V4OMSSO6.js";import{a as c,b as s,c as r,d as m}from"./chunk.GVR6SJVE.js";import{a as p}from"./chunk.J3TZYWG3.js";import{c as i,h as d}from"./chunk.7EIHAL55.js";import{g as t}from"./chunk.OAQCUA7X.js";var a=class extends d{constructor(){super(...arguments);this.isLoaded=!1}handleClick(){this.play=!this.play}handleLoad(){let e=document.createElement("canvas"),{width:n,height:h}=this.animatedImage;e.width=n,e.height=h,e.getContext("2d").drawImage(this.animatedImage,0,0,n,h),this.frozenFrame=e.toDataURL("image/gif"),this.isLoaded||(l(this,"sl-load"),this.isLoaded=!0)}handleError(){l(this,"sl-error")}handlePlayChange(){this.play&&(this.animatedImage.src="",this.animatedImage.src=this.src)}handleSrcChange(){this.isLoaded=!1}render(){return i`
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

        ${this.isLoaded?i`
              <img
                class="animated-image__frozen"
                src=${this.frozenFrame}
                alt=${this.alt}
                aria-hidden=${this.play?"true":"false"}
                @click=${this.handleClick}
              />

              <div part="control-box" class="animated-image__control-box">
                ${this.play?i`<sl-icon part="pause-icon" name="pause-fill" library="system"></sl-icon>`:i`<sl-icon part="play-icon" name="play-fill" library="system"></sl-icon>`}
              </div>
            `:""}
      </div>
    `}};a.styles=p,t([r()],a.prototype,"frozenFrame",2),t([r()],a.prototype,"isLoaded",2),t([m(".animated-image__animated")],a.prototype,"animatedImage",2),t([s()],a.prototype,"src",2),t([s()],a.prototype,"alt",2),t([s({type:Boolean,reflect:!0})],a.prototype,"play",2),t([o("play")],a.prototype,"handlePlayChange",1),t([o("src")],a.prototype,"handleSrcChange",1),a=t([c("sl-animated-image")],a);export{a};
