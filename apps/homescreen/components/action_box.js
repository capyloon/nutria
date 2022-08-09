// <action-box> custom element, representing an item on the homescreen.

const kLongPressMinMs = 200;

class ActionBox extends HTMLElement {
  static get observedAttributes() {
    return ["position"];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <link rel="stylesheet" href="components/action_box.css">
      <slot></slot>
      <div class="ghost hidden"></div>
      <div class="menu hidden">
        <sl-icon name="trash-2" width="1.25em" height="1.25em"></sl-icon>
      </div>
    `;

    this.ghost = shadow.querySelector(".ghost");
    this.menu = shadow.querySelector(".menu");
    this.menu.onclick = this.menuClick.bind(this);

    // Prevent the contextmenu event from being dispatched.
    shadow.addEventListener(
      "contextmenu",
      (event) => {
        event.preventDefault();
      },
      true
    );

    shadow.addEventListener("pointerdown", this, true);
    shadow.addEventListener("click", this, true);
    this.cancelClick = false;

    this.attributeChangedCallback(
      "position",
      null,
      this.getAttribute("position") || "0,0"
    );
  }

  menuClick() {
    this.dispatchEvent(
      new CustomEvent("delete-action", { bubbles: true, detail: this.actionId })
    );
  }

  handleEvent(event) {
    if (event.type === "click") {
      if (this.cancelClick) {
        event.preventDefault();
      }
      this.cancelClick = false;
      return;
    } else if (event.type === "pointerdown") {
      this.shadowRoot.addEventListener("pointerup", this, { once: true });
      let startPos = { x: event.screenX, y: event.screenY };
      let capturedPointerId = event.pointerId;

      this.timer = window.setTimeout(() => {
        this.setPointerCapture(capturedPointerId);
        this.cancelClick = true;
        this.dispatchEvent(
          new CustomEvent("long-press", { bubbles: true, detail: startPos })
        );
      }, kLongPressMinMs);
    } else if (event.type === "pointerup") {
      window.clearTimeout(this.timer);
    } else {
      console.error(`<action-box> handled unexpected event: ${event.type}`);
    }
  }

  attributeChangedCallback(_name, _oldValue, newValue) {
    let [x, y] = newValue.split(",");
    this.x = x | 0;
    this.y = y | 0;
    this.style.left = `calc(${this.x} * var(--action-box-width))`;
    this.style.bottom = `calc(${this.y} * var(--action-box-height))`;
  }

  translateBy(deltaX, deltaY) {
    if (deltaX === 0 && deltaY === 0) {
      this.style.left = `calc(${this.x} * var(--action-box-width))`;
      this.style.bottom = `calc(${this.y} * var(--action-box-height))`;
    } else {
      this.style.left = `calc(${this.x} * var(--action-box-width) + ${deltaX}px)`;
      this.style.bottom = `calc(${this.y} * var(--action-box-height) - ${deltaY}px)`;
    }
  }

  animate(value) {
    try {
      let slot = this.shadowRoot.querySelector("slot").assignedNodes()[0];
      slot.animate(value);
    } catch (e) {
      console.error(`action_box::animate() error: ${e}`);
    }

    // Show or hide the context menu.
    if (value) {
      this.menu.classList.remove("hidden");
    } else {
      // Hide the menu after 2s
      window.setTimeout(() => {
        this.menu.classList.add("closing");
        this.menu.addEventListener(
          "transitionend",
          () => {
            this.menu.classList.remove("closing");
            this.menu.classList.add("hidden");
          },
          { once: true }
        );
      }, 2000);
    }
  }

  setGhostState(enabled) {
    if (enabled) {
      this.ghost.classList.remove("hidden");
    } else {
      this.ghost.classList.add("hidden");
    }
  }

  setGhostActive(enabled) {
    if (enabled) {
      this.ghost.classList.add("active");
    } else {
      this.ghost.classList.remove("active");
    }
  }
}

customElements.define("action-box", ActionBox);
