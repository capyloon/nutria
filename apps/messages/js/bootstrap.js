const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: ["thread head", "message display"],
  },
  {
    name: "thread head",
    kind: "script",
    param: "/components/thread_head.js",
    deps: ["lit element"],
  },
  {
    name: "message display",
    kind: "script",
    param: "/components/message_display.js",
    deps: ["lit element"],
  },
  {
    name: "lit element",
    kind: "sharedModule",
    param: ["components/lit.js", ["LitElement", "html", "css"]],
  },
];

class UiManager {
  constructor() {
    this.manager = navigator.b2g?.mobileMessageManager;
    this.manager?.addEventListener("received", this);
    this.manager?.addEventListener("sent", this);

    this.isHome = true;
    this.threadList = window["thread-list"];
    this.messageList = window["message-list"];

    this.sendButton = window["do-send"];
    this.messageInput = window["new-message"];

    this.newThreadButton = window["new-thread"];
    this.searchInput = window["search"];

    this.sendButton.onclick = () => {
      console.log(`MMM clicked to send '${this.messageInput.value}'`);
      let body = this.messageInput.value.trim();
      if (body.length > 0) {
        this.manager?.send(this.currentParticipants, body);
      }
      this.messageInput.value = null;
    };

    this.newThreadButton.onclick = async () => {
      let search = this.searchInput.value;
      this.findAndOpenThred(search);
    };

    this._panelManager = null;
  }

  set panelManager(value) {
    this._panelManager = value;
    this.updatePanelLinks();
  }

  updatePanelLinks() {
    if (this._panelManager) {
      document.body.querySelectorAll("thread-head").forEach((link) => {
        this._panelManager.registerPanelLink(link);
      });
    }
  }

  handleEvent(event) {
    console.log(`MMM Event ${event.type}`);
    if (event.type === "received" || event.type === "sent") {
      let message = event.message;
      console.log(`MMM Message thread=${message.threadId}`);
      if (!this.isHome && message.threadId === this.currentThread) {
        let newNode = this.messageList.appendChild(new MessageDisplay(message));
        // Scroll into view at the next tick to let the MessageDisplay component
        // the opportunity to resize itself first.
        window.setTimeout(() => {
          newNode.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }, 0);
      } else if (this.isHome) {
        this.updateThreadList();
      }
    }
  }

  async updateThreadList() {
    console.log(`MMM updateThreadList`);
    // TODO: be smart and reuse existing elements.
    // TODO: sort the list by date.
    this.threadList.innerHTML = "";
    let threads = this.manager.getThreads().values();
    for await (let thread of threads) {
      const { id, body, participants, lastMessageType, timestamp } = thread;
      console.log(
        `MMMM thread: ${id} ${participants} '${body}' ${lastMessageType} ${timestamp}`
      );
      this.threadList.appendChild(new ThreadHead(thread));
    }
    this.updatePanelLinks();
  }

  async findAndOpenThred(search) {
    // check if this number matches an existing thread, and if so open it.
    let threads = this.manager.getThreads().values();
    let matchThread = null;
    for await (let thread of threads) {
      const { id, body, participants, lastMessageType } = thread;
      console.log(
        `MMM thread: ${id} ${participants} '${body}' ${lastMessageType}`
      );
      if (participants == search) {
        matchThread = thread;
      }
    }
    if (matchThread) {
      console.log(`MMM Found exising thread ${matchThread.id}`);
      this._panelManager.handleEvent(
        new CustomEvent("open", {
          detail: { name: "thread", data: matchThread },
        })
      );
    } else {
      console.log(`MMM Creating new thread for ${search}`);
      this._panelManager.handleEvent(
        new CustomEvent("open", {
          detail: { name: "thread", data: { participants: [search] } },
        })
      );
    }
  }

  async openThread(thread) {
    console.log(`MMM Opening thread ${thread.id || "<new thread>"}`);
    this.isHome = false;
    let { id, participants } = thread;
    this.currentThread = id;
    this.currentParticipants = participants;
    this.messageList.innerHTML = "";
    window["message-participants"].textContent = participants.join(",");

    if (!this.manager) {
      createDummyMessageList(this.messageList);
      return;
    }

    if (id) {
      let messages = this.manager.getMessages({ threadId: id }).values();
      let node;
      for await (let message of messages) {
        console.log(
          `MMMM message:  #${message.id} ${message.body} |${message.delivery}|`
        );
        node = this.messageList.appendChild(new MessageDisplay(message));
      }
      node?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }
}

function createDummyMessageList(list) {
  let messages = [
    {
      body: "Hello, this is b2gOS!",
      delivery: "sent",
      timestamp: Date.now(),
    },
    {
      body: "This looks like a very promising project!",
      delivery: "received",
      timestamp: Date.now(),
    },
    {
      body: "When will it ship?",
      delivery: "received",
      timestamp: Date.now(),
    },
    {
      body: "Let's switch to https://signal.org/install",
      delivery: "received",
      timestamp: Date.now(),
    },
  ];
  for (let i = 0; i < 1; i++) {
    messages.forEach((message) =>
      list.appendChild(new MessageDisplay(message))
    );
  }
}

function createDummyThreadList() {
  let list = window["thread-list"];

  for (let i = 0; i < 50; i++) {
    list.appendChild(
      new ThreadHead({
        body: "You received a message, it is so long we will have to cut it nicely to keep it on one line",
        participants: ["6503903655"],
        timestamp: Date.now(),
        id: i + 1,
      })
    );
  }
}

// A factory to load panels from a <div>
class PanelFactory {
  constructor() {
    this.ui = new UiManager();

    let manager = navigator.b2g?.mobileMessageManager;
    if (!manager) {
      console.error(`b2g.mobileMessageManager is not available!`);
      createDummyThreadList();
      return;
    }

    this.ui.updateThreadList();
  }

  log(msg) {
    console.log(`PanelFactory: ${msg}`);
  }

  open(name, data) {
    this.log(`open(${name}) ${data}`);
    this.panel = document.getElementById(`panel-${name}`);
    if (this.panel && data) {
      this.log(`opening panel ${name}`);
      this.panel.classList.add("open");
      this.ui.openThread(data);
    }
  }

  hide() {
    if (this.panel) {
      this.panel.classList.remove("open");
    }
  }

  set panelManager(value) {
    this.ui.panelManager = value;
  }
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    console.log(`DOMContentLoaded`);

    await depGraphLoaded;

    let graph = new ParallelGraphLoader(kDeps);
    let resolved = await Promise.all([
      getSharedDeps("panel manager"),
      getSharedDeps("shared-all"),
      graph.waitForDeps("main"),
    ]);

    let module = resolved[0].get("panel manager");
    let panelFactory = new PanelFactory();
    let panelManager = new module.PanelManager(panelFactory, "thread-head");
    panelFactory.panelManager = panelManager;

    panelManager.processLocation();

    // Listen to messages from the service worker.
    navigator.serviceWorker.onmessage = async (event) => {
      let data = event.data;
      panelFactory.ui.findAndOpenThred(data.number);
    };
  },
  { once: true }
);
