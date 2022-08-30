import{a as l}from"./chunk.DOY5OOEM.js";import{a}from"./chunk.LSNASYMO.js";import{a as r,b as o,f as i}from"./chunk.X7Q42RGY.js";import{c as s}from"./chunk.3G4FHXSN.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends i{constructor(){super(...arguments);this.effect="none"}render(){return s`
      <div
        part="base"
        class=${a({skeleton:!0,"skeleton--pulse":this.effect==="pulse","skeleton--sheen":this.effect==="sheen"})}
        aria-busy="true"
        aria-live="polite"
      >
        <div part="indicator" class="skeleton__indicator"></div>
      </div>
    `}};e.styles=l,t([o()],e.prototype,"effect",2),e=t([r("sl-skeleton")],e);export{e as a};
