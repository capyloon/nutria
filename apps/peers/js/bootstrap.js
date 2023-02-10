const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: [
      "shared-fluent",
      "shoelace-light-theme",
      "shoelace-setup",
      "shoelace-progress-bar",
      "shoelace-qr-code",
      "shoelace-button",
      "shoelace-menu",
      "shoelace-menu-item",
    ],
  },
  {
    name: "activity manager",
    kind: "sharedModule",
    param: ["js/activity_manager.js", ["ActivityManager"]],
  },
];

function log(msg) {
  console.log(`PeersApp: ${msg}`);
}

var graph;

document.addEventListener("DOMContentLoaded", async () => {
  console.log(`DOMContentLoaded`);
  await depGraphLoaded;
  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));

  await graph.waitForDeps("activity manager");
  // Configure activity handlers.
  let _activities = new ActivityManager({
    share: onShare,
  });

  await graph.waitForDeps("main");

  log(`location hash: ${location.hash}`);
  if (location.hash == "") {
    log(`No activity...`);
    document
      .getElementById("description")
      .setAttribute("data-l10n-id", "share-nothing");
    document.getElementById("qr-code").value = "https://capyloon.org";
    document.getElementById("bye-bye").onclick = () => {
      window.close();
    };
  } else {
    // Hide the "Ok" button when launched as an activity since the system UI
    // provides a button to close it.
    document.getElementById("bye-bye").remove();
  }
});

// Share a blob content:
// - POST it to the local ipfs node.
// - Create a QR Code with the ipfs url.
async function shareBlob(blob, name = "") {
  log(`shareBlob: ${blob.type} ${blob.size}`);

  let progress = document.getElementById("progress-bar");

  try {
    document
      .getElementById("description")
      .setAttribute("data-l10n-args", JSON.stringify({ name }));
    document.getElementById("share").classList.remove("hidden");
    progress.setAttribute("indeterminate", "");
    const url = "ipfs://localhost/ipfs";
    let response = await fetch(url, {
      method: "POST",
      body: blob,
    });
    progress.removeAttribute("indeterminate");
    let ipfsUrl = response.headers.get("location");
    document.getElementById("qr-code").value = ipfsUrl;
    return ipfsUrl;
  } catch (e) {
    // Cleanup if anything fails.
    // TODO: proper error message.
    progress.removeAttribute("indeterminate");
    log(e);
  }
}

async function sendToPeer(dweb, sessionId, toShare) {
  log(`sendToPeer, session id=${sessionId}`);
  try {
    let session = await dweb.getSession(sessionId);

    let params = {};

    if (toShare.url) {
      params.action = "open-url";
      params.url = toShare.url;
    } else if (toShare.ipfsUrl) {
      params.action = "download";
      params.url = toShare.ipfsUrl;
      params.name = toShare.name;
      params.size = toShare.size;
    } else if (toShare.text) {
      params.action = "text";
      params.text = toShare.text;
    }

    let result = await dweb.dial(session, params);
    log(`sendToPeer result: ${result}`);
  } catch (e) {
    console.error(e);
    log(`Oops ${JSON.stringify(e)}`);
  }
}

// Share activity main entry point.
async function onShare(data) {
  log(`onShare: ${JSON.stringify(data)}`);

  let toShare = {};

  if (data.blob) {
    let ipfsUrl = await shareBlob(data.blob, data.name);
    toShare.ipfsUrl = ipfsUrl;
    toShare.name = data.name;
    toShare.size = data.blob.size;
  } else if (data.url || data.text) {
    toShare.url = data.url;
    toShare.text = data.text;

    let text = data.url || data.text;
    document
      .getElementById("description")
      .setAttribute("data-l10n-args", JSON.stringify({ name: text }));
    document.getElementById("share").classList.remove("hidden");
    document.getElementById("qr-code").value = text;
  } else {
    log(`onShare: nothing to share`);
    return;
  }

  await graph.waitForDeps("shared-api-daemon");

  let dweb = await apiDaemon.getDwebService();
  let sessions = await dweb.getSessions();
  log(`Found ${sessions.length} active p2p sessions`);
  if (sessions?.length) {
    let menu = document.getElementById("peers");
    menu.addEventListener("sl-select", (event) => {
      sendToPeer(dweb, event.detail.item.dataset.sessionId, toShare);
    });
    document.getElementById("peers-section").classList.add("open");
    sessions.forEach((session) => {
      let item = document.createElement("sl-menu-item");
      item.dataset.l10nId = "peers-detail";
      item.dataset.sessionId = session.id;
      let { did, deviceDesc } = session.peer;
      item.dataset.l10nArgs = JSON.stringify({ did, deviceDesc });
      menu.append(item);
    });
  }
}
