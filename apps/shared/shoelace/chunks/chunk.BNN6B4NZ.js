import{a as f}from"./chunk.3OXSIW24.js";import{a as n}from"./chunk.RHW2XED2.js";import{a as o}from"./chunk.PC5WGFOA.js";import{a}from"./chunk.2XQLLZV4.js";import{a as i,b as s}from"./chunk.GVR6SJVE.js";import{c as r,h as l}from"./chunk.7EIHAL55.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends l{constructor(){super(...arguments);this.hasSlotController=new n(this,"prefix","suffix");this.rel="noreferrer noopener"}render(){let p=!!this.href;return r`
      <div
        part="base"
        class=${o({"breadcrumb-item":!0,"breadcrumb-item--has-prefix":this.hasSlotController.test("prefix"),"breadcrumb-item--has-suffix":this.hasSlotController.test("suffix")})}
      >
        <span part="prefix" class="breadcrumb-item__prefix">
          <slot name="prefix"></slot>
        </span>

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

        <span part="suffix" class="breadcrumb-item__suffix">
          <slot name="suffix"></slot>
        </span>

        <span part="separator" class="breadcrumb-item__separator" aria-hidden="true">
          <slot name="separator"></slot>
        </span>
      </div>
    `}};t.styles=f,e([s()],t.prototype,"href",2),e([s()],t.prototype,"target",2),e([s()],t.prototype,"rel",2),t=e([i("sl-breadcrumb-item")],t);export{t as a};
