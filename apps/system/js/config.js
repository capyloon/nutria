// Helper to set up device and desktop builds.

const { AppConstants } = ChromeUtils.import(
  "resource://gre/modules/AppConstants.jsm"
);
let isDevice = AppConstants.platform === "gonk";

window.config = {
  isDevice,
  port: isDevice ? 80 : 8081,
  powerKey: isDevice ? "Power" : "PowerOff",
};

function addStylesheet(url) {
  let link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", url);
  document.head.appendChild(link);
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

// preconnect to the api daemon api server.
let link = document.createElement("link");
link.setAttribute("rel", "preconnect");
link.setAttribute("href", `http://127.0.0.1:${window.config.port}`);
document.head.appendChild(link);

// preconnect to the homescreen.
let link2 = document.createElement("link");
link2.setAttribute("rel", "preconnect");
link2.setAttribute("href", `http://homescreen.localhost:${window.config.port}`);
document.head.appendChild(link2);

function depGraphLoaded() {
  return new Promise((resolve) => {
    loadSharedScript("js/dep_graph.js").onload = resolve;
  });
}

// A timer that will tick at every new minute.
// It fires a "tick" event when time is up.
class MinuteTimer extends EventTarget {
  constructor() {
    super();
    // console.log(`MinuteTimer::constructor`);
    this.suspended = false;
    this.schedule();
  }

  schedule() {
    // console.log(`MinuteTimer::schedule suspended=${this.suspended}`);
    if (this.suspended) {
      return;
    }

    let now = new Date();
    // 61 to help with triggering early during the next minute.
    let seconds = 61 - now.getSeconds();

    // console.log(`MinuteTimer: will tick in ${seconds}s`);

    this.nextTick = window.setTimeout(() => {
      this.dispatchEvent(new CustomEvent("tick"));
      this.nextTick = null;
      this.schedule();
    }, seconds * 1000);
  }

  suspend() {
    if (this.nextTick) {
      window.clearTimeout(this.nextTick);
      this.nextTick = null;
    }
    this.suspended = true;
  }

  resume() {
    if (!this.suspended) {
      return;
    }

    this.suspended = false;
    this.schedule();
  }
}
