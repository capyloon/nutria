import{a as y}from"./chunk.6NLJTAAZ.js";import{a as v}from"./chunk.DCPKKQHR.js";import{a as g}from"./chunk.M2CI3PIT.js";import{a as b}from"./chunk.ZLZ62WZD.js";import{a as f}from"./chunk.RHW2XED2.js";import{a as l}from"./chunk.UBF6MLHX.js";import{a as u}from"./chunk.DUQXEIJD.js";import{a as n}from"./chunk.DBCWAMJH.js";import{a as c,b as i,c as h,d,f as m}from"./chunk.N2CXUFX7.js";import{c as p}from"./chunk.I36YJ673.js";import{g as t}from"./chunk.OAQCUA7X.js";var e=class extends m{constructor(){super(...arguments);this.formSubmitController=new b(this);this.hasSlotController=new f(this,"help-text","label");this.hasFocus=!1;this.invalid=!1;this.title="";this.name="";this.value="";this.size="medium";this.filled=!1;this.label="";this.helpText="";this.placeholder="";this.rows=4;this.resize="vertical";this.disabled=!1;this.readonly=!1;this.required=!1;this.defaultValue=""}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.setTextareaHeight()),this.updateComplete.then(()=>{this.setTextareaHeight(),this.resizeObserver.observe(this.input)})}firstUpdated(){this.invalid=!this.input.checkValidity()}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this.input)}focus(s){this.input.focus(s)}blur(){this.input.blur()}select(){this.input.select()}scrollPosition(s){if(s){typeof s.top=="number"&&(this.input.scrollTop=s.top),typeof s.left=="number"&&(this.input.scrollLeft=s.left);return}return{top:this.input.scrollTop,left:this.input.scrollTop}}setSelectionRange(s,a,r="none"){this.input.setSelectionRange(s,a,r)}setRangeText(s,a,r,o){this.input.setRangeText(s,a,r,o),this.value!==this.input.value&&(this.value=this.input.value),this.value!==this.input.value&&(this.value=this.input.value,this.setTextareaHeight())}checkValidity(){return this.input.checkValidity()}reportValidity(){return this.input.reportValidity()}setCustomValidity(s){this.input.setCustomValidity(s),this.invalid=!this.input.checkValidity()}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleChange(){this.value=this.input.value,this.setTextareaHeight(),this.emit("sl-change")}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleInput(){this.value=this.input.value,this.emit("sl-input")}handleRowsChange(){this.setTextareaHeight()}handleValueChange(){this.input.value=this.value,this.invalid=!this.input.checkValidity(),this.updateComplete.then(()=>this.setTextareaHeight())}setTextareaHeight(){this.resize==="auto"?(this.input.style.height="auto",this.input.style.height=`${this.input.scrollHeight}px`):this.input.style.height=void 0}render(){let s=this.hasSlotController.test("label"),a=this.hasSlotController.test("help-text"),r=this.label?!0:!!s,o=this.helpText?!0:!!a;return p`
      <div
        part="form-control"
        class=${u({"form-control":!0,"form-control--small":this.size==="small","form-control--medium":this.size==="medium","form-control--large":this.size==="large","form-control--has-label":r,"form-control--has-help-text":o})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${r?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${u({textarea:!0,"textarea--small":this.size==="small","textarea--medium":this.size==="medium","textarea--large":this.size==="large","textarea--standard":!this.filled,"textarea--filled":this.filled,"textarea--disabled":this.disabled,"textarea--focused":this.hasFocus,"textarea--empty":!this.value,"textarea--invalid":this.invalid,"textarea--resize-none":this.resize==="none","textarea--resize-vertical":this.resize==="vertical","textarea--resize-auto":this.resize==="auto"})}
          >
            <textarea
              part="textarea"
              id="input"
              class="textarea__control"
              title=${this.title}
              name=${l(this.name)}
              .value=${v(this.value)}
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
    `}};e.styles=y,t([d(".textarea__control")],e.prototype,"input",2),t([h()],e.prototype,"hasFocus",2),t([h()],e.prototype,"invalid",2),t([i()],e.prototype,"title",2),t([i()],e.prototype,"name",2),t([i()],e.prototype,"value",2),t([i({reflect:!0})],e.prototype,"size",2),t([i({type:Boolean,reflect:!0})],e.prototype,"filled",2),t([i()],e.prototype,"label",2),t([i({attribute:"help-text"})],e.prototype,"helpText",2),t([i()],e.prototype,"placeholder",2),t([i({type:Number})],e.prototype,"rows",2),t([i()],e.prototype,"resize",2),t([i({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([i({type:Boolean,reflect:!0})],e.prototype,"readonly",2),t([i({type:Number})],e.prototype,"minlength",2),t([i({type:Number})],e.prototype,"maxlength",2),t([i({type:Boolean,reflect:!0})],e.prototype,"required",2),t([i()],e.prototype,"autocapitalize",2),t([i()],e.prototype,"autocorrect",2),t([i()],e.prototype,"autocomplete",2),t([i({type:Boolean})],e.prototype,"autofocus",2),t([i()],e.prototype,"enterkeyhint",2),t([i({type:Boolean})],e.prototype,"spellcheck",2),t([i()],e.prototype,"inputmode",2),t([g()],e.prototype,"defaultValue",2),t([n("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),t([n("rows",{waitUntilFirstUpdate:!0})],e.prototype,"handleRowsChange",1),t([n("value",{waitUntilFirstUpdate:!0})],e.prototype,"handleValueChange",1),e=t([c("sl-textarea")],e);export{e as a};
