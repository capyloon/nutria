"use strict";

let port1;

function log() {
  console.log("YYY [swproxy]proxy.js", ...arguments);
}

function messageHandler(evt) {
  log("messageHandler: ", evt.data);
  const { origin, data } = evt;
  if (origin !== "chrome://system") {
    return;
  }
  switch (data.type) {
    case "port-transfer":
      port1 = evt.ports[0];
      log("Successfully transfered port2 and kept port1");
      break;
    case "activity-result":
      // send activity result to serviceWorker
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(data);
      } else {
        console.error("Failed to send activity result: navigator.serviceWorker.controller is null");
      }
      break;
    default:
      console.error(`Unexpected data type in proxy message: ${data.type}`);
      break;
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("message", messageHandler);

  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker.addEventListener("message", ({ data }) => {
        log("Got msg from SW:", data);
        if (port1) {
          if (
            [
              "systemmessage",
              // There might be other categories (service workers) in the future.
            ].includes(data.category)
          ) {
            // relay messages to https://system.localhost
            port1.postMessage(data);
          }
        }
      });
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          registration.active.postMessage({ systemReady: true });
        }
      });
    },
    { once: true }
  );
}
