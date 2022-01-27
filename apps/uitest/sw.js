self.addEventListener("install", function (event) {
  // Perform install steps
  console.log(
    `UITest ============================== sw.js is now installed`
  );
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
  console.log(
    `UITest ============================== sw.js is now activated`
  );

  // self.setInterval(() => {
  //   console.log(`ZZZ =========== Hello from UITest sw.js`);
  //   testFetch();
  // }, 5000);
  evt.waitUntil(self.clients.claim());
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
