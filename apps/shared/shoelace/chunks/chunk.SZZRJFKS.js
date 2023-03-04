import{a as m}from"./chunk.WFVGYVON.js";import{a}from"./chunk.NUWDNXKI.js";import{a as f}from"./chunk.RHW2XED2.js";import{a as i}from"./chunk.RUACWBWF.js";import{a as l,b as r,f as o}from"./chunk.PRU55YXS.js";import{c as s}from"./chunk.SYBSOZNG.js";import{e}from"./chunk.I4CX4JT3.js";var t=class extends o{constructor(){super(...arguments);this.hasSlotController=new f(this,"prefix","suffix");this.rel="noreferrer noopener"}render(){let p=!!this.href;return s`
      <div
        part="base"
        class=${i({"breadcrumb-item":!0,"breadcrumb-item--has-prefix":this.hasSlotController.test("prefix"),"breadcrumb-item--has-suffix":this.hasSlotController.test("suffix")})}
      >
        <slot name="prefix" part="prefix" class="breadcrumb-item__prefix"></slot>

        ${p?s`
              <a
                part="label"
                class="breadcrumb-item__label breadcrumb-item__label--link"
                href="${this.href}"
                target="${a(this.target?this.target:void 0)}"
                rel=${a(this.target?this.rel:void 0)}
              >
                <slot></slot>
              </a>
            `:s`
              <button part="label" type="button" class="breadcrumb-item__label breadcrumb-item__label--button">
                <slot></slot>
              </button>
            `}

        <slot name="suffix" part="suffix" class="breadcrumb-item__suffix"></slot>

        <slot name="separator" part="separator" class="breadcrumb-item__separator" aria-hidden="true"></slot>
      </div>
    `}};t.styles=m,e([r()],t.prototype,"href",2),e([r()],t.prototype,"target",2),e([r()],t.prototype,"rel",2),t=e([l("sl-breadcrumb-item")],t);export{t as a};
