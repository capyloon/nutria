import{a as w}from"./chunk.MQYTTOUG.js";import{a as v}from"./chunk.MILZEQYZ.js";import{a as g}from"./chunk.S2WOXQYM.js";import{c as y}from"./chunk.ISLNSUAB.js";import{a as b}from"./chunk.RHW2XED2.js";import{a as p}from"./chunk.LSNASYMO.js";import{a as c}from"./chunk.DBCWAMJH.js";import{a as u}from"./chunk.JUX3LFDW.js";import{a as d,b as a,c as r,d as h,f}from"./chunk.X7Q42RGY.js";import{c as o}from"./chunk.3G4FHXSN.js";import{g as i}from"./chunk.OAQCUA7X.js";var s=class extends f{constructor(){super(...arguments);this.formSubmitController=new g(this);this.hasSlotController=new b(this,"help-text","label");this.localize=new y(this);this.menuItems=[];this.hasFocus=!1;this.isOpen=!1;this.displayLabel="";this.displayTags=[];this.multiple=!1;this.maxTagsVisible=3;this.disabled=!1;this.name="";this.placeholder="";this.size="medium";this.hoist=!1;this.value="";this.filled=!1;this.pill=!1;this.label="";this.placement="bottom";this.helpText="";this.required=!1;this.clearable=!1;this.invalid=!1;this.defaultValue=""}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.resizeMenu()),this.updateComplete.then(()=>{this.resizeObserver.observe(this),this.syncItemsFromValue()})}firstUpdated(){this.invalid=!this.input.checkValidity()}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this)}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.invalid=!this.input.checkValidity()}getValueAsArray(){return this.multiple&&this.value===""?[]:Array.isArray(this.value)?this.value:[this.value]}focus(e){this.control.focus(e)}blur(){this.control.blur()}handleBlur(){this.isOpen||(this.hasFocus=!1,u(this,"sl-blur"))}handleClearClick(e){e.stopPropagation(),this.value=this.multiple?[]:"",u(this,"sl-clear"),this.syncItemsFromValue()}handleDisabledChange(){this.disabled&&this.isOpen&&this.dropdown.hide(),this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus||(this.hasFocus=!0,u(this,"sl-focus"))}handleKeyDown(e){let t=e.target,l=this.menuItems[0],n=this.menuItems[this.menuItems.length-1];if(t.tagName.toLowerCase()!=="sl-tag"){if(e.key==="Tab"){this.isOpen&&this.dropdown.hide();return}if(["ArrowDown","ArrowUp"].includes(e.key)){if(e.preventDefault(),this.isOpen||this.dropdown.show(),e.key==="ArrowDown"){this.menu.setCurrentItem(l),l.focus();return}if(e.key==="ArrowUp"){this.menu.setCurrentItem(n),n.focus();return}}e.ctrlKey||e.metaKey||!this.isOpen&&e.key.length===1&&(e.stopPropagation(),e.preventDefault(),this.dropdown.show(),this.menu.typeToSelect(e))}}handleLabelClick(){this.focus()}handleMenuSelect(e){let t=e.detail.item;this.multiple?this.value=this.value.includes(t.value)?this.value.filter(l=>l!==t.value):[...this.value,t.value]:this.value=t.value,this.syncItemsFromValue()}handleMenuShow(){this.resizeMenu(),this.isOpen=!0}handleMenuHide(){this.isOpen=!1,this.control.focus()}handleMenuItemLabelChange(){if(!this.multiple){let e=this.menuItems.find(t=>t.value===this.value);this.displayLabel=e?e.getTextLabel():""}}handleMultipleChange(){var t;let e=this.getValueAsArray();this.value=this.multiple?e:(t=e[0])!=null?t:"",this.syncItemsFromValue()}async handleMenuSlotChange(){this.menuItems=[...this.querySelectorAll("sl-menu-item")];let e=[];this.menuItems.forEach(t=>{e.includes(t.value)&&console.error(`Duplicate value found in <sl-select> menu item: '${t.value}'`,t),e.push(t.value)}),await Promise.all(this.menuItems.map(t=>t.render)),this.syncItemsFromValue()}handleTagInteraction(e){e.composedPath().find(n=>n instanceof HTMLElement?n.classList.contains("tag__remove"):!1)&&e.stopPropagation()}async handleValueChange(){this.syncItemsFromValue(),await this.updateComplete,this.invalid=!this.input.checkValidity(),u(this,"sl-change")}resizeMenu(){this.menu.style.width=`${this.control.clientWidth}px`,requestAnimationFrame(()=>this.dropdown.reposition())}syncItemsFromValue(){let e=this.getValueAsArray();if(this.menuItems.forEach(t=>t.checked=e.includes(t.value)),this.multiple){let t=this.menuItems.filter(l=>e.includes(l.value));if(this.displayLabel=t.length>0?t[0].getTextLabel():"",this.displayTags=t.map(l=>o`
          <sl-tag
            part="tag"
            exportparts="
              base:tag__base,
              content:tag__content,
              remove-button:tag__remove-button
            "
            variant="neutral"
            size=${this.size}
            ?pill=${this.pill}
            removable
            @click=${this.handleTagInteraction}
            @keydown=${this.handleTagInteraction}
            @sl-remove=${n=>{n.stopPropagation(),this.disabled||(l.checked=!1,this.syncValueFromItems())}}
          >
            ${l.getTextLabel()}
          </sl-tag>
        `),this.maxTagsVisible>0&&this.displayTags.length>this.maxTagsVisible){let l=this.displayTags.length;this.displayLabel="",this.displayTags=this.displayTags.slice(0,this.maxTagsVisible),this.displayTags.push(o`
          <sl-tag
            part="tag"
            exportparts="
              base:tag__base,
              content:tag__content,
              remove-button:tag__remove-button
            "
            variant="neutral"
            size=${this.size}
          >
            +${l-this.maxTagsVisible}
          </sl-tag>
        `)}}else{let t=this.menuItems.find(l=>l.value===e[0]);this.displayLabel=t?t.getTextLabel():"",this.displayTags=[]}}syncValueFromItems(){let t=this.menuItems.filter(l=>l.checked).map(l=>l.value);this.multiple?this.value=this.value.filter(l=>t.includes(l)):this.value=t.length>0?t[0]:""}render(){let e=this.hasSlotController.test("label"),t=this.hasSlotController.test("help-text"),l=this.multiple?this.value.length>0:this.value!=="",n=this.label?!0:!!e,m=this.helpText?!0:!!t,I=this.clearable&&!this.disabled&&l;return o`
      <div
        part="form-control"
        class=${p({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":n,"form-control--has-help-text":m})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${n?"false":"true"}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <sl-dropdown
            part="base"
            .hoist=${this.hoist}
            .placement=${this.placement}
            .stayOpenOnSelect=${this.multiple}
            .containingElement=${this}
            ?disabled=${this.disabled}
            class=${p({select:!0,"select--open":this.isOpen,"select--empty":!this.value,"select--focused":this.hasFocus,"select--clearable":this.clearable,"select--disabled":this.disabled,"select--multiple":this.multiple,"select--standard":!this.filled,"select--filled":this.filled,"select--has-tags":this.multiple&&this.displayTags.length>0,"select--placeholder-visible":this.displayLabel==="","select--small":this.size==="small","select--medium":this.size==="medium","select--large":this.size==="large","select--pill":this.pill,"select--invalid":this.invalid})}
            @sl-show=${this.handleMenuShow}
            @sl-hide=${this.handleMenuHide}
          >
            <div
              part="control"
              slot="trigger"
              id="input"
              class="select__control"
              role="combobox"
              aria-describedby="help-text"
              aria-haspopup="true"
              aria-disabled=${this.disabled?"true":"false"}
              aria-expanded=${this.isOpen?"true":"false"}
              aria-controls="menu"
              tabindex=${this.disabled?"-1":"0"}
              @blur=${this.handleBlur}
              @focus=${this.handleFocus}
              @keydown=${this.handleKeyDown}
            >
              <span part="prefix" class="select__prefix">
                <slot name="prefix"></slot>
              </span>

              <div part="display-label" class="select__label">
                ${this.displayTags.length>0?o` <span part="tags" class="select__tags"> ${this.displayTags} </span> `:this.displayLabel.length>0?this.displayLabel:this.placeholder}
              </div>

              ${I?o`
                    <button
                      part="clear-button"
                      class="select__clear"
                      @click=${this.handleClearClick}
                      aria-label=${this.localize.term("clearEntry")}
                      tabindex="-1"
                    >
                      <slot name="clear-icon">
                        <sl-icon name="x-circle-fill" library="system"></sl-icon>
                      </slot>
                    </button>
                  `:""}

              <span part="suffix" class="select__suffix">
                <slot name="suffix"></slot>
              </span>

              <span part="icon" class="select__icon" aria-hidden="true">
                <sl-icon name="chevron-down" library="system"></sl-icon>
              </span>

              <!-- The hidden input tricks the browser's built-in validation so it works as expected. We use an input
              instead of a select because, otherwise, iOS will show a list of options during validation. The focus
              handler is used to move focus to the primary control when it's marked invalid.  -->
              <input
                class="select__hidden-select"
                aria-hidden="true"
                ?required=${this.required}
                .value=${l?"1":""}
                tabindex="-1"
                @focus=${()=>this.control.focus()}
              />
            </div>

            <sl-menu part="menu" id="menu" class="select__menu" @sl-select=${this.handleMenuSelect}>
              <slot @slotchange=${this.handleMenuSlotChange} @sl-label-change=${this.handleMenuItemLabelChange}></slot>
            </sl-menu>
          </sl-dropdown>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${m?"false":"true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};s.styles=w,i([h(".select")],s.prototype,"dropdown",2),i([h(".select__control")],s.prototype,"control",2),i([h(".select__hidden-select")],s.prototype,"input",2),i([h(".select__menu")],s.prototype,"menu",2),i([r()],s.prototype,"hasFocus",2),i([r()],s.prototype,"isOpen",2),i([r()],s.prototype,"displayLabel",2),i([r()],s.prototype,"displayTags",2),i([a({type:Boolean,reflect:!0})],s.prototype,"multiple",2),i([a({attribute:"max-tags-visible",type:Number})],s.prototype,"maxTagsVisible",2),i([a({type:Boolean,reflect:!0})],s.prototype,"disabled",2),i([a()],s.prototype,"name",2),i([a()],s.prototype,"placeholder",2),i([a()],s.prototype,"size",2),i([a({type:Boolean})],s.prototype,"hoist",2),i([a()],s.prototype,"value",2),i([a({type:Boolean,reflect:!0})],s.prototype,"filled",2),i([a({type:Boolean,reflect:!0})],s.prototype,"pill",2),i([a()],s.prototype,"label",2),i([a()],s.prototype,"placement",2),i([a({attribute:"help-text"})],s.prototype,"helpText",2),i([a({type:Boolean,reflect:!0})],s.prototype,"required",2),i([a({type:Boolean})],s.prototype,"clearable",2),i([a({type:Boolean,reflect:!0})],s.prototype,"invalid",2),i([v()],s.prototype,"defaultValue",2),i([c("disabled",{waitUntilFirstUpdate:!0})],s.prototype,"handleDisabledChange",1),i([c("multiple")],s.prototype,"handleMultipleChange",1),i([c("value",{waitUntilFirstUpdate:!0})],s.prototype,"handleValueChange",1),s=i([d("sl-select")],s);export{s as a};
