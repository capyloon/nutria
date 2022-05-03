// Download manager.
// Once a download ends, we import the file in the content manager.

class Downloads {
  constructor() {
    this.log(`constructor`);

    navigator.b2g.downloadManager.addEventListener("downloadstart", this);
    actionsDispatcher.addListener("import-download", async (_name, path) => {
      await this.import(path);
    });
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

    let data = {};

    if (download.state == "downloading") {
      if (download.totalBytes != 0) {
        data.progress = Math.round(
          (100 * download.currentBytes) / download.totalBytes
        );
      } else {
        // Indeterminate progress.
        data.progress = -1;
      }
    }

    let notification = new Notification(title, {
      body: download.url,
      icon: `system-icon:download`,
      tag: download.id,
      data,
    });
    return notification;
  }

  async saveDownload(download) {
    await this.import(download.path);
    navigator.b2g.downloadManager.remove(download);
  }

  // Import a file a given path into the downloads container.
  async import(path) {
    let container = await contentManager.ensureTopLevelContainer("downloads");
    let svc = await contentManager.getService();
    await svc.importFromPath(container, path, true);
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
