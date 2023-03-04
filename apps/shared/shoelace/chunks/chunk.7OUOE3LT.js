import{a as I}from"./chunk.VCQRTJY2.js";import{c as k}from"./chunk.GDLCZNAE.js";import{a as $}from"./chunk.3HZVBDU4.js";import{b as E}from"./chunk.4XW3OOU6.js";import{a as g,c as O}from"./chunk.UJEHPUK2.js";import{a as C}from"./chunk.KLRPP4NQ.js";import{a as y,d as v}from"./chunk.HFPOGNHG.js";import{b as _}from"./chunk.6D3DWAMV.js";import{a as D}from"./chunk.RHW2XED2.js";import{a as b}from"./chunk.RUACWBWF.js";import{a as m}from"./chunk.AR2QSYXF.js";import{a as x,b as a,c,d as h,f as w}from"./chunk.PRU55YXS.js";import{c as u}from"./chunk.SYBSOZNG.js";import{e as s}from"./chunk.I4CX4JT3.js";var e=class extends w{constructor(){super(...arguments);this.formControlController=new E(this,{assumeInteractionOn:["sl-blur","sl-input"]});this.hasSlotController=new D(this,"help-text","label");this.localize=new _(this);this.typeToSelectString="";this.hasFocus=!1;this.displayLabel="";this.selectedOptions=[];this.name="";this.value="";this.defaultValue="";this.size="medium";this.placeholder="";this.multiple=!1;this.maxOptionsVisible=3;this.disabled=!1;this.clearable=!1;this.open=!1;this.hoist=!1;this.filled=!1;this.pill=!1;this.label="";this.placement="bottom";this.helpText="";this.form="";this.required=!1}get validity(){return this.valueInput.validity}get validationMessage(){return this.valueInput.validationMessage}connectedCallback(){super.connectedCallback(),this.handleDocumentFocusIn=this.handleDocumentFocusIn.bind(this),this.handleDocumentKeyDown=this.handleDocumentKeyDown.bind(this),this.handleDocumentMouseDown=this.handleDocumentMouseDown.bind(this),this.open=!1}addOpenListeners(){document.addEventListener("focusin",this.handleDocumentFocusIn),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){document.removeEventListener("focusin",this.handleDocumentFocusIn),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown)}handleFocus(){this.hasFocus=!0,this.displayInput.setSelectionRange(0,0),this.emit("sl-focus")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleDocumentFocusIn(t){let i=t.composedPath();this&&!i.includes(this)&&this.hide()}handleDocumentKeyDown(t){let i=t.target,l=i.closest(".select__clear")!==null,o=i.closest("sl-icon-button")!==null;if(!(l||o)){if(t.key==="Escape"&&this.open&&(t.preventDefault(),t.stopPropagation(),this.hide(),this.displayInput.focus({preventScroll:!0})),t.key==="Enter"||t.key===" "&&this.typeToSelectString===""){if(t.preventDefault(),t.stopImmediatePropagation(),!this.open){this.show();return}this.currentOption&&!this.currentOption.disabled&&(this.multiple?this.toggleOptionSelection(this.currentOption):this.setSelectedOptions(this.currentOption),this.updateComplete.then(()=>{this.emit("sl-input"),this.emit("sl-change")}),this.multiple||(this.hide(),this.displayInput.focus({preventScroll:!0})));return}if(["ArrowUp","ArrowDown","Home","End"].includes(t.key)){let n=this.getAllOptions(),p=n.indexOf(this.currentOption),r=Math.max(0,p);if(t.preventDefault(),!this.open&&(this.show(),this.currentOption))return;t.key==="ArrowDown"?(r=p+1,r>n.length-1&&(r=0)):t.key==="ArrowUp"?(r=p-1,r<0&&(r=n.length-1)):t.key==="Home"?r=0:t.key==="End"&&(r=n.length-1),this.setCurrentOption(n[r])}if(t.key.length===1||t.key==="Backspace"){let n=this.getAllOptions();if(t.metaKey||t.ctrlKey||t.altKey)return;if(!this.open){if(t.key==="Backspace")return;this.show()}t.stopPropagation(),t.preventDefault(),clearTimeout(this.typeToSelectTimeout),this.typeToSelectTimeout=window.setTimeout(()=>this.typeToSelectString="",1e3),t.key==="Backspace"?this.typeToSelectString=this.typeToSelectString.slice(0,-1):this.typeToSelectString+=t.key.toLowerCase();for(let p of n)if(p.getTextLabel().toLowerCase().startsWith(this.typeToSelectString)){this.setCurrentOption(p);break}}}}handleDocumentMouseDown(t){let i=t.composedPath();this&&!i.includes(this)&&this.hide()}handleLabelClick(){this.displayInput.focus()}handleComboboxMouseDown(t){let l=t.composedPath().some(o=>o instanceof Element&&o.tagName.toLowerCase()==="sl-icon-button");this.disabled||l||(t.preventDefault(),this.displayInput.focus({preventScroll:!0}),this.open=!this.open)}handleComboboxKeyDown(t){t.stopPropagation(),this.handleDocumentKeyDown(t)}handleClearClick(t){t.stopPropagation(),this.value!==""&&(this.setSelectedOptions([]),this.displayInput.focus({preventScroll:!0}),this.updateComplete.then(()=>{this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change")}))}handleClearMouseDown(t){t.stopPropagation(),t.preventDefault()}handleOptionClick(t){let l=t.target.closest("sl-option"),o=this.value;l&&!l.disabled&&(this.multiple?this.toggleOptionSelection(l):this.setSelectedOptions(l),this.updateComplete.then(()=>this.displayInput.focus({preventScroll:!0})),this.value!==o&&this.updateComplete.then(()=>{this.emit("sl-input"),this.emit("sl-change")}),this.multiple||(this.hide(),this.displayInput.focus({preventScroll:!0})))}handleDefaultSlotChange(){let t=this.getAllOptions(),i=Array.isArray(this.value)?this.value:[this.value],l=[];t.forEach(o=>{l.includes(o.value)&&console.error(`An option with a duplicate value of "${o.value}" has been found in <sl-select>. All options must have unique values.`,o),l.push(o.value)}),this.setSelectedOptions(t.filter(o=>i.includes(o.value)))}handleTagRemove(t,i){t.stopPropagation(),this.disabled||(this.toggleOptionSelection(i,!1),this.updateComplete.then(()=>{this.emit("sl-input"),this.emit("sl-change")}))}getAllOptions(){return[...this.querySelectorAll("sl-option")]}getFirstOption(){return this.querySelector("sl-option")}setCurrentOption(t){this.getAllOptions().forEach(l=>{l.current=!1,l.tabIndex=-1}),t&&(this.currentOption=t,t.current=!0,t.tabIndex=0,t.focus())}setSelectedOptions(t){let i=this.getAllOptions(),l=Array.isArray(t)?t:[t];i.forEach(o=>o.selected=!1),l.length&&l.forEach(o=>o.selected=!0),this.selectionChanged()}toggleOptionSelection(t,i){i===!0||i===!1?t.selected=i:t.selected=!t.selected,this.selectionChanged()}selectionChanged(){var t,i,l,o;this.selectedOptions=this.getAllOptions().filter(n=>n.selected),this.multiple?(this.value=this.selectedOptions.map(n=>n.value),this.placeholder&&this.value.length===0?this.displayLabel="":this.displayLabel=this.localize.term("numOptionsSelected",this.selectedOptions.length)):(this.value=(i=(t=this.selectedOptions[0])==null?void 0:t.value)!=null?i:"",this.displayLabel=(o=(l=this.selectedOptions[0])==null?void 0:l.getTextLabel())!=null?o:""),this.updateComplete.then(()=>{this.formControlController.updateValidity()})}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleDisabledChange(){this.disabled&&(this.open=!1,this.handleOpenChange())}handleValueChange(){let t=this.getAllOptions(),i=Array.isArray(this.value)?this.value:[this.value];this.setSelectedOptions(t.filter(l=>i.includes(l.value)))}async handleOpenChange(){if(this.open&&!this.disabled){this.setCurrentOption(this.selectedOptions[0]||this.getFirstOption()),this.emit("sl-show"),this.addOpenListeners(),await v(this),this.listbox.hidden=!1,this.popup.active=!0,requestAnimationFrame(()=>{this.setCurrentOption(this.currentOption)});let{keyframes:t,options:i}=O(this,"select.show",{dir:this.localize.dir()});await y(this.popup.popup,t,i),this.currentOption&&k(this.currentOption,this.listbox,"vertical","auto"),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await v(this);let{keyframes:t,options:i}=O(this,"select.hide",{dir:this.localize.dir()});await y(this.popup.popup,t,i),this.listbox.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}async show(){if(this.open||this.disabled){this.open=!1;return}return this.open=!0,C(this,"sl-after-show")}async hide(){if(!this.open||this.disabled){this.open=!1;return}return this.open=!1,C(this,"sl-after-hide")}checkValidity(){return this.valueInput.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.valueInput.reportValidity()}setCustomValidity(t){this.valueInput.setCustomValidity(t),this.formControlController.updateValidity()}focus(t){this.displayInput.focus(t)}blur(){this.displayInput.blur()}render(){let t=this.hasSlotController.test("label"),i=this.hasSlotController.test("help-text"),l=this.label?!0:!!t,o=this.helpText?!0:!!i,n=this.clearable&&!this.disabled&&this.value.length>0,p=this.placeholder&&this.value.length===0;return u`
      <div
        part="form-control"
        class=${b({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":l,"form-control--has-help-text":o})}
      >
        <label
          id="label"
          part="form-control-label"
          class="form-control__label"
          aria-hidden=${l?"false":"true"}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <sl-popup
            class=${b({select:!0,"select--standard":!0,"select--filled":this.filled,"select--pill":this.pill,"select--open":this.open,"select--disabled":this.disabled,"select--multiple":this.multiple,"select--focused":this.hasFocus,"select--placeholder-visible":p,"select--top":this.placement==="top","select--bottom":this.placement==="bottom","select--small":this.size==="small","select--medium":this.size==="medium","select--large":this.size==="large"})}
            placement=${this.placement}
            strategy=${this.hoist?"fixed":"absolute"}
            flip
            shift
            sync="width"
            auto-size="vertical"
            auto-size-padding="10"
          >
            <div
              part="combobox"
              class="select__combobox"
              slot="anchor"
              @keydown=${this.handleComboboxKeyDown}
              @mousedown=${this.handleComboboxMouseDown}
            >
              <slot part="prefix" name="prefix" class="select__prefix"></slot>

              <input
                part="display-input"
                class="select__display-input"
                type="text"
                placeholder=${this.placeholder}
                .disabled=${this.disabled}
                .value=${this.displayLabel}
                autocomplete="off"
                spellcheck="false"
                autocapitalize="off"
                readonly
                aria-controls="listbox"
                aria-expanded=${this.open?"true":"false"}
                aria-haspopup="listbox"
                aria-labelledby="label"
                aria-disabled=${this.disabled?"true":"false"}
                aria-describedby="help-text"
                role="combobox"
                tabindex="0"
                @focus=${this.handleFocus}
                @blur=${this.handleBlur}
              />

              ${this.multiple?u`
                    <div part="tags" class="select__tags">
                      ${this.selectedOptions.map((r,f)=>f<this.maxOptionsVisible||this.maxOptionsVisible<=0?u`
                            <sl-tag
                              part="tag"
                              exportparts="
                                base:tag__base,
                                content:tag__content,
                                remove-button:tag__remove-button,
                                remove-button__base:tag__remove-button__base
                              "
                              ?pill=${this.pill}
                              size=${this.size}
                              removable
                              @sl-remove=${T=>this.handleTagRemove(T,r)}
                            >
                              ${r.getTextLabel()}
                            </sl-tag>
                          `:f===this.maxOptionsVisible?u` <sl-tag size=${this.size}> +${this.selectedOptions.length-f} </sl-tag> `:null)}
                    </div>
                  `:""}

              <input
                class="select__value-input"
                type="text"
                ?disabled=${this.disabled}
                ?required=${this.required}
                .value=${Array.isArray(this.value)?this.value.join(", "):this.value}
                tabindex="-1"
                aria-hidden="true"
                @focus=${()=>this.focus()}
                @invalid=${this.handleInvalid}
              />

              ${n?u`
                    <button
                      part="clear-button"
                      class="select__clear"
                      type="button"
                      aria-label=${this.localize.term("clearEntry")}
                      @mousedown=${this.handleClearMouseDown}
                      @click=${this.handleClearClick}
                      tabindex="-1"
                    >
                      <slot name="clear-icon">
                        <sl-icon name="x-circle-fill" library="system"></sl-icon>
                      </slot>
                    </button>
                  `:""}

              <slot name="expand-icon" part="expand-icon" class="select__expand-icon">
                <sl-icon library="system" name="chevron-down"></sl-icon>
              </slot>
            </div>

            <slot
              id="listbox"
              role="listbox"
              aria-expanded=${this.open?"true":"false"}
              aria-multiselectable=${this.multiple?"true":"false"}
              aria-labelledby="label"
              part="listbox"
              class="select__listbox"
              tabindex="-1"
              @mouseup=${this.handleOptionClick}
              @slotchange=${this.handleDefaultSlotChange}
            ></slot>
          </sl-popup>
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${o?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </div>
    `}};e.styles=I,s([h(".select")],e.prototype,"popup",2),s([h(".select__combobox")],e.prototype,"combobox",2),s([h(".select__display-input")],e.prototype,"displayInput",2),s([h(".select__value-input")],e.prototype,"valueInput",2),s([h(".select__listbox")],e.prototype,"listbox",2),s([c()],e.prototype,"hasFocus",2),s([c()],e.prototype,"displayLabel",2),s([c()],e.prototype,"currentOption",2),s([c()],e.prototype,"selectedOptions",2),s([a()],e.prototype,"name",2),s([a({converter:{fromAttribute:d=>d.split(" "),toAttribute:d=>d.join(" ")}})],e.prototype,"value",2),s([$()],e.prototype,"defaultValue",2),s([a()],e.prototype,"size",2),s([a()],e.prototype,"placeholder",2),s([a({type:Boolean,reflect:!0})],e.prototype,"multiple",2),s([a({attribute:"max-options-visible",type:Number})],e.prototype,"maxOptionsVisible",2),s([a({type:Boolean,reflect:!0})],e.prototype,"disabled",2),s([a({type:Boolean})],e.prototype,"clearable",2),s([a({type:Boolean,reflect:!0})],e.prototype,"open",2),s([a({type:Boolean})],e.prototype,"hoist",2),s([a({type:Boolean,reflect:!0})],e.prototype,"filled",2),s([a({type:Boolean,reflect:!0})],e.prototype,"pill",2),s([a()],e.prototype,"label",2),s([a({reflect:!0})],e.prototype,"placement",2),s([a({attribute:"help-text"})],e.prototype,"helpText",2),s([a({reflect:!0})],e.prototype,"form",2),s([a({type:Boolean,reflect:!0})],e.prototype,"required",2),s([m("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),s([m("value",{waitUntilFirstUpdate:!0})],e.prototype,"handleValueChange",1),s([m("open",{waitUntilFirstUpdate:!0})],e.prototype,"handleOpenChange",1),e=s([x("sl-select")],e);g("select.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}});g("select.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}});export{e as a};
