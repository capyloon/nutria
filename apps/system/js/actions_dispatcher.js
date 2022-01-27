// A simple actions dispatcher.

"use strict";

export class ActionsDispatcher {
  constructor() {
    this.listeners = new Map();
    this.eventHandlers = new Map();
  }

  handler_for(action_name) {
    if (!this.eventHandlers.has(action_name)) {
      this.eventHandlers.set(action_name, event => {
        this.handleEvent(action_name, event);
      });
    }

    return this.eventHandlers.get(action_name);
  }

  addListener(action_name, listener) {
    if (!this.listeners.has(action_name)) {
      this.listeners.set(action_name, new Set([listener]));
    } else {
      let listeners = this.listeners.get(action_name);
      listeners.add(listener);
    }
  }

  removeListener(action_name, listener) {
    if (!this.listeners.has(action_name)) {
      return;
    }

    let listeners = this.listeners.get(action_name);
    if (listeners.has(listener)) {
      listeners.delete(listener);
    }
  }

  dispatch(action_name, data) {
    console.log(`ActionsDispatcher::dispatch ${action_name}`);

    // dispatch the even data to all listeners for this action.
    if (!this.listeners.has(action_name)) {
      console.warn(`No listeners for ${action_name}`);
      return;
    }

    this.listeners.get(action_name).forEach(listener => {
      listener(action_name, data);
    });
  }
}
