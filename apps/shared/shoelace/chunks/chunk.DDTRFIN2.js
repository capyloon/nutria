import{a as C}from"./chunk.FOT7CJW6.js";import{a as y}from"./chunk.YY5A5RUI.js";import{a as g}from"./chunk.3HZVBDU4.js";import{b as v}from"./chunk.LS63UDWI.js";import{a as b}from"./chunk.RHW2XED2.js";import{a as r}from"./chunk.NUWDNXKI.js";import{a as u}from"./chunk.RUACWBWF.js";import{a as h}from"./chunk.AR2QSYXF.js";import{a as p,b as i,c as m,e as d,g as f}from"./chunk.IKUI3UUK.js";import{c}from"./chunk.SYBSOZNG.js";import{e as t}from"./chunk.I4CX4JT3.js";var e=class extends f{constructor(){super(...arguments);this.formControlController=new v(this,{assumeInteractionOn:["sl-blur","sl-input"]});this.hasSlotController=new b(this,"help-text","label");this.hasFocus=!1;this.title="";this.name="";this.value="";this.size="medium";this.filled=!1;this.label="";this.helpText="";this.placeholder="";this.rows=4;this.resize="vertical";this.disabled=!1;this.readonly=!1;this.form="";this.required=!1;this.spellcheck=!0;this.defaultValue=""}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.setTextareaHeight()),this.updateComplete.then(()=>{this.setTextareaHeight(),this.resizeObserver.observe(this.input)})}firstUpdated(){this.formControlController.updateValidity()}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this.input)}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.setTextareaHeight(),this.emit("sl-change")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.emit("sl-input")}handleInvalid(l){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(l)}setTextareaHeight(){this.resize==="auto"?(this.input.style.height="auto",this.input.style.height=`${this.input.scrollHeight}px`):this.input.style.height=void 0}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleRowsChange(){this.setTextareaHeight()}async handleValueChange(){await this.updateComplete,this.formControlController.updateValidity(),this.setTextareaHeight()}focus(l){this.input.focus(l)}blur(){this.input.blur()}select(){this.input.select()}scrollPosition(l){if(l){typeof l.top=="number"&&(this.input.scrollTop=l.top),typeof l.left=="number"&&(this.input.scrollLeft=l.left);return}return{top:this.input.scrollTop,left:this.input.scrollTop}}setSelectionRange(l,a,s="none"){this.input.setSelectionRange(l,a,s)}setRangeText(l,a,s,n){this.input.setRangeText(l,a,s,n),this.value!==this.input.value&&(this.value=this.input.value),this.value!==this.input.value&&(this.value=this.input.value,this.setTextareaHeight())}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(l){this.input.setCustomValidity(l),this.formControlController.updateValidity()}render(){let l=this.hasSlotController.test("label"),a=this.hasSlotController.test("help-text"),s=this.label?!0:!!l,n=this.helpText?!0:!!a;return c`
      <div
        part="form-control"
        class=${u({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":s,"form-control--has-help-text":n})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${s?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${u({textarea:!0,"textarea--small":this.size==="small","textarea--medium":this.size==="medium","textarea--large":this.size==="large","textarea--standard":!this.filled,"textarea--filled":this.filled,"textarea--disabled":this.disabled,"textarea--focused":this.hasFocus,"textarea--empty":!this.value,"textarea--resize-none":this.resize==="none","textarea--resize-vertical":this.resize==="vertical","textarea--resize-auto":this.resize==="auto"})}
          >
            <textarea
              part="textarea"
              id="input"
              class="textarea__control"
              title=${this.title}
              name=${r(this.name)}
              .value=${y(this.value)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${r(this.placeholder)}
              rows=${r(this.rows)}
              minlength=${r(this.minlength)}
              maxlength=${r(this.maxlength)}
              autocapitalize=${r(this.autocapitalize)}
              autocorrect=${r(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${r(this.spellcheck)}
              enterkeyhint=${r(this.enterkeyhint)}
              inputmode=${r(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            ></textarea>
          </div>
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${n?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </div>
    `}};e.styles=C,t([d(".textarea__control")],e.prototype,"input",2),t([m()],e.prototype,"hasFocus",2),t([i()],e.prototype,"title",2),t([i()],e.prototype,"name",2),t([i()],e.prototype,"value",2),t([i({reflect:!0})],e.prototype,"size",2),t([i({type:Boolean,reflect:!0})],e.prototype,"filled",2),t([i()],e.prototype,"label",2),t([i({attribute:"help-text"})],e.prototype,"helpText",2),t([i()],e.prototype,"placeholder",2),t([i({type:Number})],e.prototype,"rows",2),t([i()],e.prototype,"resize",2),t([i({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([i({type:Boolean,reflect:!0})],e.prototype,"readonly",2),t([i({reflect:!0})],e.prototype,"form",2),t([i({type:Boolean,reflect:!0})],e.prototype,"required",2),t([i({type:Number})],e.prototype,"minlength",2),t([i({type:Number})],e.prototype,"maxlength",2),t([i()],e.prototype,"autocapitalize",2),t([i()],e.prototype,"autocorrect",2),t([i()],e.prototype,"autocomplete",2),t([i({type:Boolean})],e.prototype,"autofocus",2),t([i()],e.prototype,"enterkeyhint",2),t([i({type:Boolean,converter:{fromAttribute:o=>!(!o||o==="false"),toAttribute:o=>o?"true":"false"}})],e.prototype,"spellcheck",2),t([i()],e.prototype,"inputmode",2),t([g()],e.prototype,"defaultValue",2),t([h("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),t([h("rows",{waitUntilFirstUpdate:!0})],e.prototype,"handleRowsChange",1),t([h("value",{waitUntilFirstUpdate:!0})],e.prototype,"handleValueChange",1),e=t([p("sl-textarea")],e);export{e as a};
