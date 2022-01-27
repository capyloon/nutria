// A factory to load panels in an iframe.
class IframePanelFactory {
  log(msg) {
    console.log(`IframePanel: ${msg}`);
  }

  open(name) {
    if (!this.iframe) {
      this.iframe = document.createElement("iframe");
      this.iframe.setAttribute("id", "panel");
      document.body.appendChild(this.iframe);
    }
    this.iframe.contentWindow.location.replace(`./panels/${name}/index.html`);
    this.log(`loading panel from ./panels/${name}/index.html`);
    this.iframe.classList.add("open");
  }

  hide() {
    if (this.iframe) {
      this.iframe.classList.remove("open");
      this.iframe.src = "about:blank";
    }
  }
}

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    await depGraphLoaded;
    let resolved = await getSharedDeps([
      "panel manager",
      "shared-fluent",
      "shared-icons",
    ]);

    let PanelManager = resolved[0].get("panel manager").PanelManager;
    let panelManager = new PanelManager(new IframePanelFactory(), "panel-link");
    panelManager.processLocation();
  },
  { once: true }
);
