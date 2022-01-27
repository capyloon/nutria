export class InputMethod {
  log(msg) {
    if (!this.debug) {
      return;
    }
    console.log(`InputMethod ${this.logId}: ${msg}`);
    this.logId += 1;
  }

  constructor() {
    if (!embedder.useVirtualKeyboard) {
      return;
    }

    this.logId = 0;
    this.opened = false;
    this.debug = false;

    actionsDispatcher.addListener("ime-focus-changed", (_name, data) => {
      this.log(`ime-focus-changed ${JSON.stringify(data)}`);
      if (data.isFocus === true) {
        if (data.type === "SELECT") {
          // Delegate to the <select-ui> for this content frame.
          window.wm.showSelectUI(data);
          return;
        } else {
          this.open();
        }
      } else if (data.type !== "SELECT") {
        this.close();
      }
    });

    actionsDispatcher.addListener("lockscreen-unlocked", () => {
      // If the keyboard was opened when we locked the screen, show it again.
      if (this.opened) {
        this.inputMethod.activate();
        this.inputMethod.classList.remove("offscreen");
      }
    });

    actionsDispatcher.addListener("lockscreen-locked", () => {
      // If the keyboard was opened when we locked the screen, hide it and deactivate it.
      if (this.opened) {
        this.inputMethod.deactivate();
        this.inputMethod.classList.add("no-animation");
        this.inputMethod.classList.add("offscreen");
      }
    });
  }

  adjustState() {
    this.log(
      `adjustState opened=${this.opened} activated=${this.inputMethod.activated}`
    );
    if (this.opened !== this.inputMethod.activated) {
      this.opened ? this.inputMethod.activate() : this.inputMethod.deactivate();
    }
  }

  open() {
    try {
      if (!this.inputMethod) {
        this.inputMethod = document.querySelector("input-method");
      }

      this.log(`input_method::open`);

      this.opened = true;

      this.inputMethod.init();
      this.inputMethod.activate();

      const cancel = () => {
        this.log(`canceling open animation`);
        this.adjustState();
      };

      // Wait for the keyboard transition to be done before dispatching the
      // "keyboard-opening" action to prevent flashes of background.
      this.inputMethod.addEventListener(
        "transitionend",
        () => {
          this.log(`transitionend in open()`);
          if (this.opened) {
            this.log(`dispatching keyboard-opening`);
            actionsDispatcher.dispatch("keyboard-opening");
          }
          this.inputMethod.removeEventListener("transitioncancel", cancel);
        },
        { once: true }
      );

      this.inputMethod.addEventListener("transitioncancel", cancel, {
        once: true,
      });

      this.inputMethod.classList.remove("no-animation");
      this.inputMethod.classList.remove("offscreen");
    } catch (e) {
      this.log(`open expection ${e}`);
    }
  }

  close() {
    if (!this.opened || !this.inputMethod) {
      return;
    }

    this.log(`input_method::close`);

    this.opened = false;
    this.log(`dispatching keyboard-closing`);
    actionsDispatcher.dispatch("keyboard-closing");

    const cancel = () => {
      this.log(`canceling close animation`);
      this.adjustState();
    };

    this.inputMethod.addEventListener(
      "transitionend",
      () => {
        this.log(`transitionend in close()`);
        if (!this.opened) {
          this.inputMethod.deactivate();
        }
        this.inputMethod.removeEventListener("transitioncancel", cancel);
      },
      { once: true }
    );

    this.inputMethod.addEventListener("transitioncancel", cancel, {
      once: true,
    });

    this.inputMethod.classList.remove("no-animation");
    this.inputMethod.classList.add("offscreen");
  }
}
