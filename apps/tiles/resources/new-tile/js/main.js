const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: ["activity manager", "webrtc"],
  },
  {
    name: "activity manager",
    kind: "sharedModule",
    param: ["js/activity_manager.js", ["ActivityManager"]],
  },
  {
    name: "webrtc",
    kind: "sharedScript",
    param: ["js/webrtc.js"],
  },
];

function log(msg) {
  console.log(`Tile[${location.hostname}] ${msg}`);
}

document.addEventListener("DOMContentLoaded", async () => {
  log("DOM ready");

  await depGraphLoaded;
  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));

  await graph.waitForDeps("main");
  // Configure activity handlers.
  let _activities = new ActivityManager({
    "p2p-tile-start": onStart,
    "p2p-tile-called": onCalled,
  });

  document.getElementById("loader").onclick = async () => {
    let output = document.getElementById("result");
    try {
      let response = await fetch("https://fosstodon.org/@capyloon.json");
      output.textContent = `HTTP status: ${response.status} ${response.statusText}`;
    } catch (e) {
      console.error(e);
      output.textContent = `Failed to fetch content: ${e}`;
    }
  };
});

function onStart(data) {
  log(`onStart data=${JSON.stringify(data)}`);
}

function onCalled(data) {
  log(`onCalled data=${JSON.stringify(data)}`);
}
