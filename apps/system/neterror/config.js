async function detectPort() {
  let url = "http://system.localhost/neterror/config.js";
  try {
    await fetch(url);
  } catch (e) {
    return 8081;
  }
  return 80;
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
  return loadScript(`http://shared.localhost:${window.config.port}/${url}`);
}

function depGraphLoaded() {
  return new Promise((resolve) => {
    loadSharedScript("js/dep_graph.js").onload = resolve;
  });
}
