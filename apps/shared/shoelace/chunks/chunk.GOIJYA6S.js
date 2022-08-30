import{a as w}from"./chunk.OGTNNAMV.js";import{a as _}from"./chunk.IGBRI7DM.js";import{a as m,c as f,d as u}from"./chunk.LXSZTUPS.js";import{a as b,c as g}from"./chunk.SWQG23VR.js";import{c as C}from"./chunk.ISLNSUAB.js";import{a as p}from"./chunk.LSNASYMO.js";import{a as l}from"./chunk.DBCWAMJH.js";import{a as s}from"./chunk.JUX3LFDW.js";import{a as x,b as d,c as o,d as h,f as v}from"./chunk.X7Q42RGY.js";import{c as n}from"./chunk.3G4FHXSN.js";import{g as t}from"./chunk.OAQCUA7X.js";function c(r,y,i){return r?y():i==null?void 0:i()}function E(r){return r&&r.getAttribute("role")==="treeitem"}var e=class extends v{constructor(){super(...arguments);this.localize=new C(this);this.indeterminate=!1;this.isLeaf=!1;this.loading=!1;this.selectable=!1;this.expanded=!1;this.selected=!1;this.disabled=!1;this.lazy=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","treeitem"),this.setAttribute("tabindex","-1"),this.isNestedItem()&&(this.slot="children")}firstUpdated(){this.childrenContainer.hidden=!this.expanded,this.childrenContainer.style.height=this.expanded?"auto":"0",this.isLeaf=this.getChildrenItems().length===0,this.handleExpandedChange()}handleLoadingChange(){this.setAttribute("aria-busy",this.loading?"true":"false"),this.loading||this.animateExpand()}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleSelectedChange(){this.setAttribute("aria-selected",this.selected?"true":"false")}handleExpandedChange(){this.isLeaf?this.removeAttribute("aria-expanded"):this.setAttribute("aria-expanded",this.expanded?"true":"false")}handleExpandAnimation(){this.expanded?this.lazy?(this.loading=!0,s(this,"sl-lazy-load")):this.animateExpand():this.animateCollapse()}handleLazyChange(){s(this,"sl-lazy-change")}async animateExpand(){s(this,"sl-expand"),await f(this.childrenContainer),this.childrenContainer.hidden=!1;let{keyframes:i,options:a}=g(this,"tree-item.expand",{dir:this.localize.dir()});await m(this.childrenContainer,u(i,this.childrenContainer.scrollHeight),a),this.childrenContainer.style.height="auto",s(this,"sl-after-expand")}async animateCollapse(){s(this,"sl-collapse"),await f(this.childrenContainer);let{keyframes:i,options:a}=g(this,"tree-item.collapse",{dir:this.localize.dir()});await m(this.childrenContainer,u(i,this.childrenContainer.scrollHeight),a),this.childrenContainer.hidden=!0,s(this,"sl-after-collapse")}getChildrenItems({includeDisabled:i=!0}={}){return this.childrenSlot?[...this.childrenSlot.assignedElements({flatten:!0})].filter(a=>E(a)&&(i||!a.disabled)):[]}isNestedItem(){let i=this.parentElement;return!!i&&E(i)}handleChildrenSlotChange(){this.loading=!1,this.isLeaf=this.getChildrenItems().length===0}willUpdate(i){i.has("selected")&&!i.has("indeterminate")&&(this.indeterminate=!1)}render(){let i=this.localize.dir()==="rtl",a=!this.loading&&(!this.isLeaf||this.lazy);return n`
      <div
        part="base"
        class="${p({"tree-item":!0,"tree-item--selected":this.selected,"tree-item--disabled":this.disabled,"tree-item--leaf":this.isLeaf,"tree-item--rtl":this.localize.dir()==="rtl"})}"
      >
        <div
          class="tree-item__item"
          part="
            item
            ${this.disabled?"item--disabled":""}
            ${this.expanded?"item--expanded":""}
            ${this.indeterminate?"item--indeterminate":""}
            ${this.selected?"item--selected":""}
          "
        >
          <div class="tree-item__indentation" part="indentation"></div>

          <div
            class=${p({"tree-item__expand-button":!0,"tree-item__expand-button--visible":a})}
            aria-hidden="true"
          >
            ${c(this.loading,()=>n` <sl-spinner></sl-spinner> `)}
            ${c(a,()=>n`
                <slot name="${this.expanded?"collapse-icon":"expand-icon"}">
                  <sl-icon
                    class="tree-item__default-toggle-button"
                    library="system"
                    name=${i?"chevron-left":"chevron-right"}
                  ></sl-icon>
                </slot>
              `)}
          </div>

          ${c(this.selectable,()=>n`
                <sl-checkbox
                  tabindex="-1"
                  class="tree-item__checkbox"
                  ?disabled="${this.disabled}"
                  ?checked="${_(this.selected)}"
                  ?indeterminate="${this.indeterminate}"
                >
                  <div class="tree-item__label" part="label">
                    <slot></slot>
                  </div>
                </sl-checkbox>
              `,()=>n`
              <div class="tree-item__label" part="label">
                <slot></slot>
              </div>
            `)}
        </div>

        <div class="tree-item__children" part="children" role="group">
          <slot name="children" @slotchange="${this.handleChildrenSlotChange}"></slot>
        </div>
      </div>
    `}};e.styles=w,t([o()],e.prototype,"indeterminate",2),t([o()],e.prototype,"isLeaf",2),t([o()],e.prototype,"loading",2),t([o()],e.prototype,"selectable",2),t([d({type:Boolean,reflect:!0})],e.prototype,"expanded",2),t([d({type:Boolean,reflect:!0})],e.prototype,"selected",2),t([d({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([d({type:Boolean,reflect:!0})],e.prototype,"lazy",2),t([h("slot:not([name])")],e.prototype,"defaultSlot",2),t([h("slot[name=children]")],e.prototype,"childrenSlot",2),t([h(".tree-item__item")],e.prototype,"itemElement",2),t([h(".tree-item__children")],e.prototype,"childrenContainer",2),t([l("loading",{waitUntilFirstUpdate:!0})],e.prototype,"handleLoadingChange",1),t([l("disabled")],e.prototype,"handleDisabledChange",1),t([l("selected")],e.prototype,"handleSelectedChange",1),t([l("expanded",{waitUntilFirstUpdate:!0})],e.prototype,"handleExpandedChange",1),t([l("expanded",{waitUntilFirstUpdate:!0})],e.prototype,"handleExpandAnimation",1),t([l("lazy",{waitUntilFirstUpdate:!0})],e.prototype,"handleLazyChange",1),e=t([x("sl-tree-item")],e);b("tree-item.expand",{keyframes:[{height:"0",opacity:"0",overflow:"hidden"},{height:"auto",opacity:"1",overflow:"hidden"}],options:{duration:250,easing:"cubic-bezier(0.4, 0.0, 0.2, 1)"}});b("tree-item.collapse",{keyframes:[{height:"auto",opacity:"1",overflow:"hidden"},{height:"0",opacity:"0",overflow:"hidden"}],options:{duration:200,easing:"cubic-bezier(0.4, 0.0, 0.2, 1)"}});export{E as a,e as b};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
