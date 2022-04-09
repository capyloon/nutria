// Helpers to manage notifications.

// Compute a safe to use unique id since the one created
// by Gecko can't be used eg. in CSS selectors.
function safeForDomId(message) {
  const msgUint8 = new TextEncoder().encode(message);
  return new Promise(async (resolve) => {
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    resolve(hashHex);
  });
}

class NotificationsManager {
  constructor() {
    this.notifications = new Map();
    this.currentCount = 0;
  }

  status() {
    let count = this.notifications.size;
    // console.log(`YYY We have now ${count} notifications.`);
    if (count !== this.currentCount) {
      this.currentCount = count;
      actionsDispatcher.dispatch("notifications-count", count);
    }
  }

  show(notification) {
    // If the notification is tagged, update it instead of creating
    // a new one.
    let wrapped = this.notifications.get(notification.id);
    if (wrapped) {
      wrapped.update(notification);
    } else {
      wrapped = new NotificationWrapper(notification, this);
    }

    this.notifications.set(notification.id, wrapped);
    let settings = document.querySelector("quick-settings");
    settings.addOrUpdateNotification(wrapped);
    this.status();

    window.toaster.show(notification.text);
  }

  remove(id) {
    this.notifications.delete(id);
    this.status();
  }

  close(id) {
    let wrapped = this.notifications.get(id);
    if (wrapped) {
      let settings = document.querySelector("quick-settings");
      settings.removeNotification(wrapped);
    }
    this.notifications.delete(id);
    this.status();
  }
}

// A wrapper around an embedder notification.
class NotificationWrapper {
  constructor(notification, manager) {
    this.notification = notification;
    this.manager = manager;
    this.id = safeForDomId(this.notification.id);
  }

  click(action) {
    embedder.systemAlerts.click({
      id: this.notification.id,
      action,
    });
  }

  close() {
    embedder.systemAlerts.close(this.notification.id);
  }

  remove() {
    this.manager.remove(this.notification.id);
  }

  update(notification) {
    this.notification = notification;
  }
}
