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
    <div class="container">
        <section class="image">
        <h4><lucide-icon kind="image"></lucide-icon><span data-l10n-id="image-section-title"></span></h4>
        <ul>
            <li data-l10n-id="image-set-wallpaper"></li>
            <li data-l10n-id="image-save"></li>
            <li data-l10n-id="image-share"></li>
        </ul>
        </section>
        <section class="link">
        <h4><lucide-icon kind="link"></lucide-icon><span data-l10n-id="link-section-title"></span></h4>
        <ul>
            <li data-l10n-id="link-new-tab"></li>
        </ul>
        </section>
    </div>
    `;

    document.l10n.translateFragment(shadow);

    this.imageSection = shadow.querySelector("section.image");
    this.linkSection = shadow.querySelector("section.link");

    shadow.querySelector("li[data-l10n-id=image-set-wallpaper]").onclick =
      () => {
        this.close();
        actionsDispatcher.dispatch("set-wallpaper", this.imageUrl);
      };

    shadow.querySelector("li[data-l10n-id=link-new-tab]").onclick = () => {
      this.close();
      window.wm.openFrame(this.linkUrl, { activate: true });
    };
  }

  close() {
    backdropManager.hide("context-menu");
  }

  open() {
    // Check the context menu data to decide which sections to show.
    if (!this.data) {
      return;
    }

    this.imageUrl = null;
    this.linkUrl = null;

    let hasImage = false;
    let hasLink = false;
    this.data.systemTargets?.forEach((item) => {
      if (item.nodeName === "IMG") {
        hasImage = true;
        this.imageUrl = item.data?.uri;
      } else if (item.nodeName === "A") {
        hasLink = true;
        this.linkUrl = item.data?.uri;
      }
    });

    this.imageSection.hidden = !hasImage;
    this.linkSection.hidden = !hasLink;

    if (!hasImage && !hasLink) {
      return;
    }

    backdropManager.show("context-menu", true);
    this.data = null;
  }

  setData(data) {
    this.data = data;
  }
}

customElements.define("context-menu", ContextMenu);
