import{a as i}from"./chunk.RUACWBWF.js";import{a,b as t,g as l}from"./chunk.IKUI3UUK.js";import{a as n}from"./chunk.FLLCT6MG.js";import{c as s}from"./chunk.SYBSOZNG.js";import{e as r}from"./chunk.I4CX4JT3.js";var e=class extends l{constructor(){super(...arguments);this.variant="primary";this.pill=!1;this.pulse=!1}render(){return s`
      <slot
        part="base"
        class=${i({badge:!0,"badge--primary":this.variant==="primary","badge--success":this.variant==="success","badge--neutral":this.variant==="neutral","badge--warning":this.variant==="warning","badge--danger":this.variant==="danger","badge--pill":this.pill,"badge--pulse":this.pulse})}
        role="status"
      ></slot>
    `}};e.styles=n,r([t({reflect:!0})],e.prototype,"variant",2),r([t({type:Boolean,reflect:!0})],e.prototype,"pill",2),r([t({type:Boolean,reflect:!0})],e.prototype,"pulse",2),e=r([a("sl-badge")],e);export{e as a};
