import{a as p}from"./chunk.LPGXXYQK.js";import{a as n}from"./chunk.PC5WGFOA.js";import{a as m,b as r}from"./chunk.GVR6SJVE.js";import{c as i,h as c}from"./chunk.7EIHAL55.js";import{g as o}from"./chunk.OAQCUA7X.js";var t=class extends c{constructor(){super(...arguments);this.aspectRatio="16:9";this.fit="cover"}render(){let a=this.aspectRatio.split(":"),s=parseFloat(a[0]),e=parseFloat(a[1]),l=!isNaN(s)&&!isNaN(e)&&s>0&&e>0?`${e/s*100}%`:"0";return i`
      <div
        class=${n({"responsive-media":!0,"responsive-media--cover":this.fit==="cover","responsive-media--contain":this.fit==="contain"})}
        style="padding-bottom: ${l}"
      >
        <slot></slot>
      </div>
    `}};t.styles=p,o([r({attribute:"aspect-ratio"})],t.prototype,"aspectRatio",2),o([r()],t.prototype,"fit",2),t=o([m("sl-responsive-media")],t);export{t as a};
