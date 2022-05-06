import {
  menu_styles_default
} from "./chunk.R2YZVUVK.js";
import {
  getTextContent
} from "./chunk.3IYPB6RR.js";
import {
  hasFocusVisible
} from "./chunk.3BZY22MT.js";
import {
  emit
} from "./chunk.CDTZZV7W.js";
import {
  i,
  n
} from "./chunk.72DLNKYZ.js";
import {
  $,
  s
} from "./chunk.PEQICPKO.js";
import {
  __decorateClass
} from "./chunk.ICGTMF5Z.js";

// src/components/menu/menu.ts
var SlMenu = class extends s {
  constructor() {
    super(...arguments);
    this.typeToSelectString = "";
  }
  firstUpdated() {
    this.setAttribute("role", "menu");
  }
  getAllItems(options = { includeDisabled: true }) {
    return [...this.defaultSlot.assignedElements({ flatten: true })].filter((el) => {
      if (el.getAttribute("role") !== "menuitem") {
        return false;
      }
      if (!options.includeDisabled && el.disabled) {
        return false;
      }
      return true;
    });
  }
  getCurrentItem() {
    return this.getAllItems({ includeDisabled: false }).find((i2) => i2.getAttribute("tabindex") === "0");
  }
  setCurrentItem(item) {
    const items = this.getAllItems({ includeDisabled: false });
    const activeItem = item.disabled ? items[0] : item;
    items.forEach((i2) => {
      i2.setAttribute("tabindex", i2 === activeItem ? "0" : "-1");
    });
  }
  typeToSelect(event) {
    var _a;
    const items = this.getAllItems({ includeDisabled: false });
    clearTimeout(this.typeToSelectTimeout);
    this.typeToSelectTimeout = window.setTimeout(() => this.typeToSelectString = "", 1e3);
    if (event.key === "Backspace") {
      if (event.metaKey || event.ctrlKey) {
        this.typeToSelectString = "";
      } else {
        this.typeToSelectString = this.typeToSelectString.slice(0, -1);
      }
    } else {
      this.typeToSelectString += event.key.toLowerCase();
    }
    if (!hasFocusVisible) {
      items.forEach((item) => item.classList.remove("sl-focus-invisible"));
    }
    for (const item of items) {
      const slot = (_a = item.shadowRoot) == null ? void 0 : _a.querySelector("slot:not([name])");
      const label = getTextContent(slot).toLowerCase().trim();
      if (label.startsWith(this.typeToSelectString)) {
        this.setCurrentItem(item);
        item.focus();
        break;
      }
    }
  }
  handleClick(event) {
    const target = event.target;
    const item = target.closest("sl-menu-item");
    if ((item == null ? void 0 : item.disabled) === false) {
      emit(this, "sl-select", { detail: { item } });
    }
  }
  handleKeyUp() {
    if (!hasFocusVisible) {
      const items = this.getAllItems();
      items.forEach((item) => {
        item.classList.remove("sl-focus-invisible");
      });
    }
  }
  handleKeyDown(event) {
    if (event.key === "Enter") {
      const item = this.getCurrentItem();
      event.preventDefault();
      item == null ? void 0 : item.click();
    }
    if (event.key === " ") {
      event.preventDefault();
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      const items = this.getAllItems({ includeDisabled: false });
      const activeItem = this.getCurrentItem();
      let index = activeItem ? items.indexOf(activeItem) : 0;
      if (items.length > 0) {
        event.preventDefault();
        if (event.key === "ArrowDown") {
          index++;
        } else if (event.key === "ArrowUp") {
          index--;
        } else if (event.key === "Home") {
          index = 0;
        } else if (event.key === "End") {
          index = items.length - 1;
        }
        if (index < 0) {
          index = items.length - 1;
        }
        if (index > items.length - 1) {
          index = 0;
        }
        this.setCurrentItem(items[index]);
        items[index].focus();
        return;
      }
    }
    this.typeToSelect(event);
  }
  handleMouseDown(event) {
    const target = event.target;
    if (target.getAttribute("role") === "menuitem") {
      this.setCurrentItem(target);
      if (!hasFocusVisible) {
        target.classList.add("sl-focus-invisible");
      }
    }
  }
  handleSlotChange() {
    const items = this.getAllItems({ includeDisabled: false });
    if (items.length > 0) {
      this.setCurrentItem(items[0]);
    }
  }
  render() {
    return $`
      <div
        part="base"
        class="menu"
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @keyup=${this.handleKeyUp}
        @mousedown=${this.handleMouseDown}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }
};
SlMenu.styles = menu_styles_default;
__decorateClass([
  i(".menu")
], SlMenu.prototype, "menu", 2);
__decorateClass([
  i("slot")
], SlMenu.prototype, "defaultSlot", 2);
SlMenu = __decorateClass([
  n("sl-menu")
], SlMenu);

export {
  SlMenu
};
