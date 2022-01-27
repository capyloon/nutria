self.addEventListener("install", function (event) {
  // Perform install steps
  console.log(
    `ZZZ ============================== Contacts sw.js is now installed`
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  // Perform activation steps
  console.log(
    `ZZZ ============================== Contacts sw.js is now activated`
  );
  self.clients.claim();
});

self.onsystemmessage = async (event) => {
  if (event.name !== "activity") {
    console.error(`Unexpected system message: ${event.name}`);
    return;
  }

  let handler = event.data.webActivityRequestHandler();
  let source = handler.source;

  if (source.name !== "new-contact") {
    console.error(`Unexpected activity: ${source.name}`);
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
