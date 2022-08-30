import{a as p}from"./chunk.KHBBNPWT.js";import{a as o}from"./chunk.DBCWAMJH.js";import{a as l}from"./chunk.JUX3LFDW.js";import{a as d,b as s,c as r,d as c,f as m}from"./chunk.X7Q42RGY.js";import{c as e}from"./chunk.3G4FHXSN.js";import{g as t}from"./chunk.OAQCUA7X.js";var a=class extends m{constructor(){super(...arguments);this.isLoaded=!1}handleClick(){this.play=!this.play}handleLoad(){let i=document.createElement("canvas"),{width:n,height:h}=this.animatedImage;i.width=n,i.height=h,i.getContext("2d").drawImage(this.animatedImage,0,0,n,h),this.frozenFrame=i.toDataURL("image/gif"),this.isLoaded||(l(this,"sl-load"),this.isLoaded=!0)}handleError(){l(this,"sl-error")}handlePlayChange(){this.play&&(this.animatedImage.src="",this.animatedImage.src=this.src)}handleSrcChange(){this.isLoaded=!1}render(){return e`
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

        ${this.isLoaded?e`
              <img
                class="animated-image__frozen"
                src=${this.frozenFrame}
                alt=${this.alt}
                aria-hidden=${this.play?"true":"false"}
                @click=${this.handleClick}
              />

              <div part="control-box" class="animated-image__control-box">
                ${this.play?e`<sl-icon part="pause-icon" name="pause-fill" library="system"></sl-icon>`:e`<sl-icon part="play-icon" name="play-fill" library="system"></sl-icon>`}
              </div>
            `:""}
      </div>
    `}};a.styles=p,t([r()],a.prototype,"frozenFrame",2),t([r()],a.prototype,"isLoaded",2),t([c(".animated-image__animated")],a.prototype,"animatedImage",2),t([s()],a.prototype,"src",2),t([s()],a.prototype,"alt",2),t([s({type:Boolean,reflect:!0})],a.prototype,"play",2),t([o("play",{waitUntilFirstUpdate:!0})],a.prototype,"handlePlayChange",1),t([o("src")],a.prototype,"handleSrcChange",1),a=t([d("sl-animated-image")],a);export{a};
