import{a as g}from"./chunk.R2DMQZZD.js";import{a as T}from"./chunk.YY5A5RUI.js";import{a as x}from"./chunk.3HZVBDU4.js";import{b as $}from"./chunk.LS63UDWI.js";import{a as y}from"./chunk.RHW2XED2.js";import{a as r}from"./chunk.NUWDNXKI.js";import{b as C}from"./chunk.6D3DWAMV.js";import{a as d}from"./chunk.RUACWBWF.js";import{a as n}from"./chunk.AR2QSYXF.js";import{a as f,b as s,c as p,d as v,e as u,g as b}from"./chunk.IKUI3UUK.js";import{c as m}from"./chunk.SYBSOZNG.js";import{e}from"./chunk.I4CX4JT3.js";var t=class extends b{constructor(){super(...arguments);this.formControlController=new $(this);this.hasSlotController=new y(this,"help-text","label");this.localize=new C(this);this.hasFocus=!1;this.hasTooltip=!1;this.title="";this.name="";this.value=0;this.label="";this.helpText="";this.disabled=!1;this.min=0;this.max=100;this.step=1;this.tooltip="top";this.tooltipFormatter=i=>i.toString();this.form="";this.defaultValue=0}get validity(){return this.input.validity}get validationMessage(){return this.input.validationMessage}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.syncRange()),this.value<this.min&&(this.value=this.min),this.value>this.max&&(this.value=this.max),this.updateComplete.then(()=>{this.syncRange(),this.resizeObserver.observe(this.input)})}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this.input)}handleChange(){this.emit("sl-change")}handleInput(){this.value=parseFloat(this.input.value),this.emit("sl-input"),this.syncRange()}handleBlur(){this.hasFocus=!1,this.hasTooltip=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.hasTooltip=!0,this.emit("sl-focus")}handleThumbDragStart(){this.hasTooltip=!0}handleThumbDragEnd(){this.hasTooltip=!1}syncProgress(i){this.input.style.setProperty("--percent",`${i*100}%`)}syncTooltip(i){if(this.output!==null){let a=this.input.offsetWidth,l=this.output.offsetWidth,o=getComputedStyle(this.input).getPropertyValue("--thumb-size"),F=this.localize.dir()==="rtl",c=a*i;if(F){let h=`${a-c}px + ${i} * ${o}`;this.output.style.translate=`calc((${h} - ${l/2}px - ${o} / 2))`}else{let h=`${c}px - ${i} * ${o}`;this.output.style.translate=`calc(${h} - ${l/2}px + ${o} / 2)`}}}handleValueChange(){this.formControlController.updateValidity(),this.input.value=this.value.toString(),this.value=parseFloat(this.input.value),this.syncRange()}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}syncRange(){let i=Math.max(0,(this.value-this.min)/(this.max-this.min));this.syncProgress(i),this.tooltip!=="none"&&this.syncTooltip(i)}handleInvalid(i){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(i)}focus(i){this.input.focus(i)}blur(){this.input.blur()}stepUp(){this.input.stepUp(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}stepDown(){this.input.stepDown(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}checkValidity(){return this.input.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.input.reportValidity()}setCustomValidity(i){this.input.setCustomValidity(i),this.formControlController.updateValidity()}render(){let i=this.hasSlotController.test("label"),a=this.hasSlotController.test("help-text"),l=this.label?!0:!!i,o=this.helpText?!0:!!a;return m`
      <div
        part="form-control"
        class=${d({"form-control":!0,"form-control--medium":!0,"form-control--has-label":l,"form-control--has-help-text":o})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${l?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${d({range:!0,"range--disabled":this.disabled,"range--focused":this.hasFocus,"range--rtl":this.localize.dir()==="rtl","range--tooltip-visible":this.hasTooltip,"range--tooltip-top":this.tooltip==="top","range--tooltip-bottom":this.tooltip==="bottom"})}
            @mousedown=${this.handleThumbDragStart}
            @mouseup=${this.handleThumbDragEnd}
            @touchstart=${this.handleThumbDragStart}
            @touchend=${this.handleThumbDragEnd}
          >
            <input
              part="input"
              id="input"
              class="range__control"
              title=${this.title}
              type="range"
              name=${r(this.name)}
              ?disabled=${this.disabled}
              min=${r(this.min)}
              max=${r(this.max)}
              step=${r(this.step)}
              .value=${T(this.value.toString())}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @focus=${this.handleFocus}
              @input=${this.handleInput}
              @invalid=${this.handleInvalid}
              @blur=${this.handleBlur}
            />
            ${this.tooltip!=="none"&&!this.disabled?m`
                  <output part="tooltip" class="range__tooltip">
                    ${typeof this.tooltipFormatter=="function"?this.tooltipFormatter(this.value):this.value}
                  </output>
                `:""}
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
    `}};t.styles=g,e([u(".range__control")],t.prototype,"input",2),e([u(".range__tooltip")],t.prototype,"output",2),e([p()],t.prototype,"hasFocus",2),e([p()],t.prototype,"hasTooltip",2),e([s()],t.prototype,"title",2),e([s()],t.prototype,"name",2),e([s({type:Number})],t.prototype,"value",2),e([s()],t.prototype,"label",2),e([s({attribute:"help-text"})],t.prototype,"helpText",2),e([s({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([s({type:Number})],t.prototype,"min",2),e([s({type:Number})],t.prototype,"max",2),e([s({type:Number})],t.prototype,"step",2),e([s()],t.prototype,"tooltip",2),e([s({attribute:!1})],t.prototype,"tooltipFormatter",2),e([s({reflect:!0})],t.prototype,"form",2),e([x()],t.prototype,"defaultValue",2),e([v({passive:!0})],t.prototype,"handleThumbDragStart",1),e([n("value",{waitUntilFirstUpdate:!0})],t.prototype,"handleValueChange",1),e([n("disabled",{waitUntilFirstUpdate:!0})],t.prototype,"handleDisabledChange",1),e([n("hasTooltip",{waitUntilFirstUpdate:!0})],t.prototype,"syncRange",1),t=e([f("sl-range")],t);export{t as a};
