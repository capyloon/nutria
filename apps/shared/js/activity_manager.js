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
    this.timer = null;

    navigator.serviceWorker.addEventListener("message", this);
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
        console.error(`HHH No activity handler for '${name}'`);
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
            navigator.serviceWorker.controller.postMessage(message);
          },
          (error) => {
            message.result = error;
            message.isError = true;
            navigator.serviceWorker.controller.postMessage(message);
          }
        );
      } else {
        handler(data);
      }
    } else {
      if (topic === "stop_activity_keepalive" && swTimer) {
        window.clearInterval(this.swTimer);
      } else if (topic === "start_activity_keepalive" && !swTimer) {
        this.swTimer = window.setInterval(() => {
          navigator.serviceWorker.controller.postMessage({
            topic: "keep-alive",
          });
        }, 25000);
      } else {
        console.error(`Unexpected topic: ${event.data.topic}`);
      }
    }
  }
}
