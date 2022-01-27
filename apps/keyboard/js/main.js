class KeyboardLayout {
  constructor(root) {
    this.currentLayout = null;
    this.layouts = {};
    this.root = root;

    this.root.addEventListener("pointerdown", this, { passive: true });
    this.root.addEventListener("pointerup", this, { passive: true });
    this.root.addEventListener("contextmenu", this, { passive: true });
  }

  async loadLayout(name) {
    let module = await import(`../layouts/${name}.js`);
    this.layouts[name] = module.keyboardLayout;
    this.layouts[name]._name = name;
  }

  selectLayout(name) {
    if (this.layouts[name]) {
      this.currentLayout = this.layouts[name];
      this.switchToView("standard");
    } else {
      console.error(`Failed to select unavailable layout ${name}`);
    }
  }

  // Return the DOM for a named view as a DocumentFragment.
  buildView(name) {
    let view = this.currentLayout.views[name];
    if (!view) {
      console.error(
        `No '${name} view found in the '${this.currentLayout.description}' layout.`
      );
      return null;
    }

    let fragment = new DocumentFragment();

    view.forEach((line) => {
      let container = document.createElement("div");
      line.split(" ").forEach((keyName) => {
        let elem = document.createElement("span");
        elem.classList.add("keycap");

        // Create an outer container to avoid using a margin around keycap
        // since margins are not getting pointer events.
        let outer = document.createElement("span");
        outer.classList.add("outer");

        let text = keyName;
        let key = keyName;

        // Check if we should use an alternate text or icon from the "keys"
        // section of the layout definition.
        let customization = this.currentLayout.keys[keyName];
        if (customization && customization.display) {
          let display = customization.display;
          if (display.text) {
            text = display.text;
          } else if (display.icon) {
            text = null;
            let icon = document.createElement("lucide-icon");
            icon.setAttribute("kind", display.icon);
            elem.appendChild(icon);
          }

          if (display.style) {
            elem.classList.add(`style-${display.style}`);
          }

          if (display.size) {
            elem.classList.add(`size-${display.size}`);
            outer.classList.add(`size-${display.size}`);
          }

          if (display.key) {
            key = display.key;
          }
        }

        outer.setAttribute("data-key", key);
        outer.appendChild(elem);

        if (customization?.behavior) {
          outer.behavior = customization.behavior;
        }

        if (customization?.nobubble) {
          outer.nobubble = customization.nobubble;
        }

        if (text) {
          elem.textContent = text;
          if (text.length > 2) {
            elem.classList.add("reduce-font-size");
          }
        }

        if (keyName == "Space") {
          elem.textContent = this.currentLayout.description;
          elem.classList.add("layout-description");
        }

        container.appendChild(outer);
      });
      fragment.appendChild(container);
    });

    return fragment;
  }

  switchToView(viewName) {
    let dom = this.buildView(viewName);
    if (dom) {
      while (this.root.firstChild) {
        this.root.removeChild(this.root.firstChild);
      }
      this.root.appendChild(dom);
      this.currentView = viewName;
    }
  }

  processCommand(cmd) {
    if (cmd[0] === "switch-view") {
      this.switchToView(cmd[1]);
    } else if (cmd[0] === "switch-tempview") {
      this.nextView = this.currentView;
      this.switchToView(cmd[1]);
    } else if (cmd[0] === "next-layout") {
      let names = Object.keys(this.layouts);
      let pos = names.indexOf(this.currentLayout._name);
      if (pos == names.length - 1) {
        pos = 0;
      } else {
        pos += 1;
      }
      this.selectLayout(names[pos]);
    }
  }

  showKeyBubble(target, key) {
    let elem = document.createElement("div");
    elem.textContent = key;
    elem.classList.add("bubble");

    // target is the outer div, but we want to align the bubble with the div.keycap one.
    let rect = target.firstElementChild.getBoundingClientRect();
    elem.style.left = `${rect.left}px`;
    elem.style.top = `${rect.top - 60}px`;

    document.body.append(elem);

    window.setTimeout(() => {
      elem.remove();
    }, 200);
  }

  handleEvent(event) {
    // console.log(`Keyboard event is ${event.type}`);

    let target = event.target;
    let key = target.getAttribute("data-key");
    do {
      key = target.getAttribute("data-key");
      if (key) {
        break;
      }
      target = target.parentNode;
    } while (!key && target && target.getAttribute);

    if (!key) {
      console.error(`No key found for ${event.type}`);
      return;
    }

    if (event.type === "pointerdown") {
      navigator.vibrate(10);
      this.cancelPointerUp = false;
      if (!((target.behavior && target.behavior.press) || target.nobubble)) {
        this.showKeyBubble(target, key);
      }
    } else if (event.type === "pointerup") {
      if (this.cancelPointerUp) {
        return;
      }
      if (target.behavior && target.behavior.press) {
        this.processCommand(target.behavior.press.split(" "));
      } else {
        navigator.b2g.inputMethod.sendKey(key);

        // If we came to this view by a 'switch-tempview' command,
        // revert to the previous view.
        if (this.nextView) {
          this.switchToView(this.nextView);
          this.nextView = null;
        }
      }
    } else if (event.type === "contextmenu") {
      this.cancelPointerUp = true;
      if (target.behavior && target.behavior.longpress) {
        this.processCommand(target.behavior.longpress.split(" "));
      }
    }
  }
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    await depGraphLoaded;
    await getSharedDeps("shared-icons");

    let layout = new KeyboardLayout(document.getElementById("vkb"));

    const layouts = ["en-US", "fr-FR"];

    for (lang of layouts) {
      await layout.loadLayout(lang);
    }
    layout.selectLayout(layouts[0]);
  },
  { once: true }
);
