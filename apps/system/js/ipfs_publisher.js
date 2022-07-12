// Manages publication to IPFS of resources moved to the "shared on ipfs" folder.
// The publication process is as follows:
// - upload the "default" variant to an IPFS storage provider.
// - add a "hidden tag" with the ipfs url (.ipfs://...)
// - share the IPFS url and the default variant metadata (size, mimeType)

class PasswordBasedSecret {
  constructor(password) {
    this.password = password;
  }

  async getKeyMaterial() {
    let enc = new TextEncoder();
    return await window.crypto.subtle.importKey(
      "raw",
      enc.encode(this.password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );
  }

  async getSymKey() {
    let keyMaterial = await this.getKeyMaterial(this.password);
    let enc = new TextEncoder();
    return await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode("capyloon-salt"),
        iterations: 400000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  }

  async encrypt(plaintext) {
    return await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(1),
      },
      await this.getSymKey(this.password),
      plaintext
    );
  }

  async decrypt(ciphertext) {
    return await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(1),
      },
      await this.getSymKey(this.password),
      ciphertext
    );
  }
}

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

  async publish(blob, password) {
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

    // If a password is set, encrypt the blob.
    if (password) {
      // Set an undefinite progress bar during crypto operations.
      this.updateNotification({
        title,
        body: name,
        icon,
        tag,
        data: { progress: -1 },
      });

      let buffer = await blob.arrayBuffer();
      let secrets = new PasswordBasedSecret(password);
      let cipher = await secrets.encrypt(buffer);
      blob = new Blob([cipher]);
    }

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

      // Add a ".ipfs-password-protected" tag for password protected resources,
      // so we can generate a different url.
      if (password) {
        await this.resource.addTag(".ipfs-password-protected");
      }

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
      await contentManager.as_superuser();
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
        let publishDialog = document.querySelector("publish-dialog");
        let cancelled = true;
        let password = null;
        try {
          let answer = await publishDialog.open({
            name: resource.meta.name,
            isPublic: true,
          });
          cancelled = answer.result == "cancel";
          password = answer.password;
        } catch (e) {
          this.log(`Publishing cancelled : ${e}`);
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
          publisher.publish(blob, password);
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

        // Check if this is a password protected resource.
        const hasPassword = !!resource.meta.tags.find(
          (tag) => tag === ".ipfs-password-protected"
        );

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
        let cid = ipfsUrl.substring("ipfs://".length);
        let params = new URLSearchParams();
        if (hasPassword) {
          params.append("cid", cid);
        }
        let value = hasPassword
          ? `https://capyloon.org/share.html?${params}`
          : `https://${cid}.ipfs.dweb.link`;
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
