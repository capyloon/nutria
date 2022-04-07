// A Cross Application Communicaton Router.
// Each app loads a router instance, in a frame hosted at a common origin.
// That allows:
// - Each peer to communicate with its router using MessageChannel across the iframe boundary.
// - All the routers to use BroadcastChannel since they are same origin.
//
// The router maintains a routing table and is in charge of dropping invalid messages.
//
// Messages exchanged between peers and routers: js objects with the following properties:
// - [mandatory] command ("hello"|"router-ready"|"request"|"response"|"error")
// - [optional] id <string> : mandatory for request and response commands.
// - [optional] target <string> : mandatory for request, the host we call the function on.
// - [optional] fn <string> : mandatory for request, the name of the function being called.
// - [optional] params <any> : mandatory for request and hello commands.
// - [optional] result (success|error) : mandatory for response.
//
// The args for the hello command is the set of routing rules for the new peer, as an array of:
//  { "host": ["function1", "function2", ...]}
//
// Routers exchange the same messages between themselves over BroadcastChannel. The only difference is
// that all broadcasted messages are received as the same 'shared.localhost' host so the origin host is
// added as the host property by the sender.

// The bridge manages the communication with the main window, and relays
// request / response messages.
class Bridge {
  constructor() {
    this.origin = "<unset>";
    this.callers = []; // The targets allowed to send requests to this bridge.
    this.port = null;

    this.channel = new BroadcastChannel("xac");
    window.addEventListener("message", this);
    this.channel.addEventListener("message", this);
  }

  log(msg) {
    console.log(`XAC_Bridge[${this.origin}] ${msg}`);
  }

  error(msg) {
    console.error(`XAC_Bridge[${this.origin}] ${msg}`);
  }

  handleEvent(event) {
    let host =
      event.origin == "chrome://system"
        ? "system"
        : new URL(event.origin).hostname;

    // Broadcasted messages all come from the same origin.
    if (host === "shared.localhost") {
      host = event.data.host;
    }

    const command = event.data.command;
    // this.log(`message: '${command}' from ${host}`);

    if (command === "hello") {
      this.origin = host;
      this.port = event.ports[0];
      this.onHello(event.data);
    } else if (command === "request") {
      this.onRequest(event.data);
    } else if (command === "bridge-request") {
      this.onBridgeRequest(event.data);
    } else if (command === "response") {
      this.onResponse(event.data);
    } else if (command === "bridge-response") {
      this.onBridgeResponse(event.data);
    } else {
      this.error(`Unsupported command: ${command}`);
    }
  }

  // hello command
  onHello(data) {
    this.callers = data.callers;
    this.port.postMessage({ command: "router-ready" });
  }

  // Sending a request on behalf of the peer attached to this bridge.
  // data is:
  // { target, fn, params }
  onRequest(data) {
    let target = data.target;
    if (!target) {
      this.error(`Missing target in request ${data.fn}`);
      return;
    }

    data.command = "bridge-request";
    this.channel.postMessage(data);
  }

  // Relay the response to other bridges.
  onResponse(data) {
    data.command = "bridge-response";
    this.channel.postMessage(data);
  }

  // Receiving a request from another peer.
  onBridgeRequest(data) {
    if (data.target !== this.origin) {
      return;
    }

    // Relay to the peer side.
    this.port.postMessage(data);
  }

  // Relay the response from another peer for some request.
  onBridgeResponse(data) {
    this.port.postMessage(data);
  }
}

const bridge = new Bridge();
