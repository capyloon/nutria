// We run on the default port on device.
const isDevice = navigator.b2g?.telephony !== undefined;

window.config = {
  isDevice,
  port: isDevice ? 80 : 8081,
};

function addStylesheet(url) {
  let link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", url);
  document.head.appendChild(link);
  return link;
}

function loadScript(url, defer = false) {
  let script = document.createElement("script");
  script.setAttribute("src", url);
  if (defer) {
    script.setAttribute("defer", "true");
  }
  document.head.appendChild(script);
  return script;
}

function loadSharedScript(url) {
  return loadScript(`http://shared.localhost:${config.port}/${url}`);
}

let depGraphLoaded = new Promise((resolve) => {
  loadSharedScript("js/dep_graph.js").onload = resolve;
});
