const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: ["activity manager", "tile helper"],
  },
  {
    name: "activity manager",
    kind: "sharedModule",
    param: ["js/activity_manager.js", ["ActivityManager"]],
  },
  {
    name: "tile helper",
    kind: "sharedModule",
    param: ["js/tile.js", ["TileHelper"]],
    deps: ["shared-api-daemon"],
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

function onError(error) {
  document.getElementById("error").textContent = JSON.stringify(error);
}

// Function called when the app start in "initiating mode".
async function onStart(data) {
  log(`onStart data=${JSON.stringify(data)}`);
  data.desc = "Shared Tile";

  let helper = new TileHelper(data);

  helper.addEventListener("open", event => {
    let channel = event.detail.channel;

    channel.onmessage = (event) => {
      let output = document.getElementById("result");
      output.textContent = event.data;
    };

    channel.send(`Hello ${JSON.stringify(helper.peer)}`);
  });

  try {
    helper.onStart();
  } catch (e) {
    onError(e.value);
    log(`onStart Oops ${JSON.stringify(e)}`);
    throw e;
  }
}

// Function called when the app start in "receiving" mode.
async function onCalled(data) {
  log(`onCalled`);
  let helper = new TileHelper(data);

  helper.addEventListener("open", event => {
    let channel = event.detail.channel;

    channel.onmessage = (event) => {
      let output = document.getElementById("result");
      output.textContent = event.data;
    };

    channel.send(`Hello ${JSON.stringify(helper.peer)}`);
  });

  try {
    let answer = await helper.onCalled();
    return answer;
  } catch (e) {
    console.error(e);
    log(`onRespond Oops ${JSON.stringify(e)}`);
    throw e;
  }
}
