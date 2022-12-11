const ACTIVITY_NAMES = ["pick", "view-resource", "install-wasm-plugin"];

function log(msg) {
  console.log(`ContentMgrSw: ${msg}`);
}

function error(msg) {
  console.error(`ContentMgrSw: ${msg}`);
}

self.addEventListener("install", function (event) {
  // Perform install steps
  log(`============================== sw.js is now installed`);
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  // Perform activation steps
  log(`============================== sw.js is now activated`);
  self.clients.claim();
});

self.onsystemmessage = async (event) => {
  if (event.name !== "activity") {
    error(`Unexpected system message: ${event.name}`);
    return;
  }

  let handler = event.data.webActivityRequestHandler();
  let source = handler.source;

  if (!ACTIVITY_NAMES.includes(source.name)) {
    error(`Unexpected activity: ${source.name}`);
    return;
  }

  let resolver;
  let promise = new Promise((resolve) => {
    resolver = resolve;
  });
  event.waitUntil(promise);

  // console.log(`CMGR ContentMgr activity data: ${JSON.stringify(source.data)}`);

  const allClients = await clients.matchAll({
    includeUncontrolled: true,
  });
  if (allClients.length > 0) {
    let win = allClients[0];
    log(`Found client, sending message.`);
    win.focus();
    win.postMessage(source);
  } else {
    log(`No client found, opening window.`);
    let win = await clients.openWindow("/index.html#activity");
    win.postMessage(source);
  }
  resolver();
};
