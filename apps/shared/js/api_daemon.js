// This class offers ways to retrieve service instances from the api-daemon.
// A single websocket connection is used, and services are also memoized to
// optimize memory ussage.

function TimedPromise(promise, msg) {
  return new Promise((resolve, reject) => {
    let start = Date.now();
    promise.then(
      (ok) => {
        console.log(
          `ApiDaemon TimedPromise ${msg} success in ${Date.now() - start}ms`
        );
        resolve(ok);
      },
      (error) => {
        console.error(
          `ApiDaemon TimedPromise ${msg} failure in ${
            Date.now() - start
          }ms : ${error}`
        );
        reject(error);
      }
    );
  });
}

export class ApiDaemon {
  constructor(config, global) {
    console.log(`ApiDaemon [${window.location.hostname}] constructor`);
    this.port = config.port;
    this.global = {};
    this.inFlight = {};

    let coreScripts = [
      // `core`,
      `session`,
    ];

    // A promise that resolves once the core files are imported.
    this.coreLoaded = new Promise(async (resolve, reject) => {
      try {
        for (let i = 0; i < coreScripts.length; i++) {
          let url = `http://127.0.0.1:${this.port}/api/v1/shared/${coreScripts[i]}.js`;
          this.global[`lib_${coreScripts[i]}`] = await TimedPromise(
            import(url),
            `import(${url})`
          );
        }
        resolve();
      } catch (e) {
        console.error(`ApiDaemon error: ${e}`);
        reject();
      }
    });

    // The set of services that are available.
    this.services = {};

    this.registerService("powermanager", "PowermanagerService");
    this.registerService("settings", "SettingsManager");
    this.registerService("procmanager", "ProcManager");
    this.registerService("apps", "AppsManager");
    this.registerService("contacts", "ContactsManager");
    this.registerService("contentmanager", "ContentManager");
    this.registerService("time", "TimeService");
    this.registerService("dweb", "DwebService");

    this.sessionReady = new Promise((resolve) => {
      this._resolveSessionReady = resolve;
    });

    let externalapi = navigator.b2g?.externalapi;

    this.coreLoaded.then(
      () => {
        if (externalapi) {
          this.session = new this.global.lib_session.Session();
          externalapi
            .getToken()
            .then((token) => {
              console.log(
                `ApiDaemon [${window.location.hostname}] Opening websocket session for token ${token}`
              );
              this.session.open(
                "websocket",
                `localhost:${this.port}`,
                token,
                this,
                true
              );
            })
            .catch((e) => {
              console.error(`ApiDaemon: Failed to get token: ${e}`);
            });
        } else {
          console.error("ApiDaemon: No externalapi support!");
        }
      },
      (error) =>
        console.error(`ApiDaemon: rejection from loading core assets: ${error}`)
    );
  }

  setDebug(val) {
    this.isDebug = val;
  }

  debug(msg) {
    if (this.isDebug) {
      console.log(`ApiDaemon: ${msg}`);
    }
  }

  onsessionconnected() {
    this.debug(`ApiDaemon session connected`);
    this._resolveSessionReady();
  }

  onsessiondisconnected() {
    this.debug(`ApiDaemon session disconnected`);
  }

  registerService(urlName, serviceName) {
    if (this.services[serviceName]) {
      console.error(
        `The ApiDaemon service ${serviceName} is already registered!`
      );
      return;
    }

    let url = `http://127.0.0.1:${this.port}/api/v1/${urlName}/service.js`;
    this.services[serviceName] = {
      url,
      libName: `lib_${urlName}`,
      loaded: false,
      instance: null,
    };
  }

  // Returns a promise that resolves to the service instance, or
  // rejects in case of error.
  _getService(serviceName) {
    let service = this.services[serviceName];
    if (!service) {
      console.error(`ApiDaemon: the service ${serviceName} is not registered!`);
      return Promise.reject();
    }

    if (this.inFlight[serviceName]) {
      return this.inFlight[serviceName];
    }

    this.inFlight[serviceName] = this.sessionReady.then(async () => {
      // Fast path if we already have an instance available.
      if (service.instance) {
        return service.instance;
      }

      // Wait for the service specific script to be loaded if needed.
      if (!service.loaded) {
        try {
          this.global[service.libName] = await TimedPromise(
            import(service.url),
            `import(${service.url})`
          );
          service.loaded = true;
        } catch (e) {
          console.error(`ApiDaemon failed to load ${url}`);
          return Promise.reject();
        }
      }

      // Now get an instance from the session.
      service.instance = this.global[service.libName][serviceName].get(
        this.session
      );
      return service.instance;
    });

    return this.inFlight[serviceName];
  }

  getSettings() {
    return this._getService("SettingsManager");
  }

  getPowerManager() {
    return this._getService("PowermanagerService");
  }

  getProcManager() {
    return this._getService("ProcManager");
  }

  getAppsManager() {
    return this._getService("AppsManager");
  }

  getContactsManager() {
    return this._getService("ContactsManager");
  }

  getContentManager() {
    return this._getService("ContentManager");
  }

  getTimeService() {
    return this._getService("TimeService");
  }

  getDwebService() {
    return this._getService("DwebService");
  }

  getLibraryFor(serviceName) {
    let service = this.services[serviceName];
    return this.global[service.libName];
  }

  getSession() {
    return this.session;
  }
}
