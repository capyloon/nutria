// WebExtensions delegate implementation.

export class WebExtensionsDelegate {
  constructor() {
    this.log(`constructor`);

    this.queuedBrowserActions = [];

    let container = document.querySelector("quick-settings");
    container.addEventListener("quick-settings-connected", () => {
      this.queuedBrowserActions.forEach(
        ({ extensionId, browsingContextGroupId, tabId, action }) => {
          this.updateBrowserAction(
            extensionId,
            browsingContextGroupId,
            tabId,
            action
          );
        }
      );
      this.queuedBrowserActions = [];
    });
  }

  log(msg) {
    console.log(`WebExtensionsDelegate: ${msg}`);
  }

  error(msg) {
    console.error(`WebExtensionsDelegate: ${msg}`);
  }

  permissionPrompt(extension) {
    this.log(`permissionPrompt`);
    // TODO: Install prompt UI.
    return Promise.resolve();
  }

  setProvider(provider) {
    this.log(`setProvider`);
    this.provider = provider;
  }

  // BrowserAction support.
  updateBrowserAction(extensionId, browsingContextGroupId, tabId, action) {
    this.log(`updateBrowserAction ${extensionId}`);

    let container = document.querySelector("quick-settings");
    if (!container?.getBrowserAction) {
      this.error(`browserAction panel not ready yet!`);
      this.queuedBrowserActions.push({
        extensionId,
        browsingContextGroupId,
        tabId,
        action,
      });
      return;
    }

    let baNode = container.getBrowserAction(extensionId);
    if (baNode) {
      // Update existing node.
      baNode.setAction(action);
    } else {
      this.log(`Creating new browser action, badgeText=${action?.badgeText}`);
      let node = new BrowserAction(extensionId, tabId, action);
      container.addBrowserAction(extensionId, node);
      node.addEventListener("click", () => {
        if (!node.action.enabled) {
          return;
        }
        this.log(`click on ${extensionId}`);
        if (action.popup) {
          // Open the modal browser action popup.
          let popup = document.querySelector("webext-browser-action");
          popup.setAction(node.action, browsingContextGroupId);
          popup.show();
        } else {
          // Dispatch a click event.
          this.provider?.browserActionClick(extensionId);
        }
      });
    }
  }

  // Tabs support.

  // Create a new tab with a url. Parameters are:
  // extensionId,
  // createProperties: {
  //   active,
  //   cookieStoreId,
  //   discarded,
  //   index,
  //   openInReaderMode,
  //   pinned,
  //   url,
  // },
  async createNewTab({
    /*extensionId, browsingContextGroupId,*/ createProperties,
  } = {}) {
    this.log(`createNewTab ${createProperties.url}`);
    try {
      // TODO: properly deal with more parameters.
      let webView = window.wm.openFrame(null, {
        activate: createProperties.active,
      });
      return webView;
    } catch (e) {
      console.error(`Failed to create frame: ${e}`);
    }
  }

  // nativeTab is the <web-view> element.
  // updateProperties is:
  // {
  //   active,
  //   autoDiscardable,
  //   highlighted,
  //   muted,
  //   pinned,
  //   url,
  // }
  async updateTab({ nativeTab, extensionId, updateProperties } = {}) {
    this.log(`updateTab`);
    // Supported actions are:
    // - setting `active` to `true`.
    // Note: changing the url is handled by the calling code already.
    if (updateProperties.active === true) {
      window.wm.switchToWebView(nativeTab);
    }
  }
}
