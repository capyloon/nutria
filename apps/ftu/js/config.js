// We run on the default port on device.
const isDevice = location.port === "";

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

function loadScript(url, { defer, module } = { defer: false, module: false }) {
  let script = document.createElement("script");
  script.setAttribute("src", url);
  if (defer) {
    script.setAttribute("defer", "true");
  }
  if (module) {
    script.setAttribute("type", "module");
  }
  document.head.appendChild(script);
  return script;
}

function loadSharedScript(url, params) {
  return loadScript(`http://shared.localhost:${location.port}/${url}`, params);
}

// Add the branding localization
let link = document.createElement("link");
link.setAttribute("rel", "localization");
link.setAttribute(
  "href",
  `http://branding.localhost:${location.port}/locales/{locale}/branding.ftl`
);
document.head.appendChild(link);

// Add the branding style
addStylesheet(`http://branding.localhost:${location.port}/style/branding.css`);

// Load <link rel="stylesheet" href="style/{device|desktop}.css" />
addStylesheet(`/style/${isDevice ? "device" : "desktop"}.css`);

let depGraphLoaded = new Promise((resolve) => {
  loadSharedScript("js/dep_graph.js").onload = resolve;
});
