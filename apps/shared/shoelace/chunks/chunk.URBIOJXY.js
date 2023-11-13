import {
  f,
  s,
  u
} from "./chunk.27ILGUWR.js";
import {
  __decorateClass,
  __spreadProps,
  __spreadValues
} from "./chunk.YZETUBD6.js";

// node_modules/lit/node_modules/@lit/reactive-element/decorators/property.js
var o = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var r = (t2 = o, e3, r4) => {
  const { kind: n2, metadata: i } = r4;
  let s2 = globalThis.litPropertyMetadata.get(i);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i, s2 = /* @__PURE__ */ new Map()), s2.set(r4.name, t2), "accessor" === n2) {
    const { name: o2 } = r4;
    return { set(r5) {
      const n3 = e3.get.call(this);
      e3.set.call(this, r5), this.requestUpdate(o2, n3, t2);
    }, init(e4) {
      return void 0 !== e4 && this.C(o2, void 0, t2), e4;
    } };
  }
  if ("setter" === n2) {
    const { name: o2 } = r4;
    return function(r5) {
      const n3 = this[o2];
      e3.call(this, r5), this.requestUpdate(o2, n3, t2);
    };
  }
  throw Error("Unsupported decorator location: " + n2);
};
function n(t2) {
  return (e3, o2) => "object" == typeof o2 ? r(t2, e3, o2) : ((t3, e4, o3) => {
    const r4 = e4.hasOwnProperty(o3);
    return e4.constructor.createProperty(o3, r4 ? __spreadProps(__spreadValues({}, t3), { wrapped: true }) : t3), r4 ? Object.getOwnPropertyDescriptor(e4, o3) : void 0;
  })(t2, e3, o2);
}

// node_modules/lit/node_modules/@lit/reactive-element/decorators/state.js
function r2(r4) {
  return n(__spreadProps(__spreadValues({}, r4), { state: true, attribute: false }));
}

// node_modules/lit/node_modules/@lit/reactive-element/decorators/event-options.js
function t(t2) {
  return (n2, o2) => {
    const c = "function" == typeof n2 ? n2 : n2[o2];
    Object.assign(c, t2);
  };
}

// node_modules/lit/node_modules/@lit/reactive-element/decorators/base.js
var e = (e3, t2, c) => (c.configurable = true, c.enumerable = true, Reflect.decorate && "object" != typeof t2 && Object.defineProperty(e3, t2, c), c);

// node_modules/lit/node_modules/@lit/reactive-element/decorators/query.js
function e2(e3, r4) {
  return (n2, s2, i) => {
    const o2 = (t2) => {
      var _a, _b;
      return (_b = (_a = t2.renderRoot) == null ? void 0 : _a.querySelector(e3)) != null ? _b : null;
    };
    if (r4) {
      const { get: e4, set: u2 } = "object" == typeof s2 ? n2 : i != null ? i : (() => {
        const t2 = Symbol();
        return { get() {
          return this[t2];
        }, set(e5) {
          this[t2] = e5;
        } };
      })();
      return e(n2, s2, { get() {
        if (r4) {
          let t2 = e4.call(this);
          return void 0 === t2 && (t2 = o2(this), u2.call(this, t2)), t2;
        }
        return o2(this);
      } });
    }
    return e(n2, s2, { get() {
      return o2(this);
    } });
  };
}

// node_modules/lit/node_modules/@lit/reactive-element/decorators/query-async.js
function r3(r4) {
  return (n2, e3) => e(n2, e3, { async get() {
    var _a, _b;
    return await this.updateComplete, (_b = (_a = this.renderRoot) == null ? void 0 : _a.querySelector(r4)) != null ? _b : null;
  } });
}

// src/internal/shoelace-element.ts
var ShoelaceElement = class extends s {
  constructor() {
    super();
    Object.entries(this.constructor.dependencies).forEach(([name, component]) => {
      this.constructor.define(name, component);
    });
  }
  emit(name, options) {
    const event = new CustomEvent(name, __spreadValues({
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {}
    }, options));
    this.dispatchEvent(event);
    return event;
  }
  /* eslint-enable */
  static define(name, elementConstructor = this, options = {}) {
    const currentlyRegisteredConstructor = customElements.get(name);
    if (!currentlyRegisteredConstructor) {
      customElements.define(name, class extends elementConstructor {
      }, options);
      return;
    }
    let newVersion = " (unknown version)";
    let existingVersion = newVersion;
    if ("version" in elementConstructor && elementConstructor.version) {
      newVersion = " v" + elementConstructor.version;
    }
    if ("version" in currentlyRegisteredConstructor && currentlyRegisteredConstructor.version) {
      existingVersion = " v" + currentlyRegisteredConstructor.version;
    }
    if (newVersion && existingVersion && newVersion === existingVersion) {
      return;
    }
    console.warn(
      `Attempted to register <${name}>${newVersion}, but <${name}>${existingVersion} has already been registered.`
    );
  }
};
/* eslint-disable */
// @ts-expect-error This is auto-injected at build time.
ShoelaceElement.version = "2.11.2";
ShoelaceElement.dependencies = {};
__decorateClass([
  n()
], ShoelaceElement.prototype, "dir", 2);
__decorateClass([
  n()
], ShoelaceElement.prototype, "lang", 2);

export {
  n,
  r2 as r,
  t,
  e2 as e,
  r3 as r2,
  ShoelaceElement
};
/*! Bundled license information:

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
