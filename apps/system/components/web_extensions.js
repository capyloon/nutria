// The custom element representing a browser action in the quick settings panel.
// The `action` object looks like:
//   {
//     "title": "uBlock Origin",
//     "icon": {
//       "16": "moz-extension://58391724-3fe3-4e16-9eb6-5f1bddd13a41/img/icon_16.png",
//       "32": "moz-extension://58391724-3fe3-4e16-9eb6-5f1bddd13a41/img/icon_32.png"
//     },
//     "popup": "moz-extension://58391724-3fe3-4e16-9eb6-5f1bddd13a41/popup-fenix.html",
//     "badgeText": "",
//     "badgeBackgroundColor": [217, 0, 0, 255],
//     "badgeTextColor": null,
//     "enabled": true
//   }
//

function extColorAsCss(color) {
  if (!color) {
    return "currentDefault";
  }
  if (typeof color === "string") {
    return color;
  }
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
}

export class BrowserAction extends LitElement {
  constructor(extensionId, tabId, action) {
    super();
    this.extensionId = extensionId;
    this.tabId = tabId;

    this.setAction(action);
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        align-items: center;
        padding: 0.35em;
      }

      :host(.disabled) {
        filter: grayscale(100%);
      }

      :host img {
        width: 2em;
        padding-right: 0.5em;
      }

      :host span.title {
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      :host span.badge {
        font-size: smaller;
        padding: 0.25em 0.5em;
        border-radius: 0.5em;
      }
    `;
  }

  static get properties() {
    return {
      title: { attribute: false },
      icon: { attribute: false },
      badgeText: { attribute: false },
      color: { attribute: false },
      backgroundColor: { attribute: false },
    };
  }

  setAction(action) {
    if (!action) {
      return;
    }

    // Kind of a hack, used as a public access to the latest action value.
    // TODO: turn into a getter.
    this.action = action;

    this.title = action.title;
    this.badgeText = action.badgeText;

    this.color = extColorAsCss(action.badgeTextColor);
    this.backgroundColor =
      action.badgeText.length > 0
        ? extColorAsCss(action.badgeBackgroundColor)
        : "transparent";

    if (action.enabled) {
      this.classList.remove("disabled");
    } else {
      this.classList.add("disabled");
    }

    // Find the best icon.
    this.icon = "resources/logo-b2g.webp";
    if (!action.icon) {
      return;
    }
    if (typeof action.icon === "string") {
      this.icon = action.icon;
    } else {
      let max = 0;
      let icons = action.icon;
      for (let prop in icons) {
        if (prop > max) {
          max = prop;
          this.icon = icons[prop];
        }
      }
    }
  }

  render() {
    return html`
      <img src=${this.icon} />
      <span class="title">${this.title}</span>
      <span
        class="badge"
        style="color: ${this.color}; background-color: ${this.backgroundColor}"
      >
        ${this.badgeText}
      </span>
    `;
  }
}

customElements.define("browser-action", BrowserAction);
