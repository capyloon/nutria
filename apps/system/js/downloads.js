// Download manager.
// Once a download ends, we import the file in the content manager.

class Downloads {
  constructor() {
    this.log(`constructor`);

    navigator.b2g.downloadManager.addEventListener("downloadstart", this);
  }

  log(msg) {
    console.log(`Downloads: ${msg}`);
  }

  dumpDownload(download) {
    this.log(`${download.state} ${download.url} -> ${download.path}`);
  }

  async showNotification(download) {
    let title = await window.utils.l10n(
      `download-notification-title-${download.state}`
    );
    let notification = new Notification(title, {
      body: download.url,
      icon: `lucide-icon:download`,
      tag: download.id,
    });
    return notification;
  }

  async saveDownload(download) {
    let container = await contentManager.ensureTopLevelContainer("downloads");
    let svc = await contentManager.getService();
    let meta = await svc.importFromPath(container, download.path, true);
    // this.log(`Saved as ${JSON.stringify(meta)}`);
    navigator.b2g.downloadManager.remove(download);
  }

  handleEvent(event) {
    this.log(`event ${event.type}`);

    let download = event.download;
    this.dumpDownload(download);

    if (event.type === "downloadstart") {
      download.addEventListener("statechange", this);
      this.showNotification(download);
    } else if (event.type === "statechange") {
      this.showNotification(download);
      if (download.state === "succeeded") {
        download.removeEventListener("statechange", this);
        this.saveDownload(download);
      }
    }
  }
}

const downloadManager = new Downloads();
