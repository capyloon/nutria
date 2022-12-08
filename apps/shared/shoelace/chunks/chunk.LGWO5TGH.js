import{a as m}from"./chunk.HJHGG7MG.js";import{a as l}from"./chunk.RHW2XED2.js";import{a}from"./chunk.DUQXEIJD.js";import{a as o,f as s}from"./chunk.N2CXUFX7.js";import{c as r}from"./chunk.I36YJ673.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends s{constructor(){super(...arguments);this.hasSlotController=new l(this,"footer","header","image")}render(){return r`
      <div
        part="base"
        class=${a({card:!0,"card--has-footer":this.hasSlotController.test("footer"),"card--has-image":this.hasSlotController.test("image"),"card--has-header":this.hasSlotController.test("header")})}
      >
        <slot name="image" part="image" class="card__image"></slot>
        <slot name="header" part="header" class="card__header"></slot>
        <slot part="body" class="card__body"></slot>
        <slot name="footer" part="footer" class="card__footer"></slot>
      </div>
    `}};t.styles=m,t=e([o("sl-card")],t);export{t as a};
