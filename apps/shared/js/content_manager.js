// Higher level class to use the ContentManager api.

const PLACES_MIME_TYPE = "application/x-places+json";
const MEDIA_MIME_TYPE = "application/x-media+json";
const CONTACTS_MIME_TYPE = "application/x-contact+json";

export class ContentManager extends EventTarget {
  constructor() {
    super();
    this.service = apiDaemon.getContentManager();

    this.placesQuery = new Map();
    this.placesUpdating = new Set();

    this.topLevel = new Map();
  }

  // Configure the content manager to use a superuser UCAN. This requires the caller
  // to have the 'dweb' permission in order for the `requestSuperuser()` call to succeed.
  async as_superuser() {
    this.dweb = this.dweb || (await apiDaemon.getDwebService());
    let ucan = await this.dweb.requestSuperuser();
    let svc = await this.service;
    svc.withUcan(ucan);
  }

  getOpenSearchManager(callback) {
    this.log(`getOpenSearchManager`);
    return new OpenSearchManager(callback);
  }

  getContactsManager(callback) {
    return new ContactsManager(callback);
  }

  getContainerManager(name, variants) {
    return new ContainerManager(name, variants);
  }

  log(msg) {
    console.log(`ContentManager: ${msg}`);
  }

  error(msg) {
    console.error(`ContentManager: ${msg}`);
  }

  async lib() {
    if (!this._lib) {
      await this.service;
      this._lib = apiDaemon.getLibraryFor("ContentManager");
    }

    return this._lib;
  }

  async getService() {
    let svc = await this.service;
    return svc;
  }

  async ensureHttpKey(svc) {
    try {
      if (!this.http_key) {
        this.http_key = await svc.httpKey();
      }
    } catch (e) {
      console.error(`Failed to retrive http key: ${e}`);
    }
  }

  // Formats the given size with the appropriate unit for the current locale.
  formatSize(size) {
    // Terabytes should be enough.
    // See https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier
    let units = [
      "petabyte",
      "terabyte",
      "gigabyte",
      "megabyte",
      "kilobyte",
      "byte",
    ];
    let currentUnit = units.pop();
    let factor = 1;
    while (size > 1024 * factor) {
      currentUnit = units.pop();
      factor *= 1024;
    }

    return `${new Intl.NumberFormat(navigator.language, {
      style: "unit",
      unit: currentUnit,
      unitDisplay: "short",
      maximumFractionDigits: 2,
    }).format(size / factor)}`;
  }

  iconFor(isFolder, mimeType) {
    let kind = "folder";

    if (!isFolder) {
      kind = "file";

      // Check the mime type to choose the most appropriate icon.
      if (mimeType) {
        if (mimeType === PLACES_MIME_TYPE) {
          kind = "link";
        } else if (mimeType === MEDIA_MIME_TYPE) {
          kind = "film";
        } else if (mimeType === CONTACTS_MIME_TYPE) {
          kind = "contact";
        } else if (
          mimeType.startsWith("text/") ||
          mimeType == "application/pdf"
        ) {
          kind = "file-text";
        } else if (mimeType.startsWith("image/")) {
          kind = "image";
        } else if (mimeType.startsWith("audio/")) {
          kind = "music";
        } else if (mimeType.startsWith("video/")) {
          kind = "film";
        } else {
          console.log(`No specific icon for ${mimeType}`);
        }
      }
    }

    return kind;
  }

  // Returns the appropriate icon kind for a given resource.
  // The mime type used is the one from the default variant.
  async iconForResource(meta) {
    const lib = await this.lib();
    let mimeType = meta.variants.find(
      (variant) => variant.name == "default"
    )?.mimeType;
    return this.iconFor(meta.kind === lib.ResourceKind.CONTAINER, mimeType);
  }

  // Returns wether a named top level container already exists.
  async hasTopLevelContainer(containerName) {
    this.log(`hasTopLevelContainer ${containerName}`);
    if (this.topLevel.has(containerName)) {
      return true;
    }

    let svc = await this.service;

    let root = await svc.getRoot();
    try {
      await svc.childByName(root.id, containerName);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Returns the id of an existing or newly created container
  // which is a direct child of the root.
  async ensureTopLevelContainer(containerName) {
    if (this.topLevel.has(containerName)) {
      return this.topLevel.get(containerName);
    }

    let svc = await this.service;
    const lib = await this.lib();

    let root = await svc.getRoot();
    this.log(`Fetching children of ${root.id}`);

    let cursor = await svc.childrenOf(root.id);

    let id = null;
    let done = false;
    while (!done) {
      try {
        let children = await cursor.next();
        for (let child of children) {
          if (
            child.name === containerName &&
            child.kind === lib.ResourceKind.CONTAINER
          ) {
            id = child.id;
            done = true;
            this.log(`Found container with id ${id}`);
            break;
          }
        }
      } catch (e) {
        // cursor.next() rejects when no more items are available, so it's not
        // a fatal error.
        this.error(`Cursor error: ${JSON.stringify(e)}`);
        done = true;
      }
    }
    // cursor.release();

    if (id === null) {
      this.error(`No '${containerName}' container found, creating one.`);
      try {
        let container = await svc.createobj(
          {
            parent: root.id,
            name: containerName,
            kind: lib.ResourceKind.CONTAINER,
            tags: [],
          },
          ""
        );
        id = container.id;
        this.log(`New container ${containerName} has id ${id}`);
      } catch (e) {
        this.error(
          `createObj error for ${containerName}: ${e} ${JSON.stringify(e)}`
        );
      }
    }

    if (id !== null) {
      this.topLevel.set(containerName, id);
    } else if (this.topLevel.has(containerName)) {
      // Check if we lost a race with another in-flight call.
      return this.topLevel.get(containerName);
    }

    return id;
  }

  // Returns the child by name in a given container.
  async childByName(parent, name, variant = "default") {
    let svc = await this.service;
    try {
      let meta = await svc.childByName(parent, name);
      let blob = await svc.getVariant(meta.id, variant);
      await this.ensureHttpKey(svc);
      return new ContentResource(svc, this.http_key, meta, blob, variant);
    } catch (e) {
      this.error(`childByName failed: ${JSON.stringify(e)}`);
      return null;
    }
  }

  // Returns the child by name in a given container.
  // Specialized for json variants
  async jsonChildByName(parent, name, variant = "default") {
    let svc = await this.service;
    try {
      let meta = await svc.childByName(parent, name);
      let json = await svc.getVariantJson(meta.id, variant);
      await this.ensureHttpKey(svc);
      return new ContentResource(svc, this.http_key, meta, json, variant);
    } catch (e) {
      this.error(`jsonChildByName failed: ${JSON.stringify(e)}`);
      return null;
    }
  }

  // Checks if a child by this name exists, without fetching any variant.
  async hasChildByName(parent, name) {
    let svc = await this.service;
    try {
      await svc.childByName(parent, name);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Simple way to create a leaf resource with an existing blob.
  async create(parent, name, blob, tags = []) {
    let svc = await this.service;
    const lib = await this.lib();

    let meta = await svc.createobj(
      {
        parent,
        name,
        kind: lib.ResourceKind.LEAF,
        tags,
      },
      ""
    );
    await this.ensureHttpKey(svc);
    let resource = new ContentResource(svc, this.http_key, meta, blob);
    await resource.update(blob);
    return resource;
  }

  async resourceFromId(id) {
    let svc = await this.service;
    await this.ensureHttpKey(svc);
    let meta = await svc.getMetadata(id);
    return new ContentResource(svc, this.http_key, meta);
  }

  isValidUrl(url) {
    // Don't add moz-extension urls to places since they don't survive extension re-installation.
    // Don't add about:reader urls since they are not meant to be navigated too directly.
    // Don't add about:blank since ... it's blank.
    if (
      url &&
      (url === "about:blank" ||
        url.startsWith("moz-extension:") ||
        url.startsWith("about:reader?url="))
    ) {
      return false;
    }
    return !!url;
  }

  // Remove the hash part if any.
  cleanupUrl(url) {
    let res = url.trim();
    let hash = res.indexOf("#");
    if (hash !== -1) {
      res = res.substring(0, hash);
    }
    return res;
  }

  // Creates or updates a places entry.
  async createOrUpdatePlacesEntry(url, title, icon) {
    url = this.cleanupUrl(url);
    if (!this.isValidUrl(url)) {
      return;
    }
    this.log(`createOrUpdatePlacesEntry: ${url} ${title} ${icon}`);

    // We need all places queries for a given url to be coalesced,
    // and will not apply intermediary changes.
    this.placesQuery.set(url, { url, title, icon });

    await this.drainPlacesQueryFor(url);
  }

  async visitUrl(url, container, highPriority = false) {
    if (!url) {
      return;
    }
    url = this.cleanupUrl(url);
    if (url === "") {
      return;
    }
    if (!this.isValidUrl(url)) {
      return;
    }

    this.log(`visit ${container} ${url}`);
    let svc = await this.service;
    const lib = await this.lib();

    let parent = await this.ensureTopLevelContainer(container);
    await svc.visitByName(
      parent,
      url,
      highPriority ? lib.VisitPriority.HIGH : lib.VisitPriority.NORMAL
    );
  }

  async visitPlace(url, highPriority = false) {
    await this.visitUrl(url, "places", highPriority);
  }

  async visitMedia(url, highPriority = false) {
    await this.visitUrl(url, "media", highPriority);
  }

  async drainPlacesQueryFor(url) {
    if (this.placesUpdating.has(url)) {
      return;
    }
    this.placesUpdating.add(url);

    let places = await this.ensureTopLevelContainer("places");
    while (this.placesQuery.has(url)) {
      let place = this.placesQuery.get(url);
      this.placesQuery.delete(url);

      let entry = await this.childByName(places, url);
      let content = new Blob([JSON.stringify(place)], {
        type: PLACES_MIME_TYPE,
      });
      let shouldUpdateIcon = true;
      if (entry) {
        let text = await entry.variant().text();
        if (text) {
          let current = JSON.parse(text);
          shouldUpdateIcon = current.icon !== place.icon;
        }

        await entry.update(content);
      } else {
        entry = await this.create(places, url, content, ["places"]);
      }
      if (shouldUpdateIcon) {
        await entry.updateVariantFromUrl(place.icon, "icon");
      }
    }
    this.placesUpdating.delete(url);
  }

  async createOrUpdateMediaEntry(url, icon, meta) {
    this.log(`createOrUpdateMediaEntry: ${url}`);
    let medias = await this.ensureTopLevelContainer("media");
    if (!medias) {
      this.error(`No top level 'media' container!`);
      return;
    }
    let entry = await this.childByName(medias, url);
    let media = {
      url,
      icon,
      title: meta.title,
      album: meta.album,
      artist: meta.artis,
      artwork: meta.artwork,
      ogImage: meta.ogImage,
      backgroundColor: meta.backgroundColor,
    };
    let content = new Blob([JSON.stringify(media)], {
      type: MEDIA_MIME_TYPE,
    });
    if (entry) {
      await entry.update(content);
    } else {
      entry = await this.create(medias, url, content, ["media"]);
    }

    await entry.updateVariantFromUrl(icon, "icon");

    let poster = meta.artwork?.[0]?.src != "" ? meta.artwork?.[0]?.src : null;
    let posterUrl = poster || meta.ogImage;
    if (posterUrl) {
      await entry.updateVariantFromUrl(posterUrl, "poster");
    }
  }

  // Performs a cursor iteration, calling the callback for each result.
  // The callback is expected to return a boolean indicating
  // if more results are needed.
  // It will be called with 'null' once the end of results is reached.
  async processCursor(cursor, withContent, variantNames, callback) {
    let start = Date.now();

    let svc = await this.service;
    await this.ensureHttpKey(svc);
    let lib = await this.lib();
    let done = false;

    this.log(`processCursor init ok: ${Date.now() - start}`);
    while (!done) {
      try {
        let children = await cursor.next();
        this.log(`processCursor cursor.next: ${Date.now() - start}`);

        let queue = [];

        for (let child of children) {
          if (withContent) {
            // Don't show containers.
            if (child.kind === lib.ResourceKind.CONTAINER) {
              queue.push(Promise.resolve(null));
              continue;
            }
            // Make sure that the default variant mime type is declared as JSON.
            let defaultMime;
            const defaultVariant = child.variants.find((variant) => {
              if (variant.name === "default") {
                defaultMime = variant.mimeType;
              }

              return (
                variant.name === "default" && variant.mimeType.includes("json")
              );
            });
            if (!defaultVariant) {
              this.error(
                `The default variant for ${child.name} is not in json format! (found ${defaultMime})`
              );
              queue.push(Promise.resolve(null));
              continue;
            }

            queue.push(svc.getVariantJson(child.id, "default"));
          } else {
            done = !callback(child);
          }
        }

        if (withContent) {
          let root_url = `http://127.0.0.1:${window.config.port}/cmgr/${this.http_key}`;

          let results = await Promise.all(queue);
          let i = 0;
          for (let content of results) {
            let child = children[i];
            i += 1;

            // Non json default variant resolve to null, bail out for these.
            if (!content) {
              continue;
            }

            // Get the requested variants urls if they are declared to be available for this resource.
            let availableVariants = new Set();
            child.variants.forEach((variant) => {
              availableVariants.add(variant.name);
            });
            let variants = { default: content };
            for (let i = 0; i < variantNames.length; i++) {
              let name = variantNames[i];
              if (availableVariants.has(name)) {
                variants[name] = `${root_url}/${child.id}/${name}`;
              }
            }
            done = !callback({ meta: child, variants });
            if (done) {
              break;
            }
          }
        }
      } catch (e) {
        // cursor.next() rejects when no more items are available, so it's not
        // a fatal error.
        // this.error(`Cursor error: ${JSON.stringify(e)}`);
        done = true;
      }
    }
    // cursor.release();
    callback(null);
  }

  async search(query, maxCount, tag, withContent, variantNames, callback) {
    let svc = await this.service;
    let cursor = await svc.search(query, maxCount, tag);
    await this.processCursor(cursor, withContent, variantNames, callback);
    cursor = null;
  }

  // Returns the top frequent items with a callback interface.
  async topByFrecency(maxCount, callback) {
    let svc = await this.service;
    let start = Date.now();
    let cursor = await svc.topByFrecency(maxCount);
    console.log(`topByFrecency cursor: ${Date.now() - start}ms`);
    await this.processCursor(cursor, true, ["icon", "poster"], callback);
    console.log(`topByFrecency full: ${Date.now() - start}ms`);
  }

  // Returns the last modified items with a callback interface.
  async lastModified(maxCount, callback) {
    let svc = await this.service;
    let start = Date.now();
    let cursor = await svc.lastModified(maxCount);
    console.log(`lastModified cursor: ${Date.now() - start}ms`);
    await this.processCursor(cursor, true, ["icon", "poster"], callback);
    console.log(`lastModified full: ${Date.now() - start}ms`);
  }

  async searchPlaces(query, maxCount, callback) {
    return this.search(query, maxCount, "places", true, ["icon"], callback);
  }

  async searchMedia(query, maxCount, callback) {
    return this.search(
      query,
      maxCount,
      "media",
      true,
      ["icon", "poster"],
      callback
    );
  }

  async searchContacts(query, maxCount, callback) {
    return this.search(query, maxCount, "contact", true, ["photo"], callback);
  }
}

// Wrapper class around a content manager resource.
class ContentResource {
  constructor(service, http_key, meta, blob, variant) {
    // console.log(`ContentResource::constructor http_key=${http_key}`);
    this._svc = service;
    this._meta = meta;
    this._http_key = http_key;
    this._variants = new Map();
    if (blob && variant) {
      this._variants.set(variant, blob);
    }
  }

  log(msg) {
    console.log(`ContentResource: ${msg}`);
  }

  error(msg) {
    console.error(`ContentResource: ${msg}`);
  }

  variant(name = "default") {
    return this._variants.get(name);
  }

  get meta() {
    return this._meta;
  }

  async update(blob, variant = "default") {
    await this._svc.updateVariant(this._meta.id, variant, blob);
    this._variants.set(variant, blob);
  }

  async updateVariantFromUrl(url, variant) {
    this.log(`updateVariantFromUrl '${variant}' ${url}`);
    if (!url) {
      this.error(`Mandatory 'url' parameter missing!`);
      return;
    }

    if (!variant) {
      this.error(`Mandatory 'variant' parameter missing!`);
      return;
    }

    try {
      let resource = await fetch(url);
      let blob = await resource.blob();
      await this.update(blob, variant);
    } catch (e) {
      this.error(
        `Error updating '${variant}' from '${url}' : ${JSON.stringify(e)}`
      );
    }
  }

  async delete() {
    await this._svc.delete(this._meta.id);
    this._variants.clear();
    this._meta = null;
  }

  async observe(callback) {
    try {
      await this._svc.addObserver(this._meta.id, callback);
    } catch (e) {
      this.error(`Failed to add observer for ${this._meta.id}: ${e}`);
    }
  }

  variantUrl(variant = "default") {
    return `http://127.0.0.1:${window.config.port}/cmgr/${this._http_key}/${this._meta.id}/${variant}`;
  }

  async addTag(tag) {
    this._meta = await this._svc.addTag(this._meta.id, tag);
  }

  async removeTag(tag) {
    this._meta = await this._svc.removeTag(this._meta.id, tag);
  }

  debug() {
    return JSON.stringify(this._meta || "<no meta>");
  }
}

// Helper to abstract open search description storage & management.
// Search engines are stored in the 'search engines' top level container.
// - Each search engine description is stored as a resource: the default
// variant is a JSON representation of the OpenSearch document, and
// the 'icon' variant contains the icon for this engine.
// - The 'enabled' tag is set on search engines that can be part of a keyword
// search.
class OpenSearchManager extends ContentManager {
  constructor(updatedCallback = null) {
    super();
    this.container = null;
    this.list = [];
    if (updatedCallback && typeof updatedCallback === "function") {
      this.onupdated = updatedCallback;
    }
  }

  log(msg) {
    console.log(`OpenSearch: ${msg}`);
  }

  error(msg) {
    console.error(`OpenSearch: ${msg}`);
  }

  async ready() {
    if (!this.container) {
      let firstRun = !(await this.hasTopLevelContainer("opensearch"));
      this.container = await this.ensureTopLevelContainer("opensearch");
      this.svc = await this.service;
      this._lib = await this.lib();
      await this.ensureHttpKey(this.svc);

      if (firstRun) {
        await this.loadDefaults();
      }
    }
  }

  async onchange(change) {
    this.log(`list modified: ${JSON.stringify(change)}`);
    if (
      change.kind == this._lib.ModificationKind.CHILD_CREATED ||
      change.kind == this._lib.ModificationKind.CHILD_DELETED
    ) {
      await this.update();
    }
  }

  async init() {
    await this.ready();

    await this.svc.addObserver(this.container, this.onchange.bind(this));
    await this.update();
  }

  hasEngine(url) {
    return !!this.list.find((resource) => resource.meta.name == url);
  }

  async hasEngineName(current) {
    let name = current.OpenSearchDescription?.ShortName?._text;
    if (!name) {
      // No name found, not adding this engine!
      return true;
    }

    for (let resource of this.list) {
      let json = await resource.variant("default");
      if (json.OpenSearchDescription?.ShortName?._text == name) {
        this.error(`Found duplicate for '${name}'`);
        return true;
      }
    }
    return false;
  }

  // Refresh the list of search engines.
  async update() {
    let cursor = await this.svc.childrenOf(this.container);

    let list = [];
    let done = false;
    while (!done) {
      try {
        let children = await cursor.next();
        for (let child of children) {
          if (child.kind === this._lib.ResourceKind.LEAF) {
            let json = await this.svc.getVariantJson(child.id, "default");
            list.push(
              new ContentResource(
                this.svc,
                this.http_key,
                child,
                json,
                "default"
              )
            );
          }
        }
      } catch (e) {
        // cursor.next() rejects when no more items are available, so it's not
        // a fatal error.
        done = true;
      }
    }

    this.log(`list updated: ${list.length} items.`);
    this.list = list;
    if (this.onupdated) {
      this.onupdated(this.list);
    }
  }

  // Add a new search engine from the JSON representation.
  async addFromJson(json, url, enabled = false, favicon = null) {
    this.log(`addFromJson ${url}, enabled=${enabled}`);

    await this.ready();

    let dupe = await this.hasEngineName(json);
    if (dupe) {
      return;
    }

    let tags = [];
    if (enabled) {
      tags.push("enabled");
    }

    // Store the new resource.
    let meta = await this.svc.createobj(
      {
        parent: this.container,
        name: url,
        kind: this._lib.ResourceKind.LEAF,
        tags,
      },
      "default",
      new Blob([JSON.stringify(json)], {
        type: "application/json",
      })
    );
    let resource = new ContentResource(this.svc, this.http_key, meta);

    // Download the icon and store it as the 'icon' variant.
    // If there are several icons, select the largest one.
    let icons = json.OpenSearchDescription?.Image;
    if (icons && !Array.isArray(icons)) {
      icons = [icons];
    }
    if (icons) {
      let selected = null;
      let maxSize = 0;
      icons.forEach((icon) => {
        let size = parseInt(icon._attributes.width, 10);
        if (isNaN(size)) {
          size = 0;
        }
        if (size > maxSize) {
          maxSize = size;
          selected = icon;
        }
      });
      let iconUrl = selected ? selected._text.trim() : favicon;
      if (iconUrl) {
        await resource.updateVariantFromUrl(iconUrl, "icon");
      }
    }

    await this.update();
  }

  // Add a new search engine from a url.
  async addFromUrl(url, enabled = false, substituteUrl = null, favicon = null) {
    await this.ready();

    try {
      // Fetch the search engine description as a XML document.
      let xml = await new Promise((resolve, reject) => {
        var req = new XMLHttpRequest();
        req.responseType = "document";
        req.onload = () => {
          resolve(req.responseXML);
        };
        req.onerror = reject;
        req.open("GET", url);
        req.send();
      });

      await this.addFromJson(
        this.xmlToJson(xml),
        substituteUrl || url,
        enabled,
        favicon
      );
    } catch (e) {
      this.error(`Failed to add search engine: ${e}`);
    }
  }

  xmlToJson(xml) {
    // this.log(`xmlToJson ${xml} nodeType=${xml.nodeType}`);
    let obj = {};

    if (xml.nodeType == 1) {
      // element node, process "root" attributes.
      if (xml.attributes.length > 0) {
        obj["_attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          let attribute = xml.attributes.item(j);
          obj["_attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) {
      // text node.
      obj = xml.nodeValue;
    }

    // Process children.
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        let item = xml.childNodes.item(i);
        let nodeName = item.nodeName.replace("#text", "_text");
        if (typeof obj[nodeName] == "undefined") {
          obj[nodeName] = this.xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push == "undefined") {
            let old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this.xmlToJson(item));
        }
      }
    }
    return obj;
  }

  async loadDefaults() {
    try {
      let response = await fetch(
        `http://shared.localhost:${config.port}/opensearch/opensearch.json`
      );
      let list = await response.json();

      for (let item of list) {
        this.log(`Adding ${item.id}`);
        await this.addFromUrl(
          `http://shared.localhost:${config.port}/opensearch/${item.id}`,
          true,
          item.source
        );
      }
    } catch (e) {
      this.error(`Failed to load default search engines: ${e}`);
    }
  }
}

// Contact Wrapper.
// These fields are indexed: { name: "...", phone: "[...]", email: "[...]" }
class Contact {
  constructor(init = null, tags = []) {
    // The resource id.
    this.id = null;

    // Fields representing the contact.
    this.name = init?.name || null;
    this.phone = init?.phone || [];
    this.email = init?.email || [];
    this.did = init?.did || [];
    this.photo = init?.photo || null;
    this.autoconnect = init?.autoconnect || "";

    this.isOwn = tags.includes("own-card");
  }

  static fromJson(json, id, tags = []) {
    let contact = new Contact();

    contact.id = id;

    // TODO: validation.
    contact.name = json.name;
    contact.phone = json.phone;
    contact.email = json.email;
    contact.did = json.did;
    contact.autoconnect = json.autoconnect || "prompt";

    contact.isOwn = tags.includes("own-card");
    return contact;
  }

  // Return an object suitable for storage as the default variant.
  asDefaultVariant() {
    return {
      name: this.name,
      phone: this.phone,
      email: this.email,
      did: this.did,
      autoconnect: this.autoconnect,
    };
  }
}

// Helper to abstract contacts management.
class ContactsManager extends ContentManager {
  constructor(updatedCallback = null) {
    super();
    this.container = null;
    this.list = [];
    if (updatedCallback && typeof updatedCallback === "function") {
      this.onupdated = updatedCallback;
    }
  }

  newContact(init = null) {
    return new Contact(init);
  }

  log(msg) {
    console.log(`ContactsManager: ${msg}`);
  }

  error(msg) {
    console.error(`ContactsManager: ${msg}`);
  }

  async ready() {
    if (!this.container) {
      this.container = await this.ensureTopLevelContainer("contacts");
      this.svc = await this.service;
      this._lib = await this.lib();
      await this.ensureHttpKey(this.svc);
    }
  }

  async onchange(change) {
    this.log(`list modified: ${JSON.stringify(change)}`);
    if (
      change.kind == this._lib.ModificationKind.CHILD_CREATED ||
      change.kind == this._lib.ModificationKind.CHILD_MODIFIED ||
      change.kind == this._lib.ModificationKind.CHILD_DELETED
    ) {
      await this.updateList();
    }
  }

  async deleteContact(contact) {
    await this.svc.delete(contact.id);
  }

  async init() {
    await this.ready();

    await this.svc.addObserver(this.container, this.onchange.bind(this));
    await this.updateList();
  }

  async contactWithDid(did) {
    if (!this.list) {
      await this.updateList();
    }
    let contact = this.list.find(contact => {
      let dids = (contact.did || []).map((did) => did.uri);
      return dids.includes(did);
    });
    return contact;
  }

  // Refresh the list of contacts.
  async updateList() {
    let cursor = await this.svc.childrenOf(this.container);

    let list = [];
    let done = false;
    while (!done) {
      try {
        let children = await cursor.next();
        for (let child of children) {
          if (child.kind === this._lib.ResourceKind.LEAF) {
            let blob = await this.svc.getVariant(child.id, "default");
            if (blob.type === CONTACTS_MIME_TYPE) {
              let json = JSON.parse(await blob.text());
              let contact = Contact.fromJson(json, child.id, child.tags);

              // Fetch the photo variant url if it's available.
              let hasPhoto = child.variants.find((variant) => {
                return variant.name == "photo";
              });
              if (hasPhoto) {
                contact.photoUrl = `http://127.0.0.1:${window.config.port}/cmgr/${this.http_key}/${child.id}/photo`;
              }
              list.push(contact);
            }
          }
        }
      } catch (e) {
        // cursor.next() rejects when no more items are available, so it's not
        // a fatal error.
        done = true;
      }
    }

    this.log(`list updated: ${list.length} items.`);
    this.list = list;
    if (this.onupdated) {
      this.onupdated(this.list);
    }
  }

  // Add a new contact.
  async add(contact) {
    await this.ready();

    let tags = ["contact"];
    if (contact.isOwn) {
      tags.push("own-card");
    }

    try {
      // Store the new contact.
      let meta = await this.svc.createobj(
        {
          parent: this.container,
          name: contact.name,
          kind: this._lib.ResourceKind.LEAF,
          tags,
        },
        "default",
        new Blob([JSON.stringify(contact.asDefaultVariant())], {
          type: CONTACTS_MIME_TYPE,
        })
      );
      let resource = new ContentResource(this.svc, this.http_key, meta);
      if (contact.photo) {
        // this.log(`Adding photo: ${contact.photo}`);
        await resource.update(contact.photo, "photo");
      }
      await this.updateList();
      return meta.id;
    } catch (e) {
      this.error(`Failed to add contact: ${e}`);
    }
  }

  async update(id, contact) {
    await this.ready();

    let resource = new ContentResource(this.svc, this.http_key, { id });
    await resource.update(
      new Blob([JSON.stringify(contact.asDefaultVariant())], {
        type: CONTACTS_MIME_TYPE,
      })
    );
    if (contact.photo) {
      await resource.update(contact.photo, "photo");
    }
    try {
      if (contact.isOwn) {
        await resource.addTag("own-card");
      } else {
        await resource.removeTag("own-card");
      }
    } catch (e) {}
    await this.updateList();
  }
}

// Helper to abstract management of a given container.
class ContainerManager extends ContentManager {
  constructor(containerName, variants = []) {
    super();
    this.containerName = containerName;
    this.variants = variants;
    this.container = null;
  }

  log(msg) {
    console.log(`ContainerManager: ${msg}`);
  }

  error(msg) {
    console.error(`ContainerManager: ${msg}`);
  }

  async ready() {
    if (!this.container) {
      this.container = await this.ensureTopLevelContainer(this.containerName);
      this.svc = await this.service;
      this._lib = await this.lib();
      await this.ensureHttpKey(this.svc);
    }
  }

  onchange(change) {
    // change format:
    // {kind:3, id:"9eac49dd-9c9f-4346-8dae-70012a14a938", parent:"24941cb3-b30f-4753-8fb3-119716913de2"}
    this.log(`list modified: ${JSON.stringify(change)}`);
    if (change.kind == this._lib.ModificationKind.CHILD_CREATED) {
      this.dispatchEvent(new CustomEvent("child-created", { detail: change }));
    } else if (change.kind == this._lib.ModificationKind.CHILD_DELETED) {
      this.dispatchEvent(new CustomEvent("child-deleted", { detail: change }));
    }
    return Promise.resolve();
  }

  async init() {
    await this.ready();

    await this.svc.addObserver(this.container, this.onchange.bind(this));
    await this.updateList();
  }

  // Refresh the list of children.
  async updateList() {
    let cursor = await this.svc.childrenOf(this.container);

    let list = [];
    let done = false;
    while (!done) {
      try {
        let children = await cursor.next();
        for (let child of children) {
          if (child.kind === this._lib.ResourceKind.LEAF) {
            let blob = await this.svc.getVariant(child.id, "default");
            let resource = new ContentResource(
              this.svc,
              this.http_key,
              child,
              blob,
              "default"
            );
            for (let variant of this.variants) {
              try {
                let blob = await this.svc.getVariant(child.id, variant);
                resource.update(blob, variant);
              } catch (e) {
                // no such variant: ignore error.
              }
            }
            list.push(resource);
          }
        }
      } catch (e) {
        // cursor.next() rejects when no more items are available, so it's not
        // a fatal error.
        done = true;
      }
    }

    this.log(`list updated: ${list.length} items.`);
    this.dispatchEvent(new CustomEvent("full-list", { detail: list }));
  }
}
