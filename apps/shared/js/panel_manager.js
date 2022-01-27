// A small specialized router able to load the right content for these paths:
// /index.html : the main page.
// /panel/$panelName : the $panelName panel.

export class PanelManager {
  log(msg) {
    console.log(`PanelManager: ${msg}`);
  }

  constructor(panelFactory, selector) {
    this.panelFactory = panelFactory;
    window.addEventListener("popstate", this);

    document.body.querySelectorAll(selector).forEach((link) => {
      this.registerPanelLink(link);
    });
  }

  registerPanelLink(node) {
    // We can translate now that fluent is ready.
    if (typeof node.translate === "function") {
      node.translate();
    }

    // Ensure we remove previous event listener if any.
    node.removeEventListener("open", this);
    node.addEventListener("open", this);
  }

  handleEvent(event) {
    if (event.type === "open") {
      this.log(`Will open panel ${event.detail.name}`);
      if (event.detail.name) {
        this.openPanel(event.detail);
      } else {
        console.error(
          `Failed to get panel name from open event ${JSON.stringify(
            event.detail
          )}`
        );
      }
    } else if (event.type === "popstate") {
      this.log(
        `popstate history size=${history.length} location=${document.location}`
      );
      this.processLocation();
    } else {
      console.error(
        `Unexpected '${event.type}' event dispatched to PanelManager!`
      );
    }
  }

  processLocation() {
    this.log(`processLocation ${window.location}`);
    if (window.location.pathname == "/index.html" && !window.location.search) {
      // This is the main page.
      this.showHome();
    } else {
      this.maybeShowPanel();
    }
  }

  maybeShowPanel() {
    this.log(`maybeShowPanel ${window.location.search}`);
    let params = new URLSearchParams(window.location.search.substring(1));
    let name = params.get("panel");
    if (!name) {
      console.error(`Invalid panel routing url: ${window.location}`);
      return;
    }

    this.openPanel({ name });
  }

  openPanel(data) {
    let name = data.name;
    this.panelFactory.open(name, data.data);
    // this.log(`Before: history size=${history.length}`);
    history.pushState(name, name, `/index.html?panel=${name}`);
    // this.log(`After: history size=${history.length}`);
  }

  showHome() {
    this.log(`show Home ${window.location}`);
    this.panelFactory.hide();
  }
}
