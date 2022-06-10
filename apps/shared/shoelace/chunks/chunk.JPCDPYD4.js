import{a as d}from"./chunk.CQVQW36W.js";import{a as l}from"./chunk.RHW2XED2.js";import{a as s}from"./chunk.PC5WGFOA.js";import{a as o}from"./chunk.GVR6SJVE.js";import{c as a,h as r}from"./chunk.7EIHAL55.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends r{constructor(){super(...arguments);this.hasSlotController=new l(this,"footer","header","image")}render(){return a`
      <div
        part="base"
        class=${s({card:!0,"card--has-footer":this.hasSlotController.test("footer"),"card--has-image":this.hasSlotController.test("image"),"card--has-header":this.hasSlotController.test("header")})}
      >
        <div part="image" class="card__image">
          <slot name="image"></slot>
        </div>

        <div part="header" class="card__header">
          <slot name="header"></slot>
        </div>

        <div part="body" class="card__body">
          <slot></slot>
        </div>

        <div part="footer" class="card__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `}};t.styles=d,t=e([o("sl-card")],t);export{t as a};
