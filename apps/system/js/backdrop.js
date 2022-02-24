// Manages the lifecycle of the backdrop used for elements
// that are not always on screen.
//
// It maintains a set of on screen objects and will only
// disappear if all objects are off screen.
//
// Elements have the "offscreen" class set when off screen.

class Backdrop {
  constructor() {
    this.elems = {};

    // Initial state.
    window.backdrop.addEventListener("click", () => {
      this.hideAll();
    });

    actionsDispatcher.addListener("lockscreen-locked", () => {
      this.hideAll();
    });

    embedder.addSystemEventListener(
      "keyup",
      (event) => {
        if (this.open && event.key === "Escape") {
          this.hideAll(true);
        }
      },
      true
    );
  }

  get open() {
    return !window.backdrop.classList.contains("hidden");
  }

  hideAll(force = false) {
    for (let prop in this.elems) {
      if (force || this.elems[prop].autoclose) {
        this.elems[prop].elem.classList.add("offscreen");
        delete this.elems[prop];
      }
    }
    if (Object.keys(this.elems).length == 0) {
      window.backdrop.classList.add("hidden");
    }
  }

  show(selector, autoclose = false) {
    let backdrop = window.backdrop;
    let elem = backdrop.querySelector(selector);
    if (!elem) {
      console.error(`Backdrop::show: no child found for '${selector}'`);
      return;
    }

    // Add the selector to our tracked set.
    this.elems[selector] = { elem, autoclose };

    if (!this.open) {
      // For some reason, animations don't work if the we don't wait a bit after
      // removing `display: none` from the backdrop. So we wait a bit...
      // TODO: figure out a better way to do that.
      backdrop.classList.remove("hidden");
      window.setTimeout(() => {
        elem.classList.remove("offscreen");
      }, 50);
    } else {
      elem.classList.remove("offscreen");
    }
  }

  hide(selector) {
    if (this.elems[selector] === undefined) {
      console.error(`Backdrop::hide: no item found for '${selector}'`);
      return;
    }

    let backdrop = window.backdrop;

    // Set the element offscreen.
    this.elems[selector].elem.classList.add("offscreen");
    // Remove it from are tracked set
    delete this.elems[selector];
    // If the set is empty, hide the whole backdrop.
    if (Object.keys(this.elems).length == 0) {
      backdrop.classList.add("hidden");
    }
  }

  enterAdjustBrightness() {
    window.backdrop.classList.add("adjust-brightness");
  }

  leaveAdjustBrightness() {
    window.backdrop.classList.remove("adjust-brightness");
  }
}

window.backdropManager = new Backdrop();
