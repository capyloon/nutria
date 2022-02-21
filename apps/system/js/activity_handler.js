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
      case "launch":
        let config = source.data;
        let details = {
          title: config.title,
          iconUrl: config.iconUrl,
          color: config.color,
          backgroundColor: config.backgroundColor,
        };
        wm.openFrame(config.url, { activate: true, details });
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
