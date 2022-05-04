// Manages publication to IPFS of resources moved to the "shared on ipfs" folder.
// The publication process is as follows:
// - upload the "default" variant to an IPFS storage provider.
// - add a "hidden tag" with the ipfs url (.ipfs://...)
// - share the IPFS url and the default variant metadata (size, mimeType)

class IpfsPublisher {
  constructor(resource) {
    this.resource = resource;
  }

  log(msg) {
    console.log(`IpfsPublisher: ${msg}`);
  }

  error(msg) {
    console.error(`IpfsPublisher: ${msg}`);
  }

  updateNotification(data) {
    const iframeSwProxy = window.document.getElementById("sw-proxy");
    const proxySrc = iframeSwProxy.src;
    iframeSwProxy.contentWindow.postMessage(
      { type: "notification", notification: data },
      proxySrc
    );
  }

  async publish(blob) {
    let tag = `ipfs-publish_${this.resource.meta.id}`;
    let name = this.resource.meta.name;
    let title = await window.utils.l10n("ipfs-publish-title");
    let icon = "system-icon:upload";

    this.log(`Publish ${name} -> ${tag}`);

    // Get the Estuary key from the setting.
    let estuaryToken = null;
    try {
      let settings = await apiDaemon.getSettings();
      let setting = await settings.get("ipfs.estuary.api-token");
      this.log(`Estuary setting is ${JSON.stringify(setting)}`);
      estuaryToken = setting.value;
    } catch (e) {
      this.error(`Failed to get estuary token: ${e}`);
    }
    if (!estuaryToken) {
      let msg = await window.utils.l10n("ipfs-estuary-missing-token");
      window.toaster.show(msg, "danger");
      this.resource.delete();
      return;
    }

    this.updateNotification({ title, body: name, icon, tag });

    let estuary = new Estuary(estuaryToken);

    estuary.addEventListener("start", () => {
      this.updateNotification({
        title,
        body: name,
        icon,
        tag,
        data: { progress: 0 },
      });
    });

    let onEstuaryError = async (event) => {
      this.error(`Got event ${event.type}`);
      let body = await window.utils.l10n("ipfs-publish-error", { name });
      this.updateNotification({
        title,
        body,
        icon,
        tag,
      });
      await this.resource.delete();
    };

    ["abort", "timeout", "error"].forEach((event) => {
      estuary.addEventListener(event, onEstuaryError, { once: true });
    });

    estuary.addEventListener("success", async (event) => {
      this.log(`estuary upload success: ${JSON.stringify(event.detail)}`);

      await this.resource.addTag(`.ipfs://${event.detail.cid}`);

      let body = await window.utils.l10n("ipfs-publish-success", { name });
      let actionTitle = await window.utils.l10n("ipfs-publish-share");
      this.updateNotification({
        title,
        body,
        icon,
        tag,
        actions: [
          {
            title: actionTitle,
            action: "ipfs-share",
          },
        ],
      });
    });

    estuary.addEventListener("progress", (event) => {
      let detail = event.detail;
      let progress = Math.round((100 * detail.loaded) / detail.total);
      if (detail.loaded == detail.total) {
        progress = -1;
      }
      this.updateNotification({
        title,
        body: name,
        icon,
        tag,
        data: { progress },
      });
    });

    // Kick off the upload of the default variant.
    estuary.upload(new File([blob], this.resource.meta.name));
  }
}

// Observes file creation in the "shared on ipfs" container and trigger publishing.
class IpfsObserver {
  constructor() {
    this.log("constructor");
    this.container = null;
    this.init();

    window.addEventListener("serviceworkermessage", this);
  }

  log(msg) {
    console.log(`IpfsObserver: ${msg}`);
  }

  error(msg) {
    console.error(`IpfsObserver: ${msg}`);
  }

  async ensureContainer() {
    this.log(`ensureContainer`);
    if (!this.container) {
      this.container = await contentManager.ensureTopLevelContainer(
        "shared on ipfs"
      );

      this.log(`ensureContainer got ${this.container}`);
    }
  }

  async init() {
    await this.ensureContainer();
    let svc = await contentManager.getService();
    let lib = await contentManager.lib();

    await svc.addObserver(this.container, async (change) => {
      // this.log(`Resource changed: ${JSON.stringify(change)}`);
      if (change.kind == lib.ModificationKind.CHILD_CREATED) {
        this.log(`Will upload ${change.id} to IPFS`);

        let resource = await contentManager.resourceFromId(change.id);

        // Prompt the user to confirm the upload.
        // If the user denies the upload, the resource will be removed from the sharing container.
        let confirmDialog = document.querySelector("confirm-dialog");
        let cancelled = false;
        try {
          let result = await confirmDialog.open({
            title: await window.utils.l10n("ipfs-publish-title"),
            text: await window.utils.l10n("ipfs-confirm-publish", {
              name: resource.meta.name,
            }),
            buttons: [
              {
                id: "publish",
                label: await window.utils.l10n("ipfs-button-publish"),
                variant: "primary",
              },
              { id: "cancel", label: await window.utils.l10n("button-cancel") },
            ],
          });
          cancelled = result == "cancel";
        } catch (e) {
          this.log(`Publishing cancelled`);
          cancelled = true;
        }

        if (cancelled) {
          // Delete the resource from the shared folder.
          await resource.delete();
          return;
        }

        // Get the default variant as a Blob.
        try {
          let response = await fetch(resource.variantUrl("default"));
          let blob = await response.blob();
          let publisher = new IpfsPublisher(resource);
          publisher.publish(blob);
        } catch (e) {
          this.error(`Failed to get blob for ${change.id} : ${e}`);
        }
      }
    });

    // Bring up the text sharing UI for a resource id published on IPFS.
    actionsDispatcher.addListener(
      "share-resource",
      async (_name, resourceId) => {
        this.log(`Sharing: ${resourceId}`);

        let resource = await contentManager.resourceFromId(resourceId);
        // Retrieve the ipfs tag, to get the url.
        let url = resource.meta.tags.find((tag) => tag.startsWith(".ipfs://"));
        if (!url) {
          this.error(`No ipfs tag found for resource ${resourceId}`);
          return;
        }
        let defaultVariant = resource.meta.variants.find(
          (variant) => variant.name == "default"
        );
        if (!defaultVariant) {
          this.error(
            `Can't find the default variant for resource ${resourceId}`
          );
          return;
        }

        let { size, mimeType } = defaultVariant;

        let label = `${resource.meta.name} - ${contentManager.formatSize(
          size
        )} - ${mimeType}`;
        let textShare = document.querySelector("text-share");
        // Create a IPFS gateway url to allow sharing with non-native IPFS targets.
        let ipfsUrl = url.substring(1);
        let value = `https://${ipfsUrl.substring(
          "ipfs://".length
        )}.ipfs.dweb.link`;
        textShare.open({ value, label });
      }
    );

    // Publish a blob to IPFS:
    // Create a resource in the ipfs sharing folder, using the blob as the default variant.
    actionsDispatcher.addListener("publish-to-ipfs", async (_name, data) => {
      this.log(`Publish to IPFS: ${data.name}`);

      // Update the name if needed to prevent collisions.
      let name = data.name;
      let suffix = 1;
      while (await contentManager.hasChildByName(this.container, name)) {
        name = `${data.name} (${suffix})`;
        suffix += 1;
      }

      try {
        let resource = await contentManager.create(
          this.container,
          name,
          data.blob
        );
        this.log(`New resource is ${resource.meta.id}`);
      } catch (e) {
        this.error(`Failed to create resource: ${e}`);
      }
    });
  }

  async handleEvent(event) {
    let detail = event.detail;
    // serviceworkermessage event.detail format is:
    // {"category":"notification","type":"action","data":{"action":"ipfs-share","tag":"ipfs-publish_58d30236-0076-4bc5-9082-94f1c2d97a74"}}

    if (detail.category !== "notification" || detail.type !== "action") {
      return;
    }
    let data = detail.data;
    if (data.action !== "ipfs-share") {
      return;
    }

    // If the event is an ipfs-share action, trigger the ipfs sharing UI.
    let resourceId = data.tag.split("_")[1];
    if (resourceId) {
      actionsDispatcher.dispatch("share-resource", resourceId);
    }
  }
}

const ipfsObserver = new IpfsObserver();
