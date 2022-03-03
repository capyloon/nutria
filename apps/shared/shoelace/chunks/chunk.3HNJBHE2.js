import {
  select_styles_default
} from "./chunk.24E5KUVH.js";
import {
  autoIncrement
} from "./chunk.KFR7NC2M.js";
import {
  FormSubmitController,
  getLabelledBy,
  renderFormControl
} from "./chunk.IN6TNXRK.js";
import {
  HasSlotController,
  getTextContent
} from "./chunk.HQSLB26P.js";
import {
  o
} from "./chunk.7BXY5XRG.js";
import {
  l
} from "./chunk.R37SUKY2.js";
import {
  watch
} from "./chunk.PQ5VRVXF.js";
import {
  emit
} from "./chunk.CDTZZV7W.js";
import {
  e,
  i,
  n,
  t
} from "./chunk.72DLNKYZ.js";
import {
  $,
  s
} from "./chunk.PEQICPKO.js";
import {
  __decorateClass
} from "./chunk.ICGTMF5Z.js";

// src/components/select/select.ts
var SlSelect = class extends s {
  constructor() {
    super(...arguments);
    this.formSubmitController = new FormSubmitController(this);
    this.hasSlotController = new HasSlotController(this, "help-text", "label");
    this.attrId = autoIncrement();
    this.inputId = `select-${this.attrId}`;
    this.helpTextId = `select-help-text-${this.attrId}`;
    this.labelId = `select-label-${this.attrId}`;
    this.menuId = `select-menu-${this.attrId}`;
    this.hasFocus = false;
    this.isOpen = false;
    this.displayLabel = "";
    this.displayTags = [];
    this.multiple = false;
    this.maxTagsVisible = 3;
    this.disabled = false;
    this.name = "";
    this.placeholder = "";
    this.size = "medium";
    this.hoist = false;
    this.value = "";
    this.filled = false;
    this.pill = false;
    this.label = "";
    this.placement = "bottom";
    this.helpText = "";
    this.required = false;
    this.clearable = false;
    this.invalid = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.handleMenuSlotChange = this.handleMenuSlotChange.bind(this);
    this.resizeObserver = new ResizeObserver(() => this.resizeMenu());
    this.updateComplete.then(() => {
      this.resizeObserver.observe(this);
      this.syncItemsFromValue();
    });
  }
  firstUpdated() {
    this.invalid = !this.input.checkValidity();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.unobserve(this);
  }
  reportValidity() {
    return this.input.reportValidity();
  }
  setCustomValidity(message) {
    this.input.setCustomValidity(message);
    this.invalid = !this.input.checkValidity();
  }
  getItemLabel(item) {
    const slot = item.shadowRoot.querySelector("slot:not([name])");
    return getTextContent(slot);
  }
  getItems() {
    return [...this.querySelectorAll("sl-menu-item")];
  }
  getValueAsArray() {
    if (this.multiple && this.value === "") {
      return [];
    }
    return Array.isArray(this.value) ? this.value : [this.value];
  }
  focus(options) {
    this.control.focus(options);
  }
  blur() {
    this.control.blur();
  }
  handleBlur() {
    if (!this.isOpen) {
      this.hasFocus = false;
      emit(this, "sl-blur");
    }
  }
  handleClearClick(event) {
    event.stopPropagation();
    this.value = this.multiple ? [] : "";
    emit(this, "sl-clear");
    this.syncItemsFromValue();
  }
  handleDisabledChange() {
    if (this.disabled && this.isOpen) {
      this.dropdown.hide();
    }
    this.input.disabled = this.disabled;
    this.invalid = !this.input.checkValidity();
  }
  handleFocus() {
    if (!this.hasFocus) {
      this.hasFocus = true;
      emit(this, "sl-focus");
    }
  }
  handleKeyDown(event) {
    const target = event.target;
    const items = this.getItems();
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    if (target.tagName.toLowerCase() === "sl-tag") {
      return;
    }
    if (event.key === "Tab") {
      if (this.isOpen) {
        this.dropdown.hide();
      }
      return;
    }
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      if (!this.isOpen) {
        this.dropdown.show();
      }
      if (event.key === "ArrowDown") {
        this.menu.setCurrentItem(firstItem);
        firstItem.focus();
        return;
      }
      if (event.key === "ArrowUp") {
        this.menu.setCurrentItem(lastItem);
        lastItem.focus();
        return;
      }
    }
    if (event.ctrlKey || event.metaKey) {
      return;
    }
    if (!this.isOpen && event.key.length === 1) {
      event.stopPropagation();
      event.preventDefault();
      this.dropdown.show();
      this.menu.typeToSelect(event);
    }
  }
  handleLabelClick() {
    this.focus();
  }
  handleMenuSelect(event) {
    const item = event.detail.item;
    if (this.multiple) {
      this.value = this.value.includes(item.value) ? this.value.filter((v) => v !== item.value) : [...this.value, item.value];
    } else {
      this.value = item.value;
    }
    this.syncItemsFromValue();
  }
  handleMenuShow() {
    this.resizeMenu();
    this.isOpen = true;
  }
  handleMenuHide() {
    this.isOpen = false;
    this.control.focus();
  }
  handleMultipleChange() {
    var _a;
    const value = this.getValueAsArray();
    this.value = this.multiple ? value : (_a = value[0]) != null ? _a : "";
    this.syncItemsFromValue();
  }
  async handleMenuSlotChange() {
    const items = this.getItems();
    const values = [];
    items.forEach((item) => {
      if (values.includes(item.value)) {
        console.error(`Duplicate value found in <sl-select> menu item: '${item.value}'`, item);
      }
      values.push(item.value);
    });
    await Promise.all(items.map((item) => item.render)).then(() => this.syncItemsFromValue());
  }
  handleTagInteraction(event) {
    const path = event.composedPath();
    const clearButton = path.find((el) => {
      if (el instanceof HTMLElement) {
        const element = el;
        return element.classList.contains("tag__remove");
      }
      return false;
    });
    if (clearButton) {
      event.stopPropagation();
    }
  }
  async handleValueChange() {
    this.syncItemsFromValue();
    await this.updateComplete;
    this.invalid = !this.input.checkValidity();
    emit(this, "sl-change");
  }
  resizeMenu() {
    this.menu.style.width = `${this.control.clientWidth}px`;
    this.dropdown.reposition();
  }
  syncItemsFromValue() {
    const items = this.getItems();
    const value = this.getValueAsArray();
    items.map((item) => item.checked = value.includes(item.value));
    if (this.multiple) {
      const checkedItems = items.filter((item) => value.includes(item.value));
      this.displayLabel = checkedItems.length > 0 ? this.getItemLabel(checkedItems[0]) : "";
      this.displayTags = checkedItems.map((item) => {
        return $`
          <sl-tag
            part="tag"
            exportparts="base:tag-base, content:tag-content, remove-button:tag-remove-button"
            variant="neutral"
            size=${this.size}
            ?pill=${this.pill}
            removable
            @click=${this.handleTagInteraction}
            @keydown=${this.handleTagInteraction}
            @sl-remove=${(event) => {
          event.stopPropagation();
          if (!this.disabled) {
            item.checked = false;
            this.syncValueFromItems();
          }
        }}
          >
            ${this.getItemLabel(item)}
          </sl-tag>
        `;
      });
      if (this.maxTagsVisible > 0 && this.displayTags.length > this.maxTagsVisible) {
        const total = this.displayTags.length;
        this.displayLabel = "";
        this.displayTags = this.displayTags.slice(0, this.maxTagsVisible);
        this.displayTags.push($`
          <sl-tag exportparts="base:tag" variant="neutral" size=${this.size}> +${total - this.maxTagsVisible} </sl-tag>
        `);
      }
    } else {
      const checkedItem = items.find((item) => item.value === value[0]);
      this.displayLabel = checkedItem ? this.getItemLabel(checkedItem) : "";
      this.displayTags = [];
    }
  }
  syncValueFromItems() {
    const items = this.getItems();
    const checkedItems = items.filter((item) => item.checked);
    const checkedValues = checkedItems.map((item) => item.value);
    if (this.multiple) {
      this.value = this.value.filter((val) => checkedValues.includes(val));
    } else {
      this.value = checkedValues.length > 0 ? checkedValues[0] : "";
    }
  }
  render() {
    const hasLabelSlot = this.hasSlotController.test("label");
    const hasHelpTextSlot = this.hasSlotController.test("help-text");
    const hasSelection = this.multiple ? this.value.length > 0 : this.value !== "";
    return renderFormControl({
      inputId: this.inputId,
      label: this.label,
      labelId: this.labelId,
      hasLabelSlot,
      helpTextId: this.helpTextId,
      helpText: this.helpText,
      hasHelpTextSlot,
      size: this.size,
      onLabelClick: () => this.handleLabelClick()
    }, $`
        <sl-dropdown
          part="base"
          .hoist=${this.hoist}
          .placement=${this.placement}
          .stayOpenOnSelect=${this.multiple}
          .containingElement=${this}
          ?disabled=${this.disabled}
          class=${o({
      select: true,
      "select--open": this.isOpen,
      "select--empty": this.value.length === 0,
      "select--focused": this.hasFocus,
      "select--clearable": this.clearable,
      "select--disabled": this.disabled,
      "select--multiple": this.multiple,
      "select--standard": !this.filled,
      "select--filled": this.filled,
      "select--has-tags": this.multiple && this.displayTags.length > 0,
      "select--placeholder-visible": this.displayLabel === "",
      "select--small": this.size === "small",
      "select--medium": this.size === "medium",
      "select--large": this.size === "large",
      "select--pill": this.pill,
      "select--invalid": this.invalid
    })}
          @sl-show=${this.handleMenuShow}
          @sl-hide=${this.handleMenuHide}
        >
          <div
            part="control"
            slot="trigger"
            id=${this.inputId}
            class="select__control"
            role="combobox"
            aria-labelledby=${l(getLabelledBy({
      label: this.label,
      labelId: this.labelId,
      hasLabelSlot,
      helpText: this.helpText,
      helpTextId: this.helpTextId,
      hasHelpTextSlot
    }))}
            aria-haspopup="true"
            aria-expanded=${this.isOpen ? "true" : "false"}
            aria-controls=${this.menuId}
            tabindex=${this.disabled ? "-1" : "0"}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
            @keydown=${this.handleKeyDown}
          >
            <span part="prefix" class="select__prefix">
              <slot name="prefix"></slot>
            </span>

            <div part="display-label" class="select__label">
              ${this.displayTags.length > 0 ? $` <span part="tags" class="select__tags"> ${this.displayTags} </span> ` : this.displayLabel.length > 0 ? this.displayLabel : this.placeholder}
            </div>

            ${this.clearable && hasSelection ? $`
                  <button part="clear-button" class="select__clear" @click=${this.handleClearClick} tabindex="-1">
                    <slot name="clear-icon">
                      <sl-icon name="x-circle-fill" library="system"></sl-icon>
                    </slot>
                  </button>
                ` : ""}

            <span part="suffix" class="select__suffix">
              <slot name="suffix"></slot>
            </span>

            <span part="icon" class="select__icon" aria-hidden="true">
              <sl-icon name="chevron-down" library="system"></sl-icon>
            </span>

            <!-- The hidden input tricks the browser's built-in validation so it works as expected. We use an input
            instead of a select because, otherwise, iOS will show a list of options during validation. -->
            <input
              class="select__hidden-select"
              aria-hidden="true"
              ?required=${this.required}
              .value=${hasSelection ? "1" : ""}
              tabindex="-1"
            />
          </div>

          <sl-menu part="menu" class="select__menu" @sl-select=${this.handleMenuSelect} id=${this.menuId}>
            <slot @slotchange=${this.handleMenuSlotChange}></slot>
          </sl-menu>
        </sl-dropdown>
      `);
  }
};
SlSelect.styles = select_styles_default;
__decorateClass([
  i(".select")
], SlSelect.prototype, "dropdown", 2);
__decorateClass([
  i(".select__control")
], SlSelect.prototype, "control", 2);
__decorateClass([
  i(".select__hidden-select")
], SlSelect.prototype, "input", 2);
__decorateClass([
  i(".select__menu")
], SlSelect.prototype, "menu", 2);
__decorateClass([
  t()
], SlSelect.prototype, "hasFocus", 2);
__decorateClass([
  t()
], SlSelect.prototype, "isOpen", 2);
__decorateClass([
  t()
], SlSelect.prototype, "displayLabel", 2);
__decorateClass([
  t()
], SlSelect.prototype, "displayTags", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSelect.prototype, "multiple", 2);
__decorateClass([
  e({ attribute: "max-tags-visible", type: Number })
], SlSelect.prototype, "maxTagsVisible", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSelect.prototype, "disabled", 2);
__decorateClass([
  e()
], SlSelect.prototype, "name", 2);
__decorateClass([
  e()
], SlSelect.prototype, "placeholder", 2);
__decorateClass([
  e()
], SlSelect.prototype, "size", 2);
__decorateClass([
  e({ type: Boolean })
], SlSelect.prototype, "hoist", 2);
__decorateClass([
  e()
], SlSelect.prototype, "value", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSelect.prototype, "filled", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSelect.prototype, "pill", 2);
__decorateClass([
  e()
], SlSelect.prototype, "label", 2);
__decorateClass([
  e()
], SlSelect.prototype, "placement", 2);
__decorateClass([
  e({ attribute: "help-text" })
], SlSelect.prototype, "helpText", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSelect.prototype, "required", 2);
__decorateClass([
  e({ type: Boolean })
], SlSelect.prototype, "clearable", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlSelect.prototype, "invalid", 2);
__decorateClass([
  watch("disabled", { waitUntilFirstUpdate: true })
], SlSelect.prototype, "handleDisabledChange", 1);
__decorateClass([
  watch("multiple")
], SlSelect.prototype, "handleMultipleChange", 1);
__decorateClass([
  watch("value", { waitUntilFirstUpdate: true })
], SlSelect.prototype, "handleValueChange", 1);
SlSelect = __decorateClass([
  n("sl-select")
], SlSelect);

export {
  SlSelect
};
