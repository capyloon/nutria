// We run on the default port on device.
const isDevice = location.port === "";

window.config = {
  isDevice,
  port: isDevice ? 80 : 8081,
};

function addLink(url) {
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
  return loadScript(`http://shared.localhost:${location.port}/${url}`);
}

// Load <link rel="stylesheet" href="style/{device|desktop}.css" />
addLink(`/style/${isDevice ? "device" : "desktop"}.css`);

// Load the shared style.
addLink(
  `http://shared.localhost:${window.config.port}/style/themes/default/theme.css`
);

let depGraphLoaded = new Promise((resolve) => {
  loadSharedScript("js/dep_graph.js").onload = resolve;
});
