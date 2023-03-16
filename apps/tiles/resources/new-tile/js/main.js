const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: ["activity manager", "webrtc", "shared-api-daemon"],
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

function onError(error) {
  document.getElementById("error").textContent = JSON.stringify(error);
}

async function onStart(data) {
  log(`onStart data=${JSON.stringify(data)}`);

  try {
    let dweb = await window.apiDaemon.getDwebService();

    let session = await dweb.getSession(data.sessionId);
    let webrtc = new Webrtc(session.peer);

    webrtc.addEventListener("channel-open", () => {
      webrtc.channel.onmessage = (event) => {
        let output = document.getElementById("result");
        output.textContent = event.data;
      };

      webrtc.channel.send(`Hello ${JSON.stringify(session.peer)}`);
    });

    // Get the local offer.
    let offer = await webrtc.offer();
    log(`offer ready, about to dial remote peer`);

    // Get the anwser.
    let answer = await dweb.dial(session, {
      action: "tile",
      cid: location.hostname,
      offer,
      desc: "Shared Tile",
    });
    log(`onStart got answer: ${JSON.stringify(answer)}`);
    webrtc.setRemoteDescription(answer);
  } catch (e) {
    onError(e.value);
    log(`onStart Oops ${JSON.stringify(e)}`);
    throw e;
  }
}

async function onCalled(data) {
  log(`onCalled data=${JSON.stringify(data)}`);

  try {
    let webrtc = new Webrtc(data.peer);
    webrtc.setRemoteDescription(data.offer);

    webrtc.addEventListener("channel-open", () => {
      webrtc.channel.onmessage = (event) => {
        let output = document.getElementById("result");
        output.textContent = event.data;
      };
      webrtc.channel.send(`Hello ${JSON.stringify(data.peer)}`);
    });

    // Get the local answer.
    let answer = await webrtc.answer();
    // answser is a RTCSessionDescription object that can't be cloned so
    // we do a JSON roundtrip to turn it into a clonable object.
    log(`returning answer: ${answer}`);
    return JSON.parse(JSON.stringify(answer));
  } catch (e) {
    console.error(e);
    log(`onRespond Oops ${JSON.stringify(e)}`);
    throw e;
  }
}
