function getErrorFromURI() {
  const uri = document.documentURI;

  // Quick check to ensure it's the URI format we're expecting.
  if (!uri.startsWith("about:neterror?")) {
    // A blank error will generate the default error message (no network).
    return { d: uri };
  }

  // Small hack to get the URL object to parse the URI correctly.
  const url = new URL(uri.replace("about:", "http://"));

  let error = {};
  // Set the error attributes.
  ["e", "u", "m", "c", "d", "f"].forEach(function (v) {
    error[v] = url.searchParams.get(v);
  });

  switch (error.e) {
    case "connectionFailure":
    case "netInterrupt":
    case "netTimeout":
    case "netReset":
      error.e = "connectionFailed";
      break;

    case "unknownSocketType":
    case "unknownProtocolFound":
    case "cspFrameAncestorBlocked":
      error.e = "invalidConnection";
      break;
  }

  return error;
}

const kDeps = [
  {
    name: "main",
    kind: "virtual",
    deps: ["shoelace-button", "shoelace-light-theme", "shoelace-setup"],
  },
];

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    window.config = { port: await detectPort() };

    await depGraphLoaded();

    let graph = new ParallelGraphLoader(addShoelaceDeps(kDeps));
    await graph.waitForDeps("main");

    document.getElementById("reload").onclick = () => {
      window.location.reload();
    };

    let error = getErrorFromURI();
    document.getElementById("view").textContent = error.d;
  },
  { once: true }
);
