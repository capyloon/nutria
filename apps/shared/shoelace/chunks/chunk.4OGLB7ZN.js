import{a as y}from"./chunk.AIFWRKNZ.js";import{a as g}from"./chunk.R5UEL6LD.js";import{a as v}from"./chunk.E35DOPAL.js";import{a as b}from"./chunk.RHW2XED2.js";import{a as l}from"./chunk.2XQLLZV4.js";import{a as u}from"./chunk.PC5WGFOA.js";import{a as h}from"./chunk.OSEV3RCT.js";import{a as r}from"./chunk.V4OMSSO6.js";import{a as d,b as i,c as m,d as f}from"./chunk.GVR6SJVE.js";import{c as p,h as c}from"./chunk.7EIHAL55.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends c{constructor(){super(...arguments);this.formSubmitController=new v(this);this.hasSlotController=new b(this,"help-text","label");this.hasFocus=!1;this.size="medium";this.value="";this.filled=!1;this.label="";this.helpText="";this.rows=4;this.resize="vertical";this.disabled=!1;this.readonly=!1;this.required=!1;this.invalid=!1}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.setTextareaHeight()),this.updateComplete.then(()=>{this.setTextareaHeight(),this.resizeObserver.observe(this.input)})}firstUpdated(){this.invalid=!this.input.checkValidity()}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this.input)}focus(s){this.input.focus(s)}blur(){this.input.blur()}select(){this.input.select()}scrollPosition(s){if(s){typeof s.top=="number"&&(this.input.scrollTop=s.top),typeof s.left=="number"&&(this.input.scrollLeft=s.left);return}return{top:this.input.scrollTop,left:this.input.scrollTop}}setSelectionRange(s,n,a="none"){this.input.setSelectionRange(s,n,a)}setRangeText(s,n,a,o="preserve"){this.input.setRangeText(s,n,a,o),this.value!==this.input.value&&(this.value=this.input.value,r(this,"sl-input")),this.value!==this.input.value&&(this.value=this.input.value,this.setTextareaHeight(),r(this,"sl-input"),r(this,"sl-change"))}reportValidity(){return this.input.reportValidity()}setCustomValidity(s){this.input.setCustomValidity(s),this.invalid=!this.input.checkValidity()}handleBlur(){this.hasFocus=!1,r(this,"sl-blur")}handleChange(){this.value=this.input.value,this.setTextareaHeight(),r(this,"sl-change")}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,r(this,"sl-focus")}handleInput(){this.value=this.input.value,this.setTextareaHeight(),r(this,"sl-input")}handleRowsChange(){this.setTextareaHeight()}handleValueChange(){this.invalid=!this.input.checkValidity()}setTextareaHeight(){this.resize==="auto"?(this.input.style.height="auto",this.input.style.height=`${this.input.scrollHeight}px`):this.input.style.height=void 0}render(){let s=this.hasSlotController.test("label"),n=this.hasSlotController.test("help-text"),a=this.label?!0:!!s,o=this.helpText?!0:!!n;return p`
      <div
        part="form-control"
        class=${u({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":a,"form-control--has-help-text":o})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${a?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${u({textarea:!0,"textarea--small":this.size==="small","textarea--medium":this.size==="medium","textarea--large":this.size==="large","textarea--standard":!this.filled,"textarea--filled":this.filled,"textarea--disabled":this.disabled,"textarea--focused":this.hasFocus,"textarea--empty":this.value.length===0,"textarea--invalid":this.invalid,"textarea--resize-none":this.resize==="none","textarea--resize-vertical":this.resize==="vertical","textarea--resize-auto":this.resize==="auto"})}
          >
            <textarea
              part="textarea"
              id="input"
              class="textarea__control"
              name=${l(this.name)}
              .value=${g(this.value)}
              ?disabled=${this.disabled}
              ?readonly=${this.readonly}
              ?required=${this.required}
              placeholder=${l(this.placeholder)}
              rows=${l(this.rows)}
              minlength=${l(this.minlength)}
              maxlength=${l(this.maxlength)}
              autocapitalize=${l(this.autocapitalize)}
              autocorrect=${l(this.autocorrect)}
              ?autofocus=${this.autofocus}
              spellcheck=${l(this.spellcheck)}
              enterkeyhint=${l(this.enterkeyhint)}
              inputmode=${l(this.inputmode)}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            ></textarea>
          </div>
        </div>

        <div
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${o?"false":"true"}
        >
          <slot name="help-text">${this.helpText}</slot>
        </div>
      </div>
    `}};e.styles=y,t([f(".textarea__control")],e.prototype,"input",2),t([m()],e.prototype,"hasFocus",2),t([i({reflect:!0})],e.prototype,"size",2),t([i()],e.prototype,"name",2),t([i()],e.prototype,"value",2),t([i({type:Boolean,reflect:!0})],e.prototype,"filled",2),t([i()],e.prototype,"label",2),t([i({attribute:"help-text"})],e.prototype,"helpText",2),t([i()],e.prototype,"placeholder",2),t([i({type:Number})],e.prototype,"rows",2),t([i()],e.prototype,"resize",2),t([i({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([i({type:Boolean,reflect:!0})],e.prototype,"readonly",2),t([i({type:Number})],e.prototype,"minlength",2),t([i({type:Number})],e.prototype,"maxlength",2),t([i({type:Boolean,reflect:!0})],e.prototype,"required",2),t([i({type:Boolean,reflect:!0})],e.prototype,"invalid",2),t([i()],e.prototype,"autocapitalize",2),t([i()],e.prototype,"autocorrect",2),t([i()],e.prototype,"autocomplete",2),t([i({type:Boolean})],e.prototype,"autofocus",2),t([i()],e.prototype,"enterkeyhint",2),t([i({type:Boolean})],e.prototype,"spellcheck",2),t([i()],e.prototype,"inputmode",2),t([h("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),t([h("rows",{waitUntilFirstUpdate:!0})],e.prototype,"handleRowsChange",1),t([h("value",{waitUntilFirstUpdate:!0})],e.prototype,"handleValueChange",1),e=t([d("sl-textarea")],e);export{e as a};
