// A Cross Application Communicaton Peer.

const ORIGIN =
  location.hostname === "chrome://system" ? "system" : location.hostname;

var sXacWindow = null;

export class Peer extends EventTarget {
  constructor(peers) {
    super();

    this.log(`Creating Peer`);
    this.init(peers);
  }

  log(msg) {
    console.log(`XAC_Peer[${ORIGIN}] ${msg}`);
  }

  error(msg) {
    console.error(`XAC_Peer[${ORIGIN}] ${msg}`);
  }

  async init(peers) {
    if (!sXacWindow) {
      await this.loadFrame();
    }

    // this.log("frame loaded");

    // We can't know when the frame is ready in the system app, so we
    // periodically send a port until we get a response.
    let channel = new MessageChannel();
    let timer = window.setInterval(() => {
      try {
        sXacWindow.postMessage({ command: "hello", args: peers || [] }, "*", [
          channel.port2,
        ]);
        this.log(`hello sent`);
      } catch (e) {
        xacError(`Failed to postMessage: ${e}`);
      }
    }, 1000);

    channel.port1.onmessage = (message) => {
      window.clearInterval(timer);
      let command = message.data.command;
      this.log(`Got message on port1: ${command}`);
      if (command === "router-ready") {
        this.dispatchEvent(new Event("ready"));
      }
    };
  }

  loadFrame() {
    let document = window.document;
    const iframe = document.createElement("iframe");
    iframe.src = `http://shared.localhost:${window.config.port}/xac/frame.html`;
    document.body.appendChild(iframe);
    iframe.style.display = "none";
    sXacWindow = iframe.contentWindow;

    let event = location.hostname == "system" ? "pageshow" : "load";
    return new Promise((resolve) => {
      iframe.addEventListener(
        event,
        () => {
          // this.log(`frame event: ${event}`);
          resolve();
        },
        { once: true }
      );
    });
  }
}
