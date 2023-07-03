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
        <sl-menu-item class="when-selection" data-l10n-id="selection-share"></sl-menu-item>
        <sl-divider class="when-image-or-link"></sl-divider>
        <sl-menu-label class="when-image"><sl-icon name="image"></sl-icon><span data-l10n-id="image-section-title"></span></sl-menu-label>
        <sl-menu-item class="when-image" data-l10n-id="image-set-wallpaper"></sl-menu-item>
        <sl-menu-item class="when-image" data-l10n-id="image-download"></sl-menu-item>
        <sl-menu-item class="when-image" data-l10n-id="image-new-tab"></sl-menu-item>
        <sl-menu-item class="when-image" data-l10n-id="image-share"></sl-menu-item>
        <sl-divider class="when-image-and-link"></sl-divider>
        <sl-menu-label class="when-link"><sl-icon name="link"></sl-icon><span data-l10n-id="link-section-title"></span></sl-menu-label>
        <sl-menu-item class="when-link" data-l10n-id="link-copy"></sl-menu-item>
        <sl-menu-item class="when-link" data-l10n-id="link-download"></sl-menu-item>
        <sl-menu-item class="when-link" data-l10n-id="link-new-tab"></sl-menu-item>
        <sl-menu-item class="when-link" data-l10n-id="link-new-private-tab"></sl-menu-item>
        <sl-menu-item class="when-link" data-l10n-id="link-share"></sl-menu-item>
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

    shadow.querySelector("sl-menu-item[data-l10n-id=image-new-tab]").onclick =
      () => {
        this.openUrlInNewTab(this.imageUrl);
      };

    shadow.querySelector("sl-menu-item[data-l10n-id=image-share]").onclick =
      () => {
        this.shareImage(this.imageUrl);
      };

    shadow.querySelector("sl-menu-item[data-l10n-id=link-new-tab]").onclick =
      () => {
        this.openUrlInNewTab(this.linkUrl);
      };

    shadow.querySelector(
      "sl-menu-item[data-l10n-id=link-new-private-tab]"
    ).onclick = () => {
      this.openUrlInNewPrivateTab(this.linkUrl);
    };

    shadow.querySelector("sl-menu-item[data-l10n-id=link-share]").onclick =
      () => {
        this.shareLink(this.linkUrl);
      };

    shadow.querySelector("sl-menu-item[data-l10n-id=link-download]").onclick =
      () => {
        this.close();
        this.contentWindow.webView.download(this.linkUrl);
      };

    shadow.querySelector("sl-menu-item[data-l10n-id=link-copy]").onclick =
      () => {
        this.close();
      };
    shadow.querySelector("sl-menu-item[data-l10n-id=link-copy]").onclick =
      async (event) => {
        this.close();
        navigator.clipboard.writeText(this.linkUrl).then(
          async () => {
            let msg = await window.utils.l10n("link-copied");
            window.toaster.show(msg);
          },
          (err) => {
            this.error(
              `Failure copying '${this.linkUrl}' to the clipboard: ${err}`
            );
          }
        );
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
      this.dialog.addEventListener(
        "sl-after-hide",
        () => {
          window.utils.randomSearchEngineUrl(this.selectedText).then((url) => {
            wm.openFrame(url, {
              activate: true,
              details: { search: this.selectedText },
            });
          });
        },
        { once: true }
      );
      this.close();
    };

    shadow.querySelector("sl-menu-item[data-l10n-id=selection-share]").onclick =
      (event) => {
        this.dialog.addEventListener(
          "sl-after-hide",
          () => {
            try {
              let activity = new WebActivity("share", {
                text: this.selectedText,
              });
              activity.start();
            } catch (e) {
              console.error(e);
            }
          },
          { once: true }
        );
        this.close();
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

  openUrlInNewTab(url) {
    this.dialog.addEventListener(
      "sl-after-hide",
      () => {
        window.wm.openFrame(url, { activate: true });
      },
      { once: true }
    );
    this.close();
  }

  openUrlInNewPrivateTab(url) {
    this.dialog.addEventListener(
      "sl-after-hide",
      () => {
        window.wm.openFrame(url, {
          activate: true,
          details: { privatebrowsing: true },
        });
      },
      { once: true }
    );
    this.close();
  }

  async shareImage(url) {
    this.dialog.addEventListener(
      "sl-after-hide",
      async () => {
        try {
          let uri = new URL(url);
          let blob = await this.contentWindow.webView.fetchAsBlob(url);
          let activity = new WebActivity("share", {
            type: blob.type.split("/")[0],
            blob,
            name: uri.pathname.split("/").reverse()[0],
          });
          activity.start();
        } catch (e) {
          console.error(e);
        }
      },
      { once: true }
    );
    this.close();
  }

  async shareLink(url) {
    this.dialog.addEventListener(
      "sl-after-hide",
      () => {
        try {
          let activity = new WebActivity("share", {
            url,
          });
          activity.start();
        } catch (e) {
          console.error(e);
        }
      },
      { once: true }
    );
    this.close();
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

    // If the document is a SVG image, set hasImage.
    // TODO: rely on the actual document mime type, not the extension.
    if (data.pageUrl?.endsWith(".svg")) {
      hasImage = true;
      this.imageUrl = data.pageUrl;
    }

    // Selection management.
    let hasSelection =
      data.selectionInfo &&
      data.selectionInfo.text?.length &&
      !data.selectionInfo.docSelectionIsCollapsed;

    // Check if we got a link url from the selected text.
    if (data.selectionInfo?.linkURL) {
      hasLink = true;
      this.linkUrl = data.selectionInfo?.linkURL;
    }

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
