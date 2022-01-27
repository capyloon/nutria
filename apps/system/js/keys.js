// Hardware keys management.
// Manages actions for short and long key presses.

"use strict";

const kShortPressMaxMs = 300;
const kLongPressMinMs = 600;

class KeyManager {
  constructor() {
    if (embedder.isReady) {
      this.addEvents();
    } else {
      embedder.addEventListener(
        "runtime-ready",
        () => {
          this.addEvents();
        },
        { once: true }
      );
    }

    this.shortPressHandlers = {};
    this.longPressHandlers = {};

    this.inFlight = {};
  }

  addEvents() {
    embedder.addSystemEventListener("keydown", this, true);
    embedder.addSystemEventListener("keyup", this, true);
  }

  handleEvent(event) {
    let key = event.key;
    // console.log(`KEY_EVENT ================== ${event.type} ${event.key}`);

    if (!this.shortPressHandlers[key] && !this.longPressHandlers[key]) {
      // console.error(`No handler for ${key}`);
      return;
    }

    if (event.type == "keydown" && !this.inFlight[key]) {
      // Create a record for a new keydown, but ignore repeats.
      this.inFlight[key] = {
        start: Date.now(),
        timer: window.setTimeout(() => {
          // If the long press timeout fires and we have a long press handler, call it.
          if (this.longPressHandlers[key]) {
            this.longPressHandlers[key](key);
          }
          // After notifying the long press handler, we can still get keydown events if
          // the key has "repeating" behavior. So instead of setting the inFlight[key] to
          // null we mark it as processed.
          this.inFlight[key].processed = true;
        }, kLongPressMinMs),
      };
    } else if (event.type == "keyup") {
      if (!this.inFlight[key].processed) {
        // Check if the time since keydown is less than the short press max time,
        // and cancel any running timer.
        window.clearTimeout(this.inFlight[key].timer);
        let elapsed = Date.now() - this.inFlight[key].start;
        if (this.shortPressHandlers[key] && elapsed < kShortPressMaxMs) {
          this.shortPressHandlers[key](key);
        }
      }
      this.inFlight[key] = null;
    }
  }

  registerShortPress(key, handler) {
    if (this.shortPressHandlers[key]) {
      console.error(
        `KeyManager: a short press handler is already registered for ${key}`
      );
      return;
    }
    // console.log(`VVV adding shortPressHandlers for ${key}`);

    this.shortPressHandlers[key] = handler;
  }

  registerShortPressAction(key, alternate = undefined) {
    // console.log(`VVV registerShortPressAction for ${key}`);
    this.registerShortPress(key, (key) => {
      actionsDispatcher.dispatch(
        `${alternate || key.toLowerCase()}-short-press`
      );
    });
  }

  registerLongPress(key, handler) {
    if (this.longPressHandlers[key]) {
      console.error(
        `KeyManager: a long press handler is already registered for ${key}`
      );
      return;
    }

    this.longPressHandlers[key] = handler;
  }

  registerLongPressAction(key, alternate = undefined) {
    this.registerLongPress(key, (key) => {
      actionsDispatcher.dispatch(
        `${alternate || key.toLowerCase()}-long-press`
      );
    });
  }
}

window.keyManager = new KeyManager();
