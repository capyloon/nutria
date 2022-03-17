// <webext-browser-action> popup

// This can't be a LitElement because <web-view> doesn't work in a shadow root :(
class BrowserActionPopup extends HTMLElement {
  constructor() {
    super();
    this.action = null;
    this.browsingContextGroupId = null;

    console.log(`BrowserActionPopup::constructor`);
    this.addEventListener("click", (event) => {
      //   console.log(`BrowserActionPopup click on ${event.target.localName}`);
      if (event.target.localName === "sl-icon") {
        this.hide("webext-browser-action");
      }
    });

    actionsDispatcher.addListener("keyboard-opening", () => {
      this.classList.add("keyboard-open");
    });

    actionsDispatcher.addListener("keyboard-closing", () => {
      this.classList.remove("keyboard-open");
    });

    embedder.addSystemEventListener(
      "keyup",
      (event) => {
        if (event.key === "Escape" && !this.classList.contains("offscreen")) {
          this.hide();
        }
      },
      true
    );
  }

  show() {
    this.classList.remove("offscreen");
  }

  hide() {
    this.classList.add("offscreen");
    // Force closing the virtual keyboard if it was opened.
    inputMethod.close();
  }

  setAction(action, browsingContextGroupId) {
    console.log(`BrowserActionPopup::setAction action=${action}`);
    this.action = action;
    this.browsingContextGroupId = browsingContextGroupId;
    this.render();
  }

  render() {
    console.log(`BrowserActionPopup::render action=${this.action}`);
    if (!this.action) {
      return;
    }

    let action = new BrowserAction(0, 0, this.action);

    this.innerHTML = `
    <link rel="stylesheet" href="components/browser_action_popup.css">
    <div class="container">
      <web-view
        remote="true"
        remoteType="extension"
        browsingContextGroupId="${this.browsingContextGroupId}"></web-view>
      <footer><sl-icon name="x"></sl-icon></footer>
    </div`;

    this.querySelector("footer").prepend(action);
    let webView = this.querySelector("web-view");
    webView.openWindowInfo = null;
    webView.src = this.action.popup;
  }
}

customElements.define("webext-browser-action", BrowserActionPopup);
