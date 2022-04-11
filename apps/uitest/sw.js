function log(msg) {
  console.log(`UITest SW: ${msg}`);
}

self.addEventListener("install", function (event) {
  // Perform install steps
  log(`installed`);
  evt.waitUntil(self.skipWaiting());
});

function testFetch() {
  const headers = new Headers({
    Authorization: "something",
    "Kai-Device-Info": "Some device info",
    "Content-Type": "application/json",
  });

  const request = new Request("http://localhost:8080/post_me", {
    method: "POST",
    mode: "no-cors",
    body: null,
    headers,
  });

  fetch(request)
    .then((response) => {
      console.log(`fetch response ${response}`);
    })
    .catch((error) => {
      console.error(`fetch error ${error}`);
    });
}

self.addEventListener("activate", function (event) {
  // Perform activation steps
  log(`activated`);

  // self.setInterval(() => {
  //   console.log(`ZZZ =========== Hello from UITest sw.js`);
  //   testFetch();
  // }, 5000);
  evt.waitUntil(self.clients.claim());
});

self.onsystemmessage = async (event) => {
  if (event.name !== "activity") {
    log(`Unexpected system message: ${event.name}`);
    return;
  }

  let handler = event.data.webActivityRequestHandler();
  let source = handler.source;

  if (source.name !== "new-contact") {
    log(`Unexpected activity: ${source.name}`);
    return;
  }

  let resolver;
  let promise = new Promise((resolve) => {
    resolver = resolve;
  });
  event.waitUntil(promise);

  // console.log(`ZZZ Contact activity data: ${JSON.stringify(source.data)}`);

  const allClients = await clients.matchAll({
    includeUncontrolled: true,
  });
  if (allClients.length > 0) {
    let win = allClients[0];
    win.postMessage(source.data);
  } else {
    let win = await clients.openWindow("/index.html");
    win.postMessage(source.data);
  }
  resolver();
};

self.onmessage = (event) => {
  if (event.data === "show-notification") {
    self.registration.showNotification("To do list", {
      body: "Persistent Notification With Actions",
      icon: `http://branding.localhost:${location.port}/resources/logo.webp`,
      tag: `sw-notif`,
      actions: [
        { title: "First Action", action: "action-1" },
        { title: "Second Action", action: "action-2" },
      ],
    });

    self.onnotificationclick = (event) => {
      log(
        `notification click: action=${event.action} tag=${event.notification.tag}`
      );
    };
  }
};
