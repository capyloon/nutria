// The <action-widget> custom element.

class ActionWidget extends HTMLElement {
  constructor(data) {
    super();

    this.init(data);
  }

  // data = { url }
  init(data) {
    this.url = data.url;
  }

  connectedCallback() {
    this.innerHTML = `
      <web-view src="${this.url}"></web-view>
      `;
    let webView = this.querySelector("web-view");
    webView.openWindowInfo = null;
  }

  disconnectedCallback() {}

  animate(value) {
    try {
      let animated = this.querySelector("web-view");
      if (value) {
        animated.classList.add("animate");
      } else {
        animated.classList.remove("animate");
      }
    } catch (e) {
      console.error(`action_widget::animate() error: ${e}`);
    }
  }
}

customElements.define("action-widget", ActionWidget);
