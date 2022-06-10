import{a as $}from"./chunk.3CM5AFPU.js";import{a as y}from"./chunk.R5UEL6LD.js";import{a as v}from"./chunk.E35DOPAL.js";import{a as f}from"./chunk.RHW2XED2.js";import{a as l}from"./chunk.2XQLLZV4.js";import{a as c}from"./chunk.PC5WGFOA.js";import{a as m}from"./chunk.OSEV3RCT.js";import{a as r}from"./chunk.V4OMSSO6.js";import{a as b,b as s,c as u,d as p}from"./chunk.GVR6SJVE.js";import{c as n,h as d}from"./chunk.7EIHAL55.js";import{g as e}from"./chunk.OAQCUA7X.js";var t=class extends d{constructor(){super(...arguments);this.formSubmitController=new v(this);this.hasSlotController=new f(this,"help-text","label");this.hasFocus=!1;this.hasTooltip=!1;this.name="";this.value=0;this.label="";this.helpText="";this.disabled=!1;this.invalid=!1;this.min=0;this.max=100;this.step=1;this.tooltip="top";this.tooltipFormatter=i=>i.toString()}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.syncRange()),this.value||(this.value=this.min),this.value<this.min&&(this.value=this.min),this.value>this.max&&(this.value=this.max),this.updateComplete.then(()=>{this.syncRange(),this.resizeObserver.observe(this.input)})}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this.input)}focus(i){this.input.focus(i)}blur(){this.input.blur()}setCustomValidity(i){this.input.setCustomValidity(i),this.invalid=!this.input.checkValidity()}handleInput(){this.value=parseFloat(this.input.value),r(this,"sl-change"),this.syncRange()}handleBlur(){this.hasFocus=!1,this.hasTooltip=!1,r(this,"sl-blur")}handleValueChange(){this.invalid=!this.input.checkValidity(),this.input.value=this.value.toString(),this.value=parseFloat(this.input.value),this.syncRange()}handleDisabledChange(){this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity()}handleFocus(){this.hasFocus=!0,this.hasTooltip=!0,r(this,"sl-focus")}handleThumbDragStart(){this.hasTooltip=!0}handleThumbDragEnd(){this.hasTooltip=!1}syncRange(){let i=Math.max(0,(this.value-this.min)/(this.max-this.min));this.syncProgress(i),this.tooltip!=="none"&&this.syncTooltip(i)}syncProgress(i){this.input.style.background=`linear-gradient(to right, var(--track-color-active) 0%, var(--track-color-active) ${i*100}%, var(--track-color-inactive) ${i*100}%, var(--track-color-inactive) 100%)`}syncTooltip(i){if(this.output!==null){let h=this.input.offsetWidth,a=this.output.offsetWidth,o=getComputedStyle(this.input).getPropertyValue("--thumb-size"),x=`calc(${h*i}px - calc(calc(${i} * ${o}) - calc(${o} / 2)))`;this.output.style.transform=`translateX(${x})`,this.output.style.marginLeft=`-${a/2}px`}}render(){let i=this.hasSlotController.test("label"),h=this.hasSlotController.test("help-text"),a=this.label?!0:!!i,o=this.helpText?!0:!!h;return n`
      <div
        part="form-control"
        class=${c({"form-control":!0,"form-control--medium":!0,"form-control--has-label":a,"form-control--has-help-text":o})}
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
            class=${c({range:!0,"range--disabled":this.disabled,"range--focused":this.hasFocus,"range--tooltip-visible":this.hasTooltip,"range--tooltip-top":this.tooltip==="top","range--tooltip-bottom":this.tooltip==="bottom"})}
            @mousedown=${this.handleThumbDragStart}
            @mouseup=${this.handleThumbDragEnd}
            @touchstart=${this.handleThumbDragStart}
            @touchend=${this.handleThumbDragEnd}
          >
            <input
              part="input"
              id="input"
              type="range"
              class="range__control"
              name=${l(this.name)}
              ?disabled=${this.disabled}
              min=${l(this.min)}
              max=${l(this.max)}
              step=${l(this.step)}
              .value=${y(this.value.toString())}
              aria-describedby="help-text"
              @input=${this.handleInput}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur}
            />
            ${this.tooltip!=="none"&&!this.disabled?n`
                  <output part="tooltip" class="range__tooltip">
                    ${typeof this.tooltipFormatter=="function"?this.tooltipFormatter(this.value):this.value}
                  </output>
                `:""}
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
    `}};t.styles=$,e([p(".range__control")],t.prototype,"input",2),e([p(".range__tooltip")],t.prototype,"output",2),e([u()],t.prototype,"hasFocus",2),e([u()],t.prototype,"hasTooltip",2),e([s()],t.prototype,"name",2),e([s({type:Number})],t.prototype,"value",2),e([s()],t.prototype,"label",2),e([s({attribute:"help-text"})],t.prototype,"helpText",2),e([s({type:Boolean,reflect:!0})],t.prototype,"disabled",2),e([s({type:Boolean,reflect:!0})],t.prototype,"invalid",2),e([s({type:Number})],t.prototype,"min",2),e([s({type:Number})],t.prototype,"max",2),e([s({type:Number})],t.prototype,"step",2),e([s()],t.prototype,"tooltip",2),e([s({attribute:!1})],t.prototype,"tooltipFormatter",2),e([m("value",{waitUntilFirstUpdate:!0})],t.prototype,"handleValueChange",1),e([m("disabled",{waitUntilFirstUpdate:!0})],t.prototype,"handleDisabledChange",1),t=e([b("sl-range")],t);export{t as a};
