import{a as C}from"./chunk.AO4NYPXG.js";import{a as x}from"./chunk.DCPKKQHR.js";import{a as T}from"./chunk.M2CI3PIT.js";import{a as $}from"./chunk.ZLZ62WZD.js";import{c as y}from"./chunk.MJKKE2MR.js";import{a as v}from"./chunk.RHW2XED2.js";import{a as r}from"./chunk.UBF6MLHX.js";import{a as c}from"./chunk.DUQXEIJD.js";import{a as n}from"./chunk.DBCWAMJH.js";import{a as b,b as s,c as h,d as m,f}from"./chunk.N2CXUFX7.js";import{c as p}from"./chunk.I36YJ673.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends f{constructor(){super(...arguments);this.formSubmitController=new $(this);this.hasSlotController=new v(this,"help-text","label");this.localize=new y(this);this.hasFocus=!1;this.hasTooltip=!1;this.invalid=!1;this.title="";this.name="";this.value=0;this.label="";this.helpText="";this.disabled=!1;this.min=0;this.max=100;this.step=1;this.tooltip="top";this.tooltipFormatter=i=>i.toString();this.defaultValue=0}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.syncRange()),this.value<this.min&&(this.value=this.min),this.value>this.max&&(this.value=this.max),this.updateComplete.then(()=>{this.syncRange(),this.resizeObserver.observe(this.input)})}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this.input)}focus(i){this.input.focus(i)}blur(){this.input.blur()}stepUp(){this.input.stepUp(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}stepDown(){this.input.stepDown(),this.value!==Number(this.input.value)&&(this.value=Number(this.input.value))}checkValidity(){return this.input.checkValidity()}reportValidity(){return this.input.reportValidity()}setCustomValidity(i){this.input.setCustomValidity(i),this.invalid=!this.input.checkValidity()}handleChange(){this.emit("sl-change")}handleInput(){this.value=parseFloat(this.input.value),this.emit("sl-input"),this.syncRange()}handleBlur(){this.hasFocus=!1,this.hasTooltip=!1,this.emit("sl-blur")}handleValueChange(){this.invalid=!this.input.checkValidity(),this.input.value=this.value.toString(),this.value=parseFloat(this.input.value),this.syncRange()}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,this.hasTooltip=!0,this.emit("sl-focus")}handleThumbDragStart(){this.hasTooltip=!0}handleThumbDragEnd(){this.hasTooltip=!1}syncRange(){let i=Math.max(0,(this.value-this.min)/(this.max-this.min));this.syncProgress(i),this.tooltip!=="none"&&this.syncTooltip(i)}syncProgress(i){this.input.style.setProperty("--percent",`${i*100}%`)}syncTooltip(i){if(this.output!==null){let a=this.input.offsetWidth,o=this.output.offsetWidth,l=getComputedStyle(this.input).getPropertyValue("--thumb-size"),g=this.localize.dir()==="rtl",d=a*i;if(g){let u=`${a-d}px + ${i} * ${l}`;this.output.style.translate=`calc((${u} - ${o/2}px - ${l} / 2))`}else{let u=`${d}px - ${i} * ${l}`;this.output.style.translate=`calc(${u} - ${o/2}px + ${l} / 2)`}}}render(){let i=this.hasSlotController.test("label"),a=this.hasSlotController.test("help-text"),o=this.label?!0:!!i,l=this.helpText?!0:!!a;return p`
      <div
        part="form-control"
        class=${c({"form-control":!0,"form-control--medium":!0,"form-control--has-label":o,"form-control--has-help-text":l})}
      >
        <label
          part="form-control-label"
          class="form-control__label"
          for="input"
          aria-hidden=${o?"false":"true"}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <div
            part="base"
            class=${c({range:!0,"range--disabled":this.disabled,"range--focused":this.hasFocus,"range--rtl":this.localize.dir()==="rtl","range--tooltip-visible":this.hasTooltip,"range--tooltip-top":this.tooltip==="top","range--tooltip-bottom":this.tooltip==="bottom"})}
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
              .value=${x(this.value.toString())}
              aria-describedby="help-text"
              @change=${this.handleChange}
              @input=${this.handleInput}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />
            ${this.tooltip!=="none"&&!this.disabled?p`
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
          aria-hidden=${l?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </div>
    `}};t.styles=C,e([m(".range__control")],t.prototype,"input",2),e([m(".range__tooltip")],t.prototype,"output",2),e([h()],t.prototype,"hasFocus",2),e([h()],t.prototype,"hasTooltip",2),e([h()],t.prototype,"invalid",2),e([s()],t.prototype,"title",2),e([s()],t.prototype,"name",2),e([s({type:Number})],t.prototype,"value",2),e([s()],t.prototype,"label",2),e([s({attribute:"help-text"})],t.prototype,"helpText",2),e([s({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([s({type:Number})],t.prototype,"min",2),e([s({type:Number})],t.prototype,"max",2),e([s({type:Number})],t.prototype,"step",2),e([s()],t.prototype,"tooltip",2),e([s({attribute:!1})],t.prototype,"tooltipFormatter",2),e([T()],t.prototype,"defaultValue",2),e([n("value",{waitUntilFirstUpdate:!0})],t.prototype,"handleValueChange",1),e([n("disabled",{waitUntilFirstUpdate:!0})],t.prototype,"handleDisabledChange",1),e([n("hasTooltip",{waitUntilFirstUpdate:!0})],t.prototype,"syncRange",1),t=e([b("sl-range")],t);export{t as a};
