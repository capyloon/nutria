function postActivityResult(result) {
  const iframeSwProxy = window.document.getElementById("sw-proxy");
  const proxySrc = iframeSwProxy.src;
  iframeSwProxy.contentWindow.postMessage(
    { type: "activity-result", ...result },
    proxySrc
  );
}

let keepSWStateInterval;
function postKeepaliveMessage() {
  keepSWStateInterval = setInterval(() => {
    // service worker alive -> idle timeout is 30000ms,
    // post a dummy message to keep service worker alive
    const result = {
      isKeepalive: true,
    };
    postActivityResult(result);
  }, 25000); // less than 30000ms
}

function cancelKeepaliveMessage() {
  if (keepSWStateInterval) {
    clearInterval(keepSWStateInterval);
    keepSWStateInterval = null;
  }
}

window.addEventListener("serviceworkermessage", ({ detail }) => {
  const { category, type, data } = detail;
  if (category === "systemmessage" && type === "activity") {
    const { activityId, source } = data;
    switch (source.name) {
      case "publish-resource":
        actionsDispatcher.dispatch("publish-resource", source.data.id);
        break;
      case "publish-to-ipfs":
        actionsDispatcher.dispatch("publish-to-ipfs", source.data);
        break;
      case "install-tile":
        console.log(`TILE: install-tile ${source.data.manifestUrl}`);
        registerTile(source.data.manifestUrl).then((activityResult) => {
          postActivityResult({ activityId, activityResult });
        });
        break;
      case "open-about":
        let url = source.data.url.toLowerCase();
        if (url.startsWith("about:")) {
          window.wm.openAbout(url);
        } else {
          console.error(`Invalid about: url: ${url}`);
        }
        break;
      default:
        console.error(`Unexpected system app activity name: ${source.name}`);
        break;
    }
  } else if (category === "systemmessage" && type === "activity_keepalive") {
    console.log("activity_keepalive: ", data);
    if (data === "start") {
      postKeepaliveMessage();
    } else if (data === "stop") {
      cancelKeepaliveMessage();
    }
  }
});
