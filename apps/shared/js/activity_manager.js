// Simplifies handling activities in an app.
// Instanciate ActivityManager with a mapping of activity names to functions.
// If an activity is expected to return a value, the function has to return
// a promise. The resolved or rejected values will be used as activity results.

export class ActivityManager {
  constructor(handlers) {
    console.log(
      `ActivityManager::constructor, handling ${Object.keys(handlers)}`
    );
    this.handlers = handlers;

    this.controller = null;

    if (!navigator.serviceWorker.controller) {
      navigator.serviceWorker.register("sw.js").then(
        (registration) => {
          this.controller = registration.active;
          navigator.serviceWorker.addEventListener("message", this);
        },
        (error) => {
          console.error(`serviceWorker.register failed: ${error}`);
        }
      );
    } else {
      this.controller = navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener("message", this);
    }
  }

  handleEvent(event) {
    let topic = event.data.topic;
    if (topic === "activity") {
      // activity looks like:
      // {"activityId":"xyz","source":{"data":{},"name":"toggle-app-list"}}"
      let { activityId, source } = event.data.data;
      let { data, name } = source;

      let handler = this.handlers[name];
      if (!handler) {
        console.error(`No activity handler for '${name}'`);
      }

      // If activityId is defined, this activity returns data.
      if (activityId) {
        let message = {
          topic: "activity-result",
          activityId,
          isError: false,
        };
        handler(data).then(
          (success) => {
            message.result = success;
            this.controller.postMessage(message);
          },
          (error) => {
            message.result = error;
            message.isError = true;
            this.controller.postMessage(message);
          }
        );
      } else {
        handler(data);
      }
    } else if (topic === "system") {
      let data = event.data.data;
      console.error(`Unexpected system topic: ${data}`);
    } else {
      console.error(`Unexpected topic: ${topic}`);
    }
  }
}
