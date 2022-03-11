// Dependency resolvers.
// Each returns a lazy promise that resolves when its task is done.

// url needs to be relative to the root of this app.
function scriptLoader(url) {
  return () => {
    let script = document.createElement("script");
    script.setAttribute("src", new URL(url, location));
    document.head.appendChild(script);
    return new Promise((resolve) => {
      script.addEventListener("load", resolve, { once: true });
    });
  };
}

// url will be relative to the root of the shared app.
function sharedScriptLoader(url) {
  return scriptLoader(`http://shared.localhost:${window.config.port}/${url}`);
}

function styleLoader(url) {
  return () => {
    let link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", new URL(url, location));
    document.head.appendChild(link);
    return Promise.resolve(link);
  };
}

function sharedStyleLoader(url) {
  return styleLoader(`http://shared.localhost:${window.config.port}/${url}`);
}

function linkPreLoader(url, type_, as) {
  return () => {
    let link = document.createElement("link");
    link.setAttribute("rel", "preload");
    link.setAttribute("type", type_);
    link.setAttribute("as", as);
    link.setAttribute("href", new URL(url, location));
    document.head.appendChild(link);
    return Promise.resolve(link);
  };
}

function sharedLinkPreLoader(url, type_, as) {
  return linkPreLoader(
    `http://shared.localhost:${window.config.port}/${url}`,
    type_,
    as
  );
}

// Resolves the promise with the module.
function moduleLoader(url, props = null) {
  return async () => {
    try {
      let imported = await import(new URL(url, location));
      if (props) {
        if (!Array.isArray(props)) {
          props = [props];
        }
        props.forEach((prop) => {
          window[prop] = imported[prop];
        });
      }
      return imported;
    } catch (e) {
      console.log(`moduleLoader failure: ${e} for ${url}`);
    }
  };
}

function sharedModuleLoader(url, props) {
  return moduleLoader(
    `http://shared.localhost:${window.config.port}/${url}`,
    props
  );
}

// Resolves the promise with the module.
function windowModuleLoader(url, winProp, moduleProp) {
  return async () => {
    try {
      let imported = await import(new URL(url, location));
      window[winProp] = new imported[moduleProp](window.config, window);
    } catch (e) {
      console.log(`windowModuleLoader failure: ${e} for ${url}`);
    }
  };
}

function sharedWindowModuleLoader(url, winProp, moduleProp) {
  return windowModuleLoader(
    `http://shared.localhost:${window.config.port}/${url}`,
    winProp,
    moduleProp
  );
}

/*
Builds a DepGraph for a representation of the resources that need to be
loaded.
The deps are represented by a json structure:
[
    {
        name: "short unique name",
        kind: "script|sharedScript|style|sharedStyle|link|sharedLink|module|sharedModule|virtual",
        param: "<url>",
        deps: [...]
     }
]
*/
class ParallelGraphLoader {
  constructor(targets, custom, config = {}) {
    // console.log(`Creating dep loader, config is ${JSON.stringify(config)}`);
    this.custom = custom;
    this.config = config;

    // Maps node names to their description.
    this.nodes = new Map();

    // Maps node names to their state:
    // If not set, hasn't been resolved.
    // If set: { resolved: true|false, value: <resolved value>, inFlight: <promise> }
    this.state = new Map();

    // Apply configuration substitution to target names and parameters.
    targets.forEach((target) => {
      if (target.param) {
        if (typeof target.param === "string") {
          target.param = this.applyConfig(target.param);
        } else {
          for (let i = 0; i < target.param.length; i++) {
            target.param[i] = this.applyConfig(target.param[i]);
          }
        }
      }

      let name = this.applyConfig(target.name);
      this.nodes.set(name, target);
    });
  }

  // Substitute configurable elements in a string.
  applyConfig(value) {
    if (this.config.platform && typeof value === "string") {
      let x = value.replace("__PLATFORM__", this.config.platform);
      if (x != value) {
        console.log(`  ${value} -> ${x}`);
      }
      return x;
    }
    return value;
  }

  buildNodeRunner(node) {
    return async (resultMap) => {
      let start = Date.now();

      if (node.deps) {
        // put all the deps runner in an array to use Promise.all()
        let promises = [];
        node.deps.forEach((depName) =>
          promises.push(
            new Promise(async (resolve) => {
              let node = this.nodes.get(depName);
              if (!node) {
                console.error(`Can't find node for '${depName}'`);
                throw new Error("UnknownDependency");
              }

              let state = this.state.get(depName);
              if (state) {
                if (state.resolved) {
                  resolve(state.value);
                } else {
                  let value = await state.inFlight;
                  resolve(value);
                }
              } else {
                let promise = this.buildNodeRunner(node)(resultMap);
                this.state.set(depName, { resolved: false, inFlight: promise });
                let value = await promise;
                this.state.set(depName, { resolved: true, value });
                resolve(value);
              }
            })
          )
        );

        // Run dependencies sequentially
        // for (let i = 0; i < promises.length; i++) {
        //   await promises[i];
        // }

        // Run the dependencies in parallel
        await Promise.all(promises);
      }

      let selfStart = Date.now();
      let final = await this.getRunnerFor(node)();
      resultMap.set(node.name, final);
      let end = Date.now();
      console.log(
        `Timing for '${node.name}' : self=${end - selfStart}ms full=${
          end - start
        }ms`
      );
    };
  }

  async waitForDeps(name = "root") {
    if (!this.nodes.has(name)) {
      console.error(`No '${name}' node found in the loader!`);
      return;
    }

    let results = new Map();
    let runner = this.buildNodeRunner(this.nodes.get(name));
    await runner(results);
    return results;
  }

  getRunnerFor(dep) {
    let runner = null;
    switch (dep.kind) {
      case "virtual":
        // the runner is a simple Promise.
        runner = () => Promise.resolve();
        break;
      case "script":
        runner = scriptLoader(dep.param);
        break;
      case "sharedScript":
        runner = sharedScriptLoader(dep.param);
        break;
      case "module":
        if (typeof dep.param === "string") {
          runner = moduleLoader(dep.param);
        } else {
          runner = moduleLoader(dep.param[0], dep.param[1]);
        }
        break;
      case "sharedModule":
        if (typeof dep.param === "string") {
          runner = sharedModuleLoader(dep.param);
        } else {
          runner = sharedModuleLoader(dep.param[0], dep.param[1]);
        }
        break;
      case "windowModule":
        runner = windowModuleLoader(dep.param[0], dep.param[1], dep.param[2]);
        break;
      case "sharedWindowModule":
        runner = sharedWindowModuleLoader(
          dep.param[0],
          dep.param[1],
          dep.param[2]
        );
        break;
      case "shoelaceComp":
        // The parameter is the Shoelace component name, eg. "input" to use <sl-input>
        runner = sharedModuleLoader(
          `shoelace/components/${dep.param}/${dep.param}.js`
        );
        break;
      case "style":
        runner = styleLoader(dep.param);
        break;
      case "sharedStyle":
        runner = sharedStyleLoader(dep.param);
        break;
      case "link":
        runner = linkPreLoader(dep.param[0], dep.param[1], dep.param[2]);
        break;
      case "sharedLink":
        runner = sharedLinkPreLoader(dep.param[0], dep.param[1], dep.param[2]);
        break;
      case "custom":
        if (this.custom && this.custom[dep.custom]) {
          runner = this.custom[dep.custom](dep.param);
        } else {
          console.error(`Invalid custom runner: ${dep.custom}!`);
          throw new Error("InvalidCustomRunner");
        }
        break;
      default:
        console.error(`Invalid dependency kind: ${dep.kind}!`);
        throw new Error("InvalidDependencyKind");
        break;
    }

    return runner;
  }
}

// Shared dependencies. Valid values are:
// - shared-all
// - shared-api-daemon
// - shared-fluent
// - shared-icons

const kSharedDeps = [
  {
    name: "shared-all",
    kind: "virtual",
    deps: ["shared-fluent", "shared-api-daemon", "shared-icons"],
  },
  {
    name: "shared-api-daemon",
    kind: "sharedWindowModule",
    param: ["js/api_daemon.js", "apiDaemon", "ApiDaemon"],
  },
  { name: "shared-fluent", kind: "sharedScript", param: "js/fluent-web.js" },
  {
    name: "shared-icons",
    kind: "sharedModule",
    param: "components/lucide_icon.js",
    deps: ["lucide"],
  },
  {
    name: "lucide",
    kind: "sharedStyle",
    param: "lucide/Lucide.css",
  },
  {
    name: "panel manager",
    kind: "sharedModule",
    param: "js/panel_manager.js",
  },
];

// Triggers dependency fetching for one or several shared targets.
function getSharedDeps(names) {
  let graph = new ParallelGraphLoader(kSharedDeps);

  if (Array.isArray(names)) {
    let deps = names.map((name) => graph.waitForDeps(name));
    return Promise.all(deps);
  } else {
    return graph.waitForDeps(names);
  }
}

const kValidShoelaceNames = new Set([
  "alert",
  "avatar",
  "badge",
  "breadcrumb",
  "breadcrumb-item",
  "button",
  "button-group",
  "card",
  "checkbox",
  "color-picker",
  "details",
  "dialog",
  "divider",
  "drawer",
  "dropdown",
  "icon",
  "icon-button",
  "input",
  "menu",
  "menu-item",
  "menu-label",
  "progress-bar",
  "progress-ring",
  "qr-code",
  "radio",
  "radio-group",
  "range",
  "rating",
  "select",
  "skeleton",
  "spinner",
  "switch",
  "tab",
  "tab-group",
  "tab-panel",
  "tag",
  "textarea",
  "tooltip",
]);

// Adds the declaration for all the needed Shoelace components, by looking at dependency names.
function addShoelaceDeps(currentDeps) {
  let components = new Set();
  currentDeps.forEach((declaration) => {
    declaration.deps?.forEach((dep) => {
      if (dep.startsWith("shoelace-")) {
        let name = dep.substring(9);
        if (kValidShoelaceNames.has(name) && !components.has(name)) {
          components.add(name);
        }
      }
    });
  });

  for (let name of components) {
    currentDeps.push({
      name: `shoelace-${name}`,
      kind: "shoelaceComp",
      param: name,
    });
  }

  // Add the light and dark theme dependencies.
  currentDeps.push({
    name: "shoelace-light-theme",
    kind: "sharedStyle",
    param: "shoelace/themes/light.css",
  });
  currentDeps.push({
    name: "shoelace-dark-theme",
    kind: "sharedStyle",
    param: "shoelace/themes/dark.css",
  });

  // Add the dependency for shoelace-setup
  currentDeps.push({
    name: "shoelace-setup",
    kind: "sharedModule",
    param: "js/shoelace_setup.js",
    deps: ["shoelace-api-daemon"],
  });
  currentDeps.push({
    name: "shoelace-api-daemon",
    kind: "sharedWindowModule",
    param: ["js/api_daemon.js", "apiDaemon", "ApiDaemon"],
  });

  return currentDeps;
}
