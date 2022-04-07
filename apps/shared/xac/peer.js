// A Cross Application Communicaton Peer.

const ORIGIN =
  location.hostname === "chrome://system" ? "system" : location.hostname;

var sXacWindow = null;

export class Peer extends EventTarget {
  constructor(callers, impl) {
    super();

    this.readyPromise = new Promise((resolve) => {
      this.isReady = resolve;
    });

    this.nextId = 0;
    this.requests = new Map(); // requests that are expected responses.

    this.impl = impl;
    this.log(`Creating Peer`);
    this.init(callers);
  }

  log(msg) {
    console.log(`XAC_Peer[${ORIGIN}] ${msg}`);
  }

  error(msg) {
    console.error(`XAC_Peer[${ORIGIN}] ${msg}`);
  }

  async init(callers = []) {
    if (!sXacWindow) {
      await this.loadFrame();
    }

    // this.log("frame loaded");

    // We can't know when the frame is ready in the system app, so we
    // periodically send a port until we get a response.
    this.channel = new MessageChannel();
    let timer = window.setInterval(() => {
      try {
        sXacWindow.postMessage({ command: "hello", callers }, "*", [
          this.channel.port2,
        ]);
        this.log(`hello sent`);
      } catch (e) {
        xacError(`Failed to postMessage: ${e}`);
      }
    }, 1000);

    this.channel.port1.onmessage = (message) => {
      window.clearInterval(timer);
      let command = message.data.command;
      // this.log(`Got message on port1: ${command}`);
      if (command === "router-ready") {
        this.isReady();
        this.dispatchEvent(new Event("ready"));
      } else if (command === "bridge-request") {
        this.onBridgeRequest(message.data);
      } else if (command === "bridge-response") {
        this.onBridgeResponse(message.data);
      } else {
        this.log(`Unsupported command: ${command}`);
      }
    };
  }

  sendResponse(data, result, error) {
    // Send response back.
    data.command = "response";
    data.error = error;
    data.result = result;
    data.target = data.from;
    delete data.from;
    sXacWindow.postMessage(data, "*");
  }

  // Call the requested function if possible, and send the result back.
  onBridgeRequest(data) {
    if (this.impl[data.fn] && typeof this.impl[data.fn] == "function") {
      this.impl[data.fn].call(this.impl, data.params).then(
        (success) => {
          this.sendResponse(data, success, false);
        },
        (error) => {
          this.sendResponse(data, error, true);
        }
      );
    } else {
      this.error(`Received call for unimplemented function: ${data.fn}`);
    }
  }

  // If we have the matching request pending, resolve the promise.
  onBridgeResponse(data) {
    if (data.target !== ORIGIN) {
      return;
    }

    if (!this.requests.has(data.id)) {
      this.error(`No pending request with id: ${data.id}`);
      return;
    }

    let { resolve, reject } = this.requests.get(data.id);
    this.requests.delete(data.id);
    if (data.error) {
      reject(data.result);
    } else {
      resolve(data.result);
    }
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

  nextUniqueId() {
    this.nextId += 1;
    return `${ORIGIN}-${this.nextId}`;
  }

  async send(target, fn, params) {
    await this.readyPromise;

    const data = {
      id: this.nextUniqueId(),
      command: "request",
      target,
      fn,
      params,
      from: ORIGIN,
    };

    sXacWindow.postMessage(data, "*");
    // this.log(`request sent to ${target} : ${fn}`);
    return new Promise((resolve, reject) => {
      this.requests.set(data.id, { resolve, reject });
    });
  }
}
