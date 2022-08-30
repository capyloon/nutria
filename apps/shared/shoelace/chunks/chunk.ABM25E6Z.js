import{a as i}from"./chunk.NBUJH2YW.js";import{a as l}from"./chunk.RHW2XED2.js";import{a}from"./chunk.LSNASYMO.js";import{a as o,f as s}from"./chunk.X7Q42RGY.js";import{c as r}from"./chunk.3G4FHXSN.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends s{constructor(){super(...arguments);this.hasSlotController=new l(this,"footer","header","image")}render(){return r`
      <div
        part="base"
        class=${a({card:!0,"card--has-footer":this.hasSlotController.test("footer"),"card--has-image":this.hasSlotController.test("image"),"card--has-header":this.hasSlotController.test("header")})}
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
    `}};t.styles=i,t=e([o("sl-card")],t);export{t as a};
