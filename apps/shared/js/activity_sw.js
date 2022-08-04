function log(msg) {
  console.log(`${self.location} ${msg}`);
}

function error(msg) {
  console.error(`${self.location} ${msg}`);
}

self.addEventListener("install", (event) => {
  // Perform install steps
  log(`is now installed`);
});

self.addEventListener("activate", (event) => {
  // Perform activation steps
  log(`is now activated`);
});

self.addEventListener("systemmessage", async (event) => {
  log(`system message: ${event.name}`);
  if (event.name === "activity") {
    handleActivity(event.data.webActivityRequestHandler());
  } else {
    error(`Unexpected system message: ${event.name}`);
  }
});

async function getClient() {
  const allClients = await clients.matchAll({
    includeUncontrolled: true,
  });
  log(`Found ${allClients.length} clients.`);
  if (allClients.length == 0) {
    error(`No Homescreen!!`);
    return null;
  }
  return allClients[0];
}

async function handleActivity(handler) {
  let source = handler.source;

  // Get a handle to the app window.
  let win = await getClient();

  if (HAS_RETURN_VALUE_ACTIVITIES.includes(source.name)) {
    let activityId = ActivityRequests.addHandler(handler);
    log(`Sending message for ${source.name} with return value`);

    win.postMessage({
      topic: "activity",
      data: { source, activityId },
    });
    // Start the 'keepalive message interval' when receiving the first activity message.
    if (ActivityRequests.size === 1) {
      win.postMessage({
        topic: "system",
        data: "start_activity_keepalive",
      });
    }
  } else {
    log(`Sending message for ${source.name} with no return value`);
    win.postMessage({
      topic: "activity",
      data: { source },
    });
  }
}

self.addEventListener("message", async (event) => {
  log(`message: ${JSON.stringify(event.data)}`);
  let data = event.data;
  if (data.topic === "activity-result") {
    if (data.activityId) {
      const handler = ActivityRequests.getHandler(data.activityId);
      if (data.isError) {
        handler.postError(data.result);
      } else {
        handler.postResult(data.result);
      }
      ActivityRequests.removeHandler(data.activityId);
      // Stop the 'keepalive message interval' if there is no pending activity.
      if (ActivityRequests.size === 0) {
        let win = await getClient();
        win.postMessage({
          topic: "system",
          data: "stop_activity_keepalive",
        });
      }
    }
  } else {
    error(`Unexpected message topic: ${data.topic}`);
  }
});

const ActivityRequests = {
  map: new Map(),

  addHandler(handler) {
    const activityId = `${+new Date()}`;
    this.map.set(activityId, handler);
    log("ActivityRequests::addHandler: ", this.map);
    return activityId;
  },

  removeHandler(id) {
    this.map.delete(id);
    log("ActivityRequests::removeHandler: ", this.map);
  },

  getHandler(id) {
    return this.map.get(id);
  },

  get size() {
    return this.map.size;
  },
};
