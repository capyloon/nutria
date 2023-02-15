const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: [
      "shared-fluent",
      "shoelace-light-theme",
      "shoelace-setup",
      "shoelace-progress-bar",
      "shoelace-button",
      "shoelace-input",
      "shoelace-icon-button",
      "shoelace-alert",
      "activity manager",
      "webrtc",
    ],
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
  console.log(`Chat: ${msg}`);
}

var graph;

document.addEventListener("DOMContentLoaded", async () => {
  console.log(`DOMContentLoaded`);
  await depGraphLoaded;
  graph = new ParallelGraphLoader(addSharedDeps(addShoelaceDeps(kDeps)));

  await graph.waitForDeps("main");
  // Configure activity handlers.
  let _activities = new ActivityManager({
    "p2p-start": onStart,
    "p2p-respond": onRespond,
  });

  document.getElementById("bye-bye").onclick = () => {
    window.close();
  };
});

function addTextBubble(text, node, dir = "left") {
  let item = document.createElement("div");
  item.classList.add("message");
  item.classList.add(dir);
  let content = document.createElement("div");
  content.textContent = text;
  item.append(content);
  node.prepend(item);
}

function onClose() {
  document.getElementById("closed-section").show();
  document.getElementById("send-button").setAttribute("disabled", "true");
  document
    .getElementById("chat")
    .querySelector("sl-input")
    .setAttribute("disabled", "true");
}

function createChat(channel, peer) {
  document.getElementById("connect").classList.add("hidden");
  let chatContainer = document.getElementById("chat");
  chatContainer.classList.remove("hidden");
  chatContainer.querySelector("#chat-title").textContent = peer.did;
  let messages = document.getElementById("messages");

  channel.addEventListener("error", () => {
    log(`channel error!`);
  });

  channel.addEventListener("close", () => {
    log(`channel close!`);
    onClose();
  });

  channel.addEventListener("message", (event) => {
    if (!event.data) {
      return;
    }
    let message = JSON.parse(event.data);

    if (message.text && message.text.length) {
      addTextBubble(message.text, messages, "left");
    }
  });

  let input = chatContainer.querySelector("sl-input");

  function sendMessage() {
    let text = input.value.trim();
    if (text.length !== 0) {
      channel.send(JSON.stringify({ text }));
      addTextBubble(text, messages, "right");
      input.value = "";
    }
  }

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  chatContainer
    .querySelector("#send-button")
    .addEventListener("click", sendMessage);
}

async function onRespond(data) {
  log(`onRespond ${JSON.stringify(data)}`);

  try {
    let webrtc = new Webrtc(data.peer);
    webrtc.setRemoteDescription(data.offer);

    webrtc.addEventListener("channel-open", () => {
      createChat(webrtc.channel, data.peer);
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

function onError(error) {
  document.getElementById("connect").classList.add("hidden");
  document.getElementById("chat").classList.add("hidden");
  document.getElementById("bye-bye-error").onclick = () => {
    window.close();
  };
  document.getElementById("error-wrapper").classList.remove("hidden");
  document.getElementById("error-section").show();
}

async function onStart(data) {
  log(`onStart ${JSON.stringify(data)}`);

  try {
    let dweb = await window.apiDaemon.getDwebService();

    let session = await dweb.getSession(data.sessionId);
    let webrtc = new Webrtc(session.peer);

    webrtc.addEventListener("channel-open", () => {
      createChat(webrtc.channel, session.peer);
    });

    // Get the local offer.
    let offer = await webrtc.offer();
    log(`offer ready, about to dial remote peer`);

    // Get the anwser.
    let answer = await dweb.dial(session, {
      action: "launch",
      offer,
      app_id: "aff588f5-0e8c-4225-9e61-284ff8f746d5",
      desc: "Let's Chat!",
    });
    log(`onStart got answer: ${JSON.stringify(answer)}`);
    webrtc.setRemoteDescription(answer);
  } catch (e) {
    onError(e.value);
    log(`onStart Oops ${JSON.stringify(e)}`);
    throw e;
  }
}
