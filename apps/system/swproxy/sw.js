"use strict";
/* global clients */

const SYSTEM_MESSAGE_TYPES = ["activity"];

const HAS_RETURN_VALUE_ACTIVITIES = [];

let messageCache = [];
self.addEventListener("install", (evt) => {
  evt.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(self.clients.claim());
});

function postMessage(evt, message) {
  evt.waitUntil(
    clients
      .matchAll({
        includeUncontrolled: true,
        type: "window",
      })
      .then((clientList) => {
        clientList.forEach((client) => {
          client.postMessage(message);
        });
      })
  );
}

self.onsystemmessage = (evt) => {
  console.log("onsystemmessage", evt.name);
  if (SYSTEM_MESSAGE_TYPES.includes(evt.name)) {
    if (!self.systemReady && evt.name === "icc-stkcommand") {
      messageCache.push(evt);
      return;
    }

    if (evt.name === "activity") {
      const handler = evt.data.webActivityRequestHandler();
      const source = handler.source;
      if (HAS_RETURN_VALUE_ACTIVITIES.includes(source.name)) {
        let activityId = ActivityRequests.addHandler(handler);
        const data = { source: handler.source, activityId };
        postMessage(evt, {
          category: "systemmessage",
          type: evt.name,
          data,
        });
        // Start the 'keepalive message interval' when receiving the first activity message.
        if (ActivityRequests.size === 1) {
          postMessage(evt, {
            category: "systemmessage",
            type: "activity_keepalive",
            data: "start",
          });
        }
      } else {
        const data = { source: handler.source };
        postMessage(evt, {
          category: "systemmessage",
          type: evt.name,
          data,
        });
      }
    } else {
      const data = evt.data.json();
      postMessage(evt, {
        category: "systemmessage",
        type: evt.name,
        data,
      });
    }
  }
};

self.addEventListener("message", (event) => {
  // Message received from clients
  console.log("service worker received message: ", event.data);
  const { data } = event;
  console.log(`SW data=${JSON.stringify(data)}`);

  if (data.isKeepalive) {
    console.log("Receiving a keepalive message, nothing more to do.");
    return;
  }

  if (data.systemReady) {
    self.systemReady = true;
    messageCache.forEach((evt) => {
      postMessage(evt, {
        category: "systemmessage",
        type: evt.name,
        data: evt.data.json(),
      });
    });
    messageCache = [];
  }

  if (data.activityId) {
    const handler = ActivityRequests.getHandler(data.activityId);
    if (data.isError) {
      handler.postError(data.activityResult);
    } else {
      handler.postResult(data.activityResult);
    }
    ActivityRequests.removeHandler(data.activityId);
    // Stop the 'keepalive message interval' if there is no pending activity.
    if (ActivityRequests.size === 0) {
      postMessage(event, {
        category: "systemmessage",
        type: "activity_keepalive",
        data: "stop",
      });
    }
  }

  if (data.notification) {
    try {
      let notification = data.notification;
      let { title, body, icon, tag, actions } = notification;
      let ndata = notification.data;
      console.log(`SW notif title=${title} body=${body} tag=${tag} data=${ndata}`);
      self.registration
        .showNotification(title, {
          body,
          icon,
          tag,
          actions,
          data: ndata,
        })
        .catch((e) => {
          console.log(`SW showNotification error: ${e}`);
        });

      self.onnotificationclick = (event) => {
        console.log(
          `notification click: action=${event.action} tag=${event.notification.tag}`
        );
        // Send back the notification click action.
        postMessage(event, {
          category: "notification",
          type: "action",
          data: { action: event.action, tag: event.notification.tag },
        });
      };
    } catch (e) {
      console.error(`SW Oops: ${e}`);
    }
  }
});

const ActivityRequests = {
  map: new Map(),

  addHandler(handler) {
    const activityId = `${+new Date()}`;
    this.map.set(activityId, handler);
    console.log("ActivityRequests::addHandler: ", this.map);
    return activityId;
  },

  removeHandler(id) {
    this.map.delete(id);
    console.log("ActivityRequests::removeHandler: ", this.map);
  },

  getHandler(id) {
    return this.map.get(id);
  },

  get size() {
    return this.map.size;
  },
};
