self.addEventListener("install", function (event) {
  // Perform install steps
  console.log(`ZZZ ============================== Homescreen sw.js is now installed`);
});

self.addEventListener("activate", function (event) {
  // Perform activation steps
  console.log(`ZZZ ============================== Homescreen sw.js is now activated`);
});

async function cacheOrFetch(request) {
  let cachedResponse = await caches.match(request);
  if (cachedResponse !== undefined) {
    return cachedResponse;
  }

  let response = await fetch(request);
  let cache = await caches.open("offline");
  cache.put(request, response.clone());
  return response;
}

// self.addEventListener("fetch", (event) => {
//   event.respondWith(cacheOrFetch(event.request));
// });

self.onsystemmessage = async (event) => {
  try {
    let handler = event.data.webActivityRequestHandler();
    let source = handler.source;
    console.log(`ZZZ Homescreen activity name is ${source.name}`)
    console.log(`ZZZ Homescreen activity data: ${JSON.stringify(source.data)}`);

    const allClients = await clients.matchAll({
      includeUncontrolled: true
    });
    console.log(`ZZZ Homescreen found ${allClients.length} clients`);
    if (allClients.length > 0) {
      let win = allClients[0];
      console.log(`ZZZ Homescreen first client is ${win} at ${win.url}`);
      win.postMessage(source);

      // TODO: remote activity return value handling.
      if (source.name === "add-to-home") {
        handler.postResult({ done: true });
      }
    }
  } catch (err) {
    console.error(`ZZZ Opppssss homescreen is not running! ${err}`);
  }
};
