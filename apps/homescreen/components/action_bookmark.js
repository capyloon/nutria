// The <action-bookmark> custom element.

class ActionBookmark extends HTMLElement {
  constructor(data) {
    super();
    this.init(data);
  }

  // data = { icon, title, url }
  init(data) {
    this.data = data;
    this.icon =
      typeof data.icon == "string" ||
      Object.getPrototypeOf(data.icon) === URL.prototype
        ? data.icon
        : URL.createObjectURL(data.icon);
  }

  connectedCallback() {
    let data = this.data;
    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <link rel="stylesheet" href="components/action_bookmark.css">
      <img src="${this.icon}" alt="${data.title}"></img>
      <span>${data.title}</span>
      `;

    this.onclick = () => {
      let details = {
        title: data.title,
        icon: this.icon,
        backgroundColor: data.backgroundColor,
        display: data.display || "browser",
      };
      let encoded = encodeURIComponent(JSON.stringify(details));
      window.open(data.url, "_blank", `details=${encoded}`);
    };
  }

  disconnectedCallback() {
    if (this.icon.startsWith("blob")) {
      URL.revokeObjectURL(this.icon);
    }
  }

  animate(value) {
    try {
      let animated = this.shadowRoot.querySelector("img");
      if (value) {
        animated.classList.add("animate");
      } else {
        animated.classList.remove("animate");
      }
    } catch (e) {
      console.error(`action_bookmark::animate() error: ${e}`);
    }
  }
}

customElements.define("action-bookmark", ActionBookmark);
