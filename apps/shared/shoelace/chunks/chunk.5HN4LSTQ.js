import{a as o}from"./chunk.NPS3INFZ.js";import{a as l}from"./chunk.PC5WGFOA.js";import{a,b as i}from"./chunk.GVR6SJVE.js";import{c as s,h as r}from"./chunk.7EIHAL55.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends r{constructor(){super(...arguments);this.effect="none"}render(){return s`
      <div
        part="base"
        class=${l({skeleton:!0,"skeleton--pulse":this.effect==="pulse","skeleton--sheen":this.effect==="sheen"})}
        aria-busy="true"
        aria-live="polite"
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `}};e.styles=o,t([i()],e.prototype,"effect",2),e=t([a("sl-skeleton")],e);export{e as a};
