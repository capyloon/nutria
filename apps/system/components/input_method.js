// <input-method> web component

class InputMethod extends HTMLElement {
  constructor() {
    super();

    this.loaded = false;
    // 1s timer used to delay deactivation. This avoids changing the state
    // needlessly when navigating from a field to another.
    this.timer = null;
  }

  connectedCallback() {
    this.innerHTML = `
    <link rel="stylesheet" href="components/input_method.css">
    <web-view
      remote="true"
      ignoreuserfocus="true"
      mozpasspointerevents="true"
      transparent="true">
    </web-view>
    <div class="padding"></div>
    `;
    this.webView = this.querySelector("web-view");
    this.webView.openWindowInfo = null;

    this.pid = this.webView.pid;
    this.webView.addEventListener(
      "processready",
      (event) => {
        this.pid = event.detail.processid;
      },
      { once: true }
    );
  }

  activate() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }

    this.activated = true;
    this.webView.active = true;
    if (this.pid != -1) {
      processManager.setForeground(this.pid);
    }
  }

  deactivate() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }

    this.timer = window.setTimeout(() => {
      this.webView.active = false;
      this.activated = false;
      if (this.pid != -1) {
        processManager.setBackground(this.pid);
      }
      this.timer = null;
    }, 1000 /* 1s delay */);
  }

  init() {
    if (!this.loaded) {
      let keyboardUrl = `http://keyboard.localhost:${config.port}/index.html`;
      this.webView.src = keyboardUrl;
      this.loaded = true;
    }
  }
}

customElements.define("input-method", InputMethod);
