function getErrorFromURI() {
  const uri = document.documentURI;

  // Quick check to ensure it's the URI format we're expecting.
  if (!uri.startsWith("about:neterror?")) {
    // A blank error will generate the default error message (no network).
    return uri;
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
      this.error.e = "invalidConnection";
      break;
  }

  return error;
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    document.getElementById("reload").onclick = () => {
      window.location.reload();
    };

    let error = getErrorFromURI();
    document.getElementById("view").textContent = error.d;
  },
  { once: true }
);
