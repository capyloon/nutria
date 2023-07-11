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

const port = window.config.port;

window.config.brandLogo = `http://branding.localhost:${port}/resources/logo.webp`;

function addStylesheet(url) {
  let link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", url);
  document.head.appendChild(link);
}

function addSharedStylesheet(url) {
  return addStylesheet(`http://shared.localhost:${port}/${url}`);
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
  return loadScript(`http://shared.localhost:${port}/${url}`);
}

// preconnect to the api daemon api server.
let link = document.createElement("link");
link.setAttribute("rel", "preconnect");
link.setAttribute("href", `http://127.0.0.1:${port}`);
document.head.appendChild(link);

// preconnect to the homescreen.
let link2 = document.createElement("link");
link2.setAttribute("rel", "preconnect");
link2.setAttribute("href", `http://homescreen.localhost:${port}`);
document.head.appendChild(link2);

// Hack to force GMPProvider to initialize now because it needs a locale bundle
// which triggers a gecko-Fluent race condition when using http:// file sources :(
(function () {
  Services.obs.notifyObservers(null, "force-gmp-provider-startup", null);
})();

// Load the branding style
addStylesheet(`http://branding.localhost:${port}/style/branding.css`);

// Register system and branding locales.
L10nRegistry.getInstance().registerSources([
  new L10nFileSource(
    "system-locale",
    "system-app",
    ["en-US"],
    "chrome://system/content/locales/{locale}/"
  ),
  new L10nFileSource(
    "branding",
    "system-app",
    ["en-US"],
    `http://branding.localhost:${port}/locales/{locale}/`
  ),
]);

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

class Toaster {
  createToaster() {
    let toaster = document
      .getElementById("toaster-template")
      .content.firstElementChild.cloneNode(true);

    let icon = toaster.querySelector("sl-icon");
    let message = toaster.querySelector("strong");
    return { toaster, icon, message };
  }

  // Allowed values for kind: "primary", "success", "neutral", "warning", "danger"
  show(text, kind = "primary") {
    let { toaster, icon, message } = this.createToaster();

    if (
      !["primary", "success", "neutral", "warning", "danger"].includes(kind)
    ) {
      console.error(`Unsupported toast kind: ${kind}`);
      return;
    }

    toaster.variant = kind;
    let icons = {
      primary: "info",
      success: "check-circle",
      neutral: "info",
      warning: "alert-triangle",
      danger: "alert-circle",
    };
    icon.name = icons[kind];

    message.textContent = text;
    document.body.appendChild(toaster).toast();
  }
}

window.toaster = new Toaster();
