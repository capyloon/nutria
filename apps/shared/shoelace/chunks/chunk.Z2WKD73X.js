import{a as m}from"./chunk.WJKWFSYJ.js";import{a as l}from"./chunk.RHW2XED2.js";import{a as s}from"./chunk.RUACWBWF.js";import{a as r,f as a}from"./chunk.JFPKWAAH.js";import{c as o}from"./chunk.SYBSOZNG.js";import{e}from"./chunk.I4CX4JT3.js";var t=class extends a{constructor(){super(...arguments);this.hasSlotController=new l(this,"footer","header","image")}render(){return o`
      <div
        part="base"
        class=${s({card:!0,"card--has-footer":this.hasSlotController.test("footer"),"card--has-image":this.hasSlotController.test("image"),"card--has-header":this.hasSlotController.test("header")})}
      >
        <slot name="image" part="image" class="card__image"></slot>
        <slot name="header" part="header" class="card__header"></slot>
        <slot part="body" class="card__body"></slot>
        <slot name="footer" part="footer" class="card__footer"></slot>
      </div>
    `}};t.styles=m,t=e([r("sl-card")],t);export{t as a};
