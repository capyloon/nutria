// <web-notification> web component
// Displays a single notification.

class WebNotification extends HTMLElement {
  constructor(notification) {
    super();

    this.notification = notification;
    this.attachShadow({ mode: "open" });
  }

  update(notification) {
    this.notification = notification;
    this.connectedCallback();
  }

  connectedCallback() {
    let data = this.notification.notification;
    // console.log(`YYY ${JSON.stringify(data)}`);

    let shadow = this.shadowRoot;

    let iconPart = `<img class="icon" src="${data.icon}" />`;
    if (data.icon.startsWith("system-icon:")) {
      iconPart = `<sl-icon class="icon" name=${data.icon.split(":")[1]}></sl-icon>`;
    }

    shadow.innerHTML = `
    <link rel="stylesheet" href="components/notification.css">
    <div class="notification">
        ${iconPart}
        <div class="center">
            <div class="title">${data.title}</div>
            <div class="text">${data.text}</div>
        </div>
        <sl-icon name="x" class="close-icon"></sl-icon>
    </div>
    `;

    shadow.querySelector(".icon").onclick = shadow.querySelector(
      ".center"
    ).onclick = (event) => {
      event.stopPropagation();
      this.notification.click();
      this.notification.remove();
      this.fadeOut();
      // Close the quick settings panel;
      document.getElementById("quick-settings").hide();
    };

    shadow.querySelector(".close-icon").onclick = (event) => {
      event.stopPropagation();
      this.notification.remove();
      this.fadeOut();
    };
  }

  fadeOut() {
    this.addEventListener(
      "transitionend",
      () => {
        this.remove();
      },
      { once: true }
    );
    this.classList.add("closing");
  }
}

customElements.define("web-notification", WebNotification);
