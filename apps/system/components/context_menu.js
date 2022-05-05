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
//   pageUrl: "https://example.com",
//   selectionInfo: {"text":"","docSelectionIsCollapsed":true,"isDocumentLevelSelection":true,"linkURL":null,"linkText":""}"
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

// Triggers a search using a randomly selected search engine.
// TODO: abstract that and share some with the site info panel.
async function searchFor(text) {
  let openSearch = contentManager.getOpenSearchManager((items) => {
    // Remove items that are not enabled.
    items = items.filter((item) => {
      let meta = item.meta;
      return meta.tags.includes("enabled");
    });

    // Pick one search engine.
    let engine = items[Math.round(Math.random() * items.length)];
    let desc = engine.variant("default").OpenSearchDescription;

    // Replace the text in the searchTerms.
    let urls = desc.Url;
    if (!Array.isArray(urls)) {
      urls = [urls];
    }
    let found = urls.find((item) => item._attributes.type == "text/html");
    if (!found) {
      return;
    }
    let template = found._attributes.template;
    let encoded = encodeURIComponent(text).replace(/[!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
    let url = template.replace("{searchTerms}", encoded);

    wm.openFrame(url, { activate: true, details: { search: text } });
  });
  await openSearch.init();
}

class ContextMenu extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    <link rel="stylesheet" href="components/context_menu.css">
    <sl-dialog no-header>
      <sl-menu>
        <sl-menu-label><sl-icon name="file"></sl-icon><span data-l10n-id="page-section-title"></span></sl-menu-label>
        <sl-menu-item data-l10n-id="page-save-as-pdf"></sl-menu-item>
        <sl-divider class="when-selection"></sl-divider>
        <sl-menu-label class="when-selection"><sl-icon name="type"></sl-icon><span data-l10n-id="selection-section-title"></span></sl-menu-label>
        <sl-menu-item class="when-selection" data-l10n-id="selection-copy"></sl-menu-item>
        <sl-menu-item class="when-selection" data-l10n-id="selection-search"></sl-menu-item>
        <sl-divider class="when-image-or-link"></sl-divider>
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

    shadow.querySelector("sl-menu-item[data-l10n-id=image-download]").onclick =
      () => {
        this.close();
        this.contentWindow.webView.download(this.imageUrl);
      };

    shadow.querySelector("sl-menu-item[data-l10n-id=link-new-tab]").onclick =
      () => {
        this.close();
        window.wm.openFrame(this.linkUrl, { activate: true });
      };

    shadow.querySelector(
      "sl-menu-item[data-l10n-id=page-save-as-pdf]"
    ).onclick = () => {
      this.close();
      this.contentWindow.saveAsPDF();
    };

    shadow.querySelector(
      "sl-menu-item[data-l10n-id=selection-search]"
    ).onclick = (event) => {
      this.close();
      searchFor(this.selectedText);
    };

    shadow.querySelector("sl-menu-item[data-l10n-id=selection-copy]").onclick =
      async (event) => {
        this.close();
        navigator.clipboard.writeText(this.selectedText).then(
          async () => {
            let msg = await window.utils.l10n("text-share-copied");
            window.toaster.show(msg);
          },
          (err) => {
            this.error(
              `Failure copying '${this.selectedText}' to the clipboard: ${err}`
            );
          }
        );
      };

    this.dialog = shadow.querySelector("sl-dialog");
  }

  close() {
    this.dialog.hide();
  }

  open(data, contentWindow) {
    if (!data) {
      console.error(`ContextMenu: no data!`);
      return;
    }

    this.contentWindow = contentWindow;

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

    // Selection management.
    let hasSelection =
      data.selectionInfo &&
      data.selectionInfo.text?.length &&
      !data.selectionInfo.docSelectionIsCollapsed;

    // If the JS character after our truncation point is a trail surrogate,
    // include it in the truncated string to avoid splitting a surrogate pair.
    if (hasSelection) {
      let selectedText = window.utils.truncateSearch(data.selectionInfo.text);
      // Set the l10n parameter.
      let node = this.shadowRoot.querySelector(
        "sl-menu-item[data-l10n-id=selection-search]"
      );
      node.setAttribute(
        "data-l10n-args",
        JSON.stringify({ query: selectedText })
      );
      document.l10n.translateFragment(node);

      this.selectedText = data.selectionInfo.fullText;
    }

    this.shadowRoot.querySelectorAll(".when-selection").forEach((item) => {
      if (hasSelection) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
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

    this.shadowRoot.querySelectorAll(".when-image-or-link").forEach((item) => {
      if (hasImage || hasLink) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });

    this.dialog.show();
  }
}

customElements.define("context-menu", ContextMenu);
