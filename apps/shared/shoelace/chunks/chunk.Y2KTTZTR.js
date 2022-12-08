import{a as n}from"./chunk.ZM2JCLNZ.js";import{a as l}from"./chunk.DUQXEIJD.js";import{a as s,b as t,f as i}from"./chunk.N2CXUFX7.js";import{c as a}from"./chunk.I36YJ673.js";import{g as r}from"./chunk.OAQCUA7X.js";var e=class extends i{constructor(){super(...arguments);this.variant="primary";this.pill=!1;this.pulse=!1}render(){return a`
      <slot
        part="base"
        class=${l({badge:!0,"badge--primary":this.variant==="primary","badge--success":this.variant==="success","badge--neutral":this.variant==="neutral","badge--warning":this.variant==="warning","badge--danger":this.variant==="danger","badge--pill":this.pill,"badge--pulse":this.pulse})}
        role="status"
      ></slot>
    `}};e.styles=n,r([t({reflect:!0})],e.prototype,"variant",2),r([t({type:Boolean,reflect:!0})],e.prototype,"pill",2),r([t({type:Boolean,reflect:!0})],e.prototype,"pulse",2),e=r([s("sl-badge")],e);export{e as a};
