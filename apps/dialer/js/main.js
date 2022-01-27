const telephony = navigator.b2g?.telephony;

function button(name) {
  return document.getElementById(`btn-${name}`);
}

function elem(name) {
  return document.getElementById(name);
}

function bindButtonToState(btnName, prop) {
  if (!telephony) {
    return;
  }

  let node = button(btnName);

  const update = () => {
    if (telephony[prop]) {
      node.classList.add("active");
    } else {
      node.classList.remove("active");
    }
  };

  node.onclick = () => {
    telephony[prop] = !telephony[prop];
    update();
  };

  update();
}

function manageIncoming(call) {
  if (!call) {
    console.error(`MMM No active call...`);
    return;
  }

  if (telephony.ownAudioChannel) {
    console.log(`MMM owning audio channel`);
    telephony.ownAudioChannel();
  }

  call.ondisconnected = () => {
    console.log(`MMM call got disconnected, bye!`);
    window.close();
  };

  elem("number").textContent = call.id.number;

  button("accept").onclick = async () => {
    console.log(`MMM accept`);
    await call.answer(telephony.CALL_TYPE_VOICE);

    panelManager.switchTo("in-call");
  };

  button("reject").onclick = async () => {
    console.log(`MMM reject ${telephony.calls.length} calls`);
    try {
      await call.hangUp(true);
      window.close();
    } catch (e) {
      console.error(`MMM oops ${e}`);
    }
  };

  button("hangup").onclick = async () => {
    console.log(`MMM hangUp`);
    try {
      await call.hangUp();
      window.close();
    } catch (e) {
      console.error(`MMM oops ${e}`);
    }
  };
}

let cancelNextClick = false;
function onDigit(event) {
  let node = event.currentTarget;
  if (!node.hasAttribute("data-digit")) {
    return;
  }

  if (cancelNextClick) {
    cancelNextClick = false;
    return;
  }

  elem("dialed-number").textContent += node.getAttribute("data-digit");
}

function onLongPress(event) {
  let node = event.currentTarget;
  event.stopPropagation();
  event.preventDefault();
  console.log(`MMM onLongPress ${node.hasAttribute("data-secdigit")}`);
  if (!node.hasAttribute("data-secdigit")) {
    return;
  }

  elem("dialed-number").textContent += node.getAttribute("data-secdigit");
  // Somehow on desktop builds we always get a click after a long press contextmenu.
  cancelNextClick = !window.config.isDevice;
}

function setupDialer() {
  try {
    document.querySelectorAll(".digit").forEach((node) => {
      node.onclick = onDigit;
      node.oncontextmenu = onLongPress;
    });

    document.querySelector(".delete-key").onclick = () => {
      let node = elem("dialed-number");
      let current = node.textContent;
      node.textContent = current.substring(0, current.length - 1);
    };

    elem("btn-dial").onclick = () => {
      let number = elem("dialed-number").textContent;
      console.log(`MMM Dialing ${number} ${telephony.CALL_TYPE_VOICE}`);

      // TODO: Switch to "wait call answer" UI.

      telephony
        .dial(number, telephony.CALL_TYPE_VOICE, false)
        .then((call) => {
          panelManager.switchTo("wait-outgoing");
          elem("number").textContent = number;

          button("reject2").onclick = async () => {
            try {
              await call.hangUp(true);
              window.close();
            } catch (e) {
              console.error(`MMM oops ${e}`);
            }
          };

          call.onstatechange = () => {
            elem("number").textContent = `${number} - ${call.state}`;
            if (call.state == "connected") {
              panelManager.switchTo("in-call");
              manageIncoming(call);
            } else if (call.state == "disconnected") {
              window.close();
            }
          };
        })
        .catch((error) => {
          console.error(`MMM error dialing: ${error}`);
        });
    };
  } catch (e) {
    console.error("MMM OOpps ${error}");
  }
}

// A class to manage the UI based on the call state.
class PanelManager {
  constructor() {
    this.state = "unknown";

    this.allPanels = [
      "dialpad-container",
      "accept-reject",
      "on-call",
      "wait-outgoing",
    ];

    this.states = {
      outgoing: { nodes: ["dialpad-container"], pageTitle: "page-title-dial" },
      incoming: { nodes: ["accept-reject"], pageTitle: "page-title-incoming" },
      "in-call": { nodes: ["on-call"], pageTitle: "page-title-connected" },
      "wait-outgoing": { nodes: ["wait-outgoing"], pageTitle: "page-title-wait" },
    };
  }

  switchTo(state) {
    if (!this.states[state]) {
      console.error(`PanelManager::switchTo: invalide state '${state}'`);
      return;
    }

    let toEnable = this.states[state];
    this.allPanels.forEach((panel) => {
      let node = document.getElementById(panel);
      if (toEnable.nodes.includes(panel)) {
        node.classList.remove("hidden");
      } else {
        node.classList.add("hidden");
      }
    });
    elem("page-title").setAttribute("data-l10n-id", toEnable.pageTitle);
  }
}

const panelManager = new PanelManager();

document.addEventListener("DOMContentLoaded", async () => {
  await depGraphLoaded;
  await getSharedDeps(["shared-fluent", "shared-icons"]);

  bindButtonToState("mute", "muted");
  bindButtonToState("speaker", "speakerEnabled");

  // Set UI state based on the presence of ?incoming in the url.
  if (window.location.search == "?incoming") {
    panelManager.switchTo("incoming");

    if (telephony.calls[0]) {
      manageIncoming(telephony.calls[0]);
    } else {
      telephony.onincoming = (event) => {
        console.error(`MMM incoming call ${e}`);
        manageIncoming(event.call);
      };
    }
  } else {
    panelManager.switchTo("outgoing");
    setupDialer();
  }
});
