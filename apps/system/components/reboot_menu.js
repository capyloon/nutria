// Reboot menu component.

class RebootMenu extends HTMLElement {
  constructor() {
    super();

    this.isOpen = false;

    let shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
    <link rel="stylesheet" href="components/reboot_menu.css">
    <div>
        <div class="shutdown">
            <lucide-icon kind="power"></lucide-icon>
            <span data-l10n-id="action-shutdown"></span>
        </div>
        <div class="reboot">
            <lucide-icon kind="refresh-cw"></lucide-icon>
            <span data-l10n-id="action-reboot"></span>
        </div>
        <div class="screenshot">
            <lucide-icon kind="smartphone"></lucide-icon>
            <span data-l10n-id="action-screenshot"></span>
        </div>
    </div>
    `;

    shadow.querySelector(".shutdown").addEventListener("click", () => {
      this.close();
      actionsDispatcher.dispatch("action-shutdown");
    });
    shadow.querySelector(".reboot").addEventListener("click", () => {
      this.close();
      actionsDispatcher.dispatch("action-reboot");
    });

    actionsDispatcher.addListener("printscreen-short-press", () => {
      console.log(`Got printscreen-short-press`);
      this.takeScreenshot();
    });

    shadow.querySelector(".screenshot").addEventListener("click", async () => {
      this.close();
      this.takeScreenshot();
    });

    document.l10n.translateFragment(shadow);
  }

  async takeScreenshot() {
    console.log(`takeScreenshot`)
    let file = embedder.takeScreenshot();

    let now = new Date();
    now = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    // Format the date such as: 2020-10-02-16-23-40
    const filename = `${now
      .toISOString()
      .slice(0, -5)
      .replace(/[:T]/g, "-")}.png`;

    let container = await contentManager.ensureTopLevelContainer("screenshots");

    // console.log(`Screenshot container is ${container}, adding ${filename}`);

    contentManager.create(container, filename, file).then(
      async () => {
        console.log(`Screenshot saved in screenshots/${filename}`);
        let msg = await window.utils.l10n("screenshot-saved-success", {
          filename: `screenshots/${filename}`,
        });
        window.toaster.show(msg, "success");
      },
      async (error) => {
        console.error(`Error saving file: ${JSON.stringify(error)}`);
        let msg = await window.utils.l10n("screenshot-saved-error", {
          error: JSON.stringify(error),
        });
        window.toaster.show(msg, "danger");
      }
    );
  }

  open() {
    backdropManager.show("reboot-menu", true);
    this.isOpen = true;
  }

  close() {
    backdropManager.hide("reboot-menu");
    this.isOpen = false;
  }
}

customElements.define("reboot-menu", RebootMenu);
