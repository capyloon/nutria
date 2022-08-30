import{a as n}from"./chunk.FLJ4JM6A.js";import{a as p}from"./chunk.RHW2XED2.js";import{a}from"./chunk.AFO4PD3A.js";import{a as o}from"./chunk.LSNASYMO.js";import{a as l,b as s,f as i}from"./chunk.X7Q42RGY.js";import{c as r}from"./chunk.3G4FHXSN.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends i{constructor(){super(...arguments);this.hasSlotController=new p(this,"prefix","suffix");this.rel="noreferrer noopener"}render(){let f=!!this.href;return r`
      <div
        part="base"
        class=${o({"breadcrumb-item":!0,"breadcrumb-item--has-prefix":this.hasSlotController.test("prefix"),"breadcrumb-item--has-suffix":this.hasSlotController.test("suffix")})}
      >
        <span part="prefix" class="breadcrumb-item__prefix">
          <slot name="prefix"></slot>
        </span>

        ${f?r`
              <a
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--link"
                href="${this.href}"
                target="${a(this.target?this.target:void 0)}"
                rel=${a(this.target?this.rel:void 0)}
              >
                <slot></slot>
              </a>
            `:r`
              <button part="label" type="button" class="breadcrumb-item__label breadcrumb-item__label--button">
                <slot></slot>
              </button>
            `}

        <span part="suffix" class="breadcrumb-item__suffix">
          <slot name="suffix"></slot>
        </span>

        <span part="separator" class="breadcrumb-item__separator" aria-hidden="true">
          <slot name="separator"></slot>
        </span>
      </div>
    `}};t.styles=n,e([s()],t.prototype,"href",2),e([s()],t.prototype,"target",2),e([s()],t.prototype,"rel",2),t=e([l("sl-breadcrumb-item")],t);export{t as a};
