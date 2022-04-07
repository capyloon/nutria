"use strict";

(function (window) {
  function log() {
    console.log("[swproxy][helper.js]", ...arguments);
  }

  log("init");
  const channel = new MessageChannel();
  channel.port1.onmessage = ({ data }) => {
    log("onmessage", data);
    window.dispatchEvent(
      new CustomEvent("serviceworkermessage", {
        detail: data,
      })
    );
  };

  let document = window.document;
  const iframeSwProxy = document.createElement("iframe");
  iframeSwProxy.setAttribute(
    "style",
    "display: none; position: absolute; top: 0; left: 0"
  );
  iframeSwProxy.setAttribute("id", "sw-proxy");
  const proxySrc = `http://system.localhost:${window.config.port}/swproxy/proxy.html`;
  iframeSwProxy.src = proxySrc;
  document.body.appendChild(iframeSwProxy);
  // post 'port-transfer' message when iframe is ready.
  // since the 'load' event won't fired when iframe src URL is invalid,
  // we use 'pageshow' event instead.
  // refs bug: https://bugzilla.mozilla.org/show_bug.cgi?id=444165
  iframeSwProxy.addEventListener(
    "pageshow",
    () => {
      iframeSwProxy.contentWindow.postMessage(
        { type: "port-transfer" },
        proxySrc,
        [channel.port2]
      );
    },
    { once: true }
  );
})(this);
