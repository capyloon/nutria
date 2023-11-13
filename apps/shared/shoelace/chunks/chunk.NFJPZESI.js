import {
  tab_styles_default
} from "./chunk.KRDDWTEW.js";
import {
  SlIconButton
} from "./chunk.B3SICWSY.js";
import {
  LocalizeController
} from "./chunk.NH3SRVOC.js";
import {
  e
} from "./chunk.DOYC4G7X.js";
import {
  watch
} from "./chunk.XAOA43RZ.js";
import {
  ShoelaceElement,
  e as e2,
  n
} from "./chunk.URBIOJXY.js";
import {
  x2 as x
} from "./chunk.27ILGUWR.js";
import {
  __decorateClass
} from "./chunk.YZETUBD6.js";

// src/components/tab/tab.component.ts
var id = 0;
var SlTab = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
    this.attrId = ++id;
    this.componentId = `sl-tab-${this.attrId}`;
    this.panel = "";
    this.active = false;
    this.closable = false;
    this.disabled = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "tab");
  }
  handleCloseClick(event) {
    event.stopPropagation();
    this.emit("sl-close");
  }
  handleActiveChange() {
    this.setAttribute("aria-selected", this.active ? "true" : "false");
  }
  handleDisabledChange() {
    this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
  }
  /** Sets focus to the tab. */
  focus(options) {
    this.tab.focus(options);
  }
  /** Removes focus from the tab. */
  blur() {
    this.tab.blur();
  }
  render() {
    this.id = this.id.length > 0 ? this.id : this.componentId;
    return x`
      <div
        part="base"
        class=${e({
      tab: true,
      "tab--active": this.active,
      "tab--closable": this.closable,
      "tab--disabled": this.disabled
    })}
        tabindex=${this.disabled ? "-1" : "0"}
      >
        <slot></slot>
        ${this.closable ? x`
              <sl-icon-button
                part="close-button"
                exportparts="base:close-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("close")}
                class="tab__close-button"
                @click=${this.handleCloseClick}
                tabindex="-1"
              ></sl-icon-button>
            ` : ""}
      </div>
    `;
  }
};
SlTab.styles = tab_styles_default;
SlTab.dependencies = { "sl-icon-button": SlIconButton };
__decorateClass([
  e2(".tab")
], SlTab.prototype, "tab", 2);
__decorateClass([
  n({ reflect: true })
], SlTab.prototype, "panel", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlTab.prototype, "active", 2);
__decorateClass([
  n({ type: Boolean })
], SlTab.prototype, "closable", 2);
__decorateClass([
  n({ type: Boolean, reflect: true })
], SlTab.prototype, "disabled", 2);
__decorateClass([
  watch("active")
], SlTab.prototype, "handleActiveChange", 1);
__decorateClass([
  watch("disabled")
], SlTab.prototype, "handleDisabledChange", 1);

export {
  SlTab
};
