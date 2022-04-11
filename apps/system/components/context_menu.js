// Represents a <context-menu> dialog.
// Example of context menu data:
// {
//   systemTargets: [
//     {
//       nodeName: "IMG",
//       data: {
//         uri:
//           "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Antiochos_XI_%28transparent%29.png/132px-Antiochos_XI_%28transparent%29.png",
//         documentURI: "https://en.m.wikipedia.org/wiki/Main_Page",
//       },
//     },
//     {
//       nodeName: "A",
//       data: {
//         uri:
//           "https://en.m.wikipedia.org/wiki/File:Antiochos_XI_(transparent).png",
//         documentURI: "https://en.m.wikipedia.org/wiki/Main_Page",
//         text: "",
//       },
//     },
//   ],
//   contextmenu: null,
//   clientX: 93,
//   clientY: 432,
//   screenX: 93,
//   screenY: 432,
// }

// {
//   systemTargets: [
//     {
//       nodeName: "A",
//       data: {
//         uri: "https://arxiv.org/abs/2112.05131",
//         documentURI: "https://news.ycombinator.com/item?id=29698276",
//         text: "https://arxiv.org/abs/2112.05131",
//       },
//     },
//   ],
//   contextmenu: {
//     type: "menu",
//     customized: false,
//     items: [{ id: "copy-link" }],
//   },
//   clientX: 165,
//   clientY: 404,
//   screenX: 233,
//   screenY: 461,
// };

class ContextMenu extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    <link rel="stylesheet" href="components/context_menu.css">
    <sl-dialog no-header>
      <sl-menu>
        <sl-menu-label class="when-image"><sl-icon name="image"></sl-icon><span data-l10n-id="image-section-title"></span></sl-menu-label>
        <sl-menu-item class="when-image" data-l10n-id="image-set-wallpaper"></sl-menu-item>
        <sl-menu-item class="when-image" data-l10n-id="image-download"></sl-menu-item>
        <sl-menu-item class="when-image" data-l10n-id="image-share" disabled></sl-menu-item>
        <sl-divider class="when-image-and-link"></sl-divider>
        <sl-menu-label class="when-link"><sl-icon name="link"></sl-icon><span data-l10n-id="link-section-title"></span></sl-menu-label>
        <sl-menu-item class="when-link" data-l10n-id="link-new-tab"></sl-menu-item>
      </sl-menu>
    </sl-dialog>`;

    document.l10n.translateFragment(shadow);

    shadow.querySelector(
      "sl-menu-item[data-l10n-id=image-set-wallpaper]"
    ).onclick = () => {
      this.close();
      actionsDispatcher.dispatch("set-wallpaper", this.imageUrl);
    };

    shadow.querySelector(
      "sl-menu-item[data-l10n-id=image-download]"
    ).onclick = () => {
      this.close();
      this.webView.download(this.imageUrl);
    };

    shadow.querySelector("sl-menu-item[data-l10n-id=link-new-tab]").onclick =
      () => {
        this.close();
        window.wm.openFrame(this.linkUrl, { activate: true });
      };

    this.dialog = shadow.querySelector("sl-dialog");
  }

  close() {
    this.dialog.hide();
  }

  open(data, webView) {
    if (!data) {
      console.error(`ContextMenu: no data!`);
      return;
    }

    this.webView = webView;

    // Check the context menu data to decide which sections to show.
    this.imageUrl = null;
    this.linkUrl = null;

    let hasImage = false;
    let hasLink = false;
    data.systemTargets?.forEach((item) => {
      if (item.nodeName === "IMG") {
        hasImage = true;
        this.imageUrl = item.data?.uri;
      } else if (item.nodeName === "A") {
        hasLink = true;
        this.linkUrl = item.data?.uri;
      }
    });

    this.shadowRoot.querySelectorAll(".when-image").forEach((item) => {
      if (hasImage) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
    this.shadowRoot.querySelectorAll(".when-link").forEach((item) => {
      if (hasLink) {
        item.classList.remove("hidden");
      } else {
                item.classList.add("hidden");
      }
    });

    this.shadowRoot.querySelectorAll(".when-image-and-link").forEach((item) => {
      if (hasImage && hasLink) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });

    if (!hasImage && !hasLink) {
      console.error(`ContextMenu: No image or link found!`);
      return;
    }
    this.dialog.show();
  }
}

customElements.define("context-menu", ContextMenu);
