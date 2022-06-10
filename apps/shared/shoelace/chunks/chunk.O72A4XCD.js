import{a as i}from"./chunk.PC5WGFOA.js";import{a as n}from"./chunk.CU3NHRNJ.js";import{a as l,b as t}from"./chunk.GVR6SJVE.js";import{c as r,h as s}from"./chunk.7EIHAL55.js";import{g as a}from"./chunk.OAQCUA7X.js";var e=class extends s{constructor(){super(...arguments);this.variant="primary";this.pill=!1;this.pulse=!1}render(){return r`
      <span
        part="base"
        class=${i({badge:!0,"badge--primary":this.variant==="primary","badge--success":this.variant==="success","badge--neutral":this.variant==="neutral","badge--warning":this.variant==="warning","badge--danger":this.variant==="danger","badge--pill":this.pill,"badge--pulse":this.pulse})}
        role="status"
      >
        <slot></slot>
      </span>
    `}};e.styles=n,a([t({reflect:!0})],e.prototype,"variant",2),a([t({type:Boolean,reflect:!0})],e.prototype,"pill",2),a([t({type:Boolean,reflect:!0})],e.prototype,"pulse",2),e=a([l("sl-badge")],e);export{e as a};
