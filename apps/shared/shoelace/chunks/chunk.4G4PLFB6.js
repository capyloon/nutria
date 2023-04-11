import{a as v}from"./chunk.NG5YVWKB.js";import{a as C}from"./chunk.YY5A5RUI.js";import{a as m,c as f}from"./chunk.UJEHPUK2.js";import{a as h,d as c,e as p}from"./chunk.HFPOGNHG.js";import{a as o}from"./chunk.RUACWBWF.js";import{b as y}from"./chunk.7DJRGBBM.js";import{a as s}from"./chunk.AR2QSYXF.js";import{a as g,b as l,c as r,e as n,g as x}from"./chunk.IKUI3UUK.js";import{c as d}from"./chunk.SYBSOZNG.js";import{e as t}from"./chunk.I4CX4JT3.js";function u(_,b,i){return _?b():i==null?void 0:i()}var e=class extends x{constructor(){super(...arguments);this.localize=new y(this);this.indeterminate=!1;this.isLeaf=!1;this.loading=!1;this.selectable=!1;this.expanded=!1;this.selected=!1;this.disabled=!1;this.lazy=!1}static isTreeItem(i){return i instanceof Element&&i.getAttribute("role")==="treeitem"}connectedCallback(){super.connectedCallback(),this.setAttribute("role","treeitem"),this.setAttribute("tabindex","-1"),this.isNestedItem()&&(this.slot="children")}firstUpdated(){this.childrenContainer.hidden=!this.expanded,this.childrenContainer.style.height=this.expanded?"auto":"0",this.isLeaf=!this.lazy&&this.getChildrenItems().length===0,this.handleExpandedChange()}async animateCollapse(){this.emit("sl-collapse"),await c(this.childrenContainer);let{keyframes:i,options:a}=f(this,"tree-item.collapse",{dir:this.localize.dir()});await h(this.childrenContainer,p(i,this.childrenContainer.scrollHeight),a),this.childrenContainer.hidden=!0,this.emit("sl-after-collapse")}isNestedItem(){let i=this.parentElement;return!!i&&e.isTreeItem(i)}handleChildrenSlotChange(){this.loading=!1,this.isLeaf=!this.lazy&&this.getChildrenItems().length===0}willUpdate(i){i.has("selected")&&!i.has("indeterminate")&&(this.indeterminate=!1)}async animateExpand(){this.emit("sl-expand"),await c(this.childrenContainer),this.childrenContainer.hidden=!1;let{keyframes:i,options:a}=f(this,"tree-item.expand",{dir:this.localize.dir()});await h(this.childrenContainer,p(i,this.childrenContainer.scrollHeight),a),this.childrenContainer.style.height="auto",this.emit("sl-after-expand")}handleLoadingChange(){this.setAttribute("aria-busy",this.loading?"true":"false"),this.loading||this.animateExpand()}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleSelectedChange(){this.setAttribute("aria-selected",this.selected?"true":"false")}handleExpandedChange(){this.isLeaf?this.removeAttribute("aria-expanded"):this.setAttribute("aria-expanded",this.expanded?"true":"false")}handleExpandAnimation(){this.expanded?this.lazy?(this.loading=!0,this.emit("sl-lazy-load")):this.animateExpand():this.animateCollapse()}handleLazyChange(){this.emit("sl-lazy-change"),this.lazy||(this.loading=!1)}getChildrenItems({includeDisabled:i=!0}={}){return this.childrenSlot?[...this.childrenSlot.assignedElements({flatten:!0})].filter(a=>e.isTreeItem(a)&&(i||!a.disabled)):[]}render(){let i=this.localize.dir()==="rtl",a=!this.loading&&(!this.isLeaf||this.lazy);return d`
      <div
        part="base"
        class="${o({"tree-item":!0,"tree-item--expanded":this.expanded,"tree-item--selected":this.selected,"tree-item--disabled":this.disabled,"tree-item--leaf":this.isLeaf,"tree-item--has-expand-button":a,"tree-item--rtl":this.localize.dir()==="rtl"})}"
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
            part="expand-button"
            class=${o({"tree-item__expand-button":!0,"tree-item__expand-button--visible":a})}
            aria-hidden="true"
          >
            ${u(this.loading,()=>d` <sl-spinner></sl-spinner> `)}
            <slot class="tree-item__expand-icon-slot" name="expand-icon">
              <sl-icon library="system" name=${i?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
            <slot class="tree-item__expand-icon-slot" name="collapse-icon">
              <sl-icon library="system" name=${i?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
          </div>

          ${u(this.selectable,()=>d`
                <sl-checkbox
                  tabindex="-1"
                  class="tree-item__checkbox"
                  ?disabled="${this.disabled}"
                  ?checked="${C(this.selected)}"
                  ?indeterminate="${this.indeterminate}"
                ></sl-checkbox>
              `)}

          <slot class="tree-item__label" part="label"></slot>
        </div>

        <slot
          name="children"
          class="tree-item__children"
          part="children"
          role="group"
          @slotchange="${this.handleChildrenSlotChange}"
        ></slot>
      </div>
    `}};e.styles=v,t([r()],e.prototype,"indeterminate",2),t([r()],e.prototype,"isLeaf",2),t([r()],e.prototype,"loading",2),t([r()],e.prototype,"selectable",2),t([l({type:Boolean,reflect:!0})],e.prototype,"expanded",2),t([l({type:Boolean,reflect:!0})],e.prototype,"selected",2),t([l({type:Boolean,reflect:!0})],e.prototype,"disabled",2),t([l({type:Boolean,reflect:!0})],e.prototype,"lazy",2),t([n("slot:not([name])")],e.prototype,"defaultSlot",2),t([n("slot[name=children]")],e.prototype,"childrenSlot",2),t([n(".tree-item__item")],e.prototype,"itemElement",2),t([n(".tree-item__children")],e.prototype,"childrenContainer",2),t([n(".tree-item__expand-button slot")],e.prototype,"expandButtonSlot",2),t([s("loading",{waitUntilFirstUpdate:!0})],e.prototype,"handleLoadingChange",1),t([s("disabled")],e.prototype,"handleDisabledChange",1),t([s("selected")],e.prototype,"handleSelectedChange",1),t([s("expanded",{waitUntilFirstUpdate:!0})],e.prototype,"handleExpandedChange",1),t([s("expanded",{waitUntilFirstUpdate:!0})],e.prototype,"handleExpandAnimation",1),t([s("lazy",{waitUntilFirstUpdate:!0})],e.prototype,"handleLazyChange",1),e=t([g("sl-tree-item")],e);m("tree-item.expand",{keyframes:[{height:"0",opacity:"0",overflow:"hidden"},{height:"auto",opacity:"1",overflow:"hidden"}],options:{duration:250,easing:"cubic-bezier(0.4, 0.0, 0.2, 1)"}});m("tree-item.collapse",{keyframes:[{height:"auto",opacity:"1",overflow:"hidden"},{height:"0",opacity:"0",overflow:"hidden"}],options:{duration:200,easing:"cubic-bezier(0.4, 0.0, 0.2, 1)"}});export{e as a};
/*! Bundled license information:

lit-html/directives/when.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
