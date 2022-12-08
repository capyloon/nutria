import{a as m}from"./chunk.WB7ZXTN4.js";import{a as f}from"./chunk.RHW2XED2.js";import{a}from"./chunk.UBF6MLHX.js";import{a as o}from"./chunk.DUQXEIJD.js";import{a as l,b as s,f as i}from"./chunk.N2CXUFX7.js";import{c as r}from"./chunk.I36YJ673.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends i{constructor(){super(...arguments);this.hasSlotController=new f(this,"prefix","suffix");this.rel="noreferrer noopener"}render(){let p=!!this.href;return r`
      <div
        part="base"
        class=${o({"breadcrumb-item":!0,"breadcrumb-item--has-prefix":this.hasSlotController.test("prefix"),"breadcrumb-item--has-suffix":this.hasSlotController.test("suffix")})}
      >
        <slot name="prefix" part="prefix" class="breadcrumb-item__prefix"></slot>

        ${p?r`
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

        <slot name="suffix" part="suffix" class="breadcrumb-item__suffix"></slot>

        <slot name="separator" part="separator" class="breadcrumb-item__separator" aria-hidden="true"></slot>
      </div>
    `}};t.styles=m,e([s()],t.prototype,"href",2),e([s()],t.prototype,"target",2),e([s()],t.prototype,"rel",2),t=e([l("sl-breadcrumb-item")],t);export{t as a};
