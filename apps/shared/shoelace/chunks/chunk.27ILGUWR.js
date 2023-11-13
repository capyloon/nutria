// node_modules/lit-element/node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t5, e7, o7) {
    if (this._$cssResult$ = true, o7 !== s)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5, this.t = e7;
  }
  get styleSheet() {
    let t5 = this.o;
    const s6 = this.t;
    if (e && void 0 === t5) {
      const e7 = void 0 !== s6 && 1 === s6.length;
      e7 && (t5 = o.get(s6)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e7 && o.set(s6, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
var i = (t5, ...e7) => {
  const o7 = 1 === t5.length ? t5[0] : e7.reduce((e8, s6, o8) => e8 + ((t6) => {
    if (true === t6._$cssResult$)
      return t6.cssText;
    if ("number" == typeof t6)
      return t6;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s6) + t5[o8 + 1], t5[0]);
  return new n(o7, t5, s);
};
var S = (s6, o7) => {
  if (e)
    s6.adoptedStyleSheets = o7.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
  else
    for (const e7 of o7) {
      const o8 = document.createElement("style"), n7 = t.litNonce;
      void 0 !== n7 && o8.setAttribute("nonce", n7), o8.textContent = e7.cssText, s6.appendChild(o8);
    }
};
var c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e7 = "";
  for (const s6 of t6.cssRules)
    e7 += s6.cssText;
  return r(e7);
})(t5) : t5;

// node_modules/lit-element/node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: r2, getOwnPropertyNames: h, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t5, s6) => t5;
var u = { toAttribute(t5, s6) {
  switch (s6) {
    case Boolean:
      t5 = t5 ? l : null;
      break;
    case Object:
    case Array:
      t5 = null == t5 ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, s6) {
  let i7 = t5;
  switch (s6) {
    case Boolean:
      i7 = null !== t5;
      break;
    case Number:
      i7 = null === t5 ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        i7 = JSON.parse(t5);
      } catch (t6) {
        i7 = null;
      }
  }
  return i7;
} };
var f = (t5, s6) => !i2(t5, s6);
var y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var _a, _b;
(_a = Symbol.metadata) != null ? _a : Symbol.metadata = Symbol("metadata"), (_b = a.litPropertyMetadata) != null ? _b : a.litPropertyMetadata = /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
  static addInitializer(t5) {
    var _a9;
    this._$Ei(), ((_a9 = this.l) != null ? _a9 : this.l = []).push(t5);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t5, s6 = y) {
    if (s6.state && (s6.attribute = false), this._$Ei(), this.elementProperties.set(t5, s6), !s6.noAccessor) {
      const i7 = Symbol(), r8 = this.getPropertyDescriptor(t5, i7, s6);
      void 0 !== r8 && e2(this.prototype, t5, r8);
    }
  }
  static getPropertyDescriptor(t5, s6, i7) {
    var _a9;
    const { get: e7, set: h5 } = (_a9 = r2(this.prototype, t5)) != null ? _a9 : { get() {
      return this[s6];
    }, set(t6) {
      this[s6] = t6;
    } };
    return { get() {
      return e7 == null ? void 0 : e7.call(this);
    }, set(s7) {
      const r8 = e7 == null ? void 0 : e7.call(this);
      h5.call(this, s7), this.requestUpdate(t5, r8, i7);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    var _a9;
    return (_a9 = this.elementProperties.get(t5)) != null ? _a9 : y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties")))
      return;
    const t5 = n2(this);
    t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized")))
      return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t6 = this.properties, s6 = [...h(t6), ...o2(t6)];
      for (const i7 of s6)
        this.createProperty(i7, t6[i7]);
    }
    const t5 = this[Symbol.metadata];
    if (null !== t5) {
      const s6 = litPropertyMetadata.get(t5);
      if (void 0 !== s6)
        for (const [t6, i7] of s6)
          this.elementProperties.set(t6, i7);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t6, s6] of this.elementProperties) {
      const i7 = this._$Eu(t6, s6);
      void 0 !== i7 && this._$Eh.set(i7, t6);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s6) {
    const i7 = [];
    if (Array.isArray(s6)) {
      const e7 = new Set(s6.flat(1 / 0).reverse());
      for (const s7 of e7)
        i7.unshift(c(s7));
    } else
      void 0 !== s6 && i7.push(c(s6));
    return i7;
  }
  static _$Eu(t5, s6) {
    const i7 = s6.attribute;
    return false === i7 ? void 0 : "string" == typeof i7 ? i7 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a9;
    this._$Eg = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a9 = this.constructor.l) == null ? void 0 : _a9.forEach((t5) => t5(this));
  }
  addController(t5) {
    var _a9, _b4;
    ((_a9 = this._$ES) != null ? _a9 : this._$ES = []).push(t5), void 0 !== this.renderRoot && this.isConnected && ((_b4 = t5.hostConnected) == null ? void 0 : _b4.call(t5));
  }
  removeController(t5) {
    var _a9;
    (_a9 = this._$ES) == null ? void 0 : _a9.splice(this._$ES.indexOf(t5) >>> 0, 1);
  }
  _$E_() {
    const t5 = /* @__PURE__ */ new Map(), s6 = this.constructor.elementProperties;
    for (const i7 of s6.keys())
      this.hasOwnProperty(i7) && (t5.set(i7, this[i7]), delete this[i7]);
    t5.size > 0 && (this._$Ep = t5);
  }
  createRenderRoot() {
    var _a9;
    const t5 = (_a9 = this.shadowRoot) != null ? _a9 : this.attachShadow(this.constructor.shadowRootOptions);
    return S(t5, this.constructor.elementStyles), t5;
  }
  connectedCallback() {
    var _a9, _b4;
    (_a9 = this.renderRoot) != null ? _a9 : this.renderRoot = this.createRenderRoot(), this.enableUpdating(true), (_b4 = this._$ES) == null ? void 0 : _b4.forEach((t5) => {
      var _a10;
      return (_a10 = t5.hostConnected) == null ? void 0 : _a10.call(t5);
    });
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    var _a9;
    (_a9 = this._$ES) == null ? void 0 : _a9.forEach((t5) => {
      var _a10;
      return (_a10 = t5.hostDisconnected) == null ? void 0 : _a10.call(t5);
    });
  }
  attributeChangedCallback(t5, s6, i7) {
    this._$AK(t5, i7);
  }
  _$EO(t5, s6) {
    var _a9;
    const i7 = this.constructor.elementProperties.get(t5), e7 = this.constructor._$Eu(t5, i7);
    if (void 0 !== e7 && true === i7.reflect) {
      const r8 = (void 0 !== ((_a9 = i7.converter) == null ? void 0 : _a9.toAttribute) ? i7.converter : u).toAttribute(s6, i7.type);
      this._$Em = t5, null == r8 ? this.removeAttribute(e7) : this.setAttribute(e7, r8), this._$Em = null;
    }
  }
  _$AK(t5, s6) {
    var _a9;
    const i7 = this.constructor, e7 = i7._$Eh.get(t5);
    if (void 0 !== e7 && this._$Em !== e7) {
      const t6 = i7.getPropertyOptions(e7), r8 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== ((_a9 = t6.converter) == null ? void 0 : _a9.fromAttribute) ? t6.converter : u;
      this._$Em = e7, this[e7] = r8.fromAttribute(s6, t6.type), this._$Em = null;
    }
  }
  requestUpdate(t5, s6, i7, e7 = false, r8) {
    var _a9;
    if (void 0 !== t5) {
      if (i7 != null ? i7 : i7 = this.constructor.getPropertyOptions(t5), !((_a9 = i7.hasChanged) != null ? _a9 : f)(e7 ? r8 : this[t5], s6))
        return;
      this.C(t5, s6, i7);
    }
    false === this.isUpdatePending && (this._$Eg = this._$EP());
  }
  C(t5, s6, i7) {
    var _a9;
    this._$AL.has(t5) || this._$AL.set(t5, s6), true === i7.reflect && this._$Em !== t5 && ((_a9 = this._$Ej) != null ? _a9 : this._$Ej = /* @__PURE__ */ new Set()).add(t5);
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$Eg;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && await t5, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a9;
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this._$Ep) {
        for (const [t7, s7] of this._$Ep)
          this[t7] = s7;
        this._$Ep = void 0;
      }
      const t6 = this.constructor.elementProperties;
      if (t6.size > 0)
        for (const [s7, i7] of t6)
          true !== i7.wrapped || this._$AL.has(s7) || void 0 === this[s7] || this.C(s7, this[s7], i7);
    }
    let t5 = false;
    const s6 = this._$AL;
    try {
      t5 = this.shouldUpdate(s6), t5 ? (this.willUpdate(s6), (_a9 = this._$ES) == null ? void 0 : _a9.forEach((t6) => {
        var _a10;
        return (_a10 = t6.hostUpdate) == null ? void 0 : _a10.call(t6);
      }), this.update(s6)) : this._$ET();
    } catch (s7) {
      throw t5 = false, this._$ET(), s7;
    }
    t5 && this._$AE(s6);
  }
  willUpdate(t5) {
  }
  _$AE(t5) {
    var _a9;
    (_a9 = this._$ES) == null ? void 0 : _a9.forEach((t6) => {
      var _a10;
      return (_a10 = t6.hostUpdated) == null ? void 0 : _a10.call(t6);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
  }
  _$ET() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$Eg;
  }
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((t6) => this._$EO(t6, this[t6]))), this._$ET();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
var _a2;
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p == null ? void 0 : p({ ReactiveElement: b }), ((_a2 = a.reactiveElementVersions) != null ? _a2 : a.reactiveElementVersions = []).push("2.0.0");

// node_modules/lit-element/node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = t2.trustedTypes;
var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var e3 = "$lit$";
var h2 = `lit$${(Math.random() + "").slice(9)}$`;
var o3 = "?" + h2;
var n3 = `<${o3}>`;
var r3 = document;
var l2 = () => r3.createComment("");
var c3 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var a2 = Array.isArray;
var u2 = (t5) => a2(t5) || "function" == typeof (t5 == null ? void 0 : t5[Symbol.iterator]);
var d2 = "[ 	\n\f\r]";
var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var v = /-->/g;
var _ = />/g;
var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var p2 = /'/g;
var g = /"/g;
var $ = /^(?:script|style|textarea|title)$/i;
var y2 = (t5) => (i7, ...s6) => ({ _$litType$: t5, strings: i7, values: s6 });
var x = y2(1);
var b2 = y2(2);
var w = Symbol.for("lit-noChange");
var T = Symbol.for("lit-nothing");
var A = /* @__PURE__ */ new WeakMap();
var E = r3.createTreeWalker(r3, 129);
function C(t5, i7) {
  if (!Array.isArray(t5) || !t5.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== s2 ? s2.createHTML(i7) : i7;
}
var P = (t5, i7) => {
  const s6 = t5.length - 1, o7 = [];
  let r8, l5 = 2 === i7 ? "<svg>" : "", c7 = f2;
  for (let i8 = 0; i8 < s6; i8++) {
    const s7 = t5[i8];
    let a5, u5, d5 = -1, y5 = 0;
    for (; y5 < s7.length && (c7.lastIndex = y5, u5 = c7.exec(s7), null !== u5); )
      y5 = c7.lastIndex, c7 === f2 ? "!--" === u5[1] ? c7 = v : void 0 !== u5[1] ? c7 = _ : void 0 !== u5[2] ? ($.test(u5[2]) && (r8 = RegExp("</" + u5[2], "g")), c7 = m) : void 0 !== u5[3] && (c7 = m) : c7 === m ? ">" === u5[0] ? (c7 = r8 != null ? r8 : f2, d5 = -1) : void 0 === u5[1] ? d5 = -2 : (d5 = c7.lastIndex - u5[2].length, a5 = u5[1], c7 = void 0 === u5[3] ? m : '"' === u5[3] ? g : p2) : c7 === g || c7 === p2 ? c7 = m : c7 === v || c7 === _ ? c7 = f2 : (c7 = m, r8 = void 0);
    const x3 = c7 === m && t5[i8 + 1].startsWith("/>") ? " " : "";
    l5 += c7 === f2 ? s7 + n3 : d5 >= 0 ? (o7.push(a5), s7.slice(0, d5) + e3 + s7.slice(d5) + h2 + x3) : s7 + h2 + (-2 === d5 ? i8 : x3);
  }
  return [C(t5, l5 + (t5[s6] || "<?>") + (2 === i7 ? "</svg>" : "")), o7];
};
var V = class _V {
  constructor({ strings: t5, _$litType$: s6 }, n7) {
    let r8;
    this.parts = [];
    let c7 = 0, a5 = 0;
    const u5 = t5.length - 1, d5 = this.parts, [f5, v3] = P(t5, s6);
    if (this.el = _V.createElement(f5, n7), E.currentNode = this.el.content, 2 === s6) {
      const t6 = this.el.content.firstChild;
      t6.replaceWith(...t6.childNodes);
    }
    for (; null !== (r8 = E.nextNode()) && d5.length < u5; ) {
      if (1 === r8.nodeType) {
        if (r8.hasAttributes())
          for (const t6 of r8.getAttributeNames())
            if (t6.endsWith(e3)) {
              const i7 = v3[a5++], s7 = r8.getAttribute(t6).split(h2), e7 = /([.?@])?(.*)/.exec(i7);
              d5.push({ type: 1, index: c7, name: e7[2], strings: s7, ctor: "." === e7[1] ? k : "?" === e7[1] ? H : "@" === e7[1] ? I : R }), r8.removeAttribute(t6);
            } else
              t6.startsWith(h2) && (d5.push({ type: 6, index: c7 }), r8.removeAttribute(t6));
        if ($.test(r8.tagName)) {
          const t6 = r8.textContent.split(h2), s7 = t6.length - 1;
          if (s7 > 0) {
            r8.textContent = i3 ? i3.emptyScript : "";
            for (let i7 = 0; i7 < s7; i7++)
              r8.append(t6[i7], l2()), E.nextNode(), d5.push({ type: 2, index: ++c7 });
            r8.append(t6[s7], l2());
          }
        }
      } else if (8 === r8.nodeType)
        if (r8.data === o3)
          d5.push({ type: 2, index: c7 });
        else {
          let t6 = -1;
          for (; -1 !== (t6 = r8.data.indexOf(h2, t6 + 1)); )
            d5.push({ type: 7, index: c7 }), t6 += h2.length - 1;
        }
      c7++;
    }
  }
  static createElement(t5, i7) {
    const s6 = r3.createElement("template");
    return s6.innerHTML = t5, s6;
  }
};
function N(t5, i7, s6 = t5, e7) {
  var _a9, _b3, _c;
  if (i7 === w)
    return i7;
  let h5 = void 0 !== e7 ? (_a9 = s6._$Co) == null ? void 0 : _a9[e7] : s6._$Cl;
  const o7 = c3(i7) ? void 0 : i7._$litDirective$;
  return (h5 == null ? void 0 : h5.constructor) !== o7 && ((_b3 = h5 == null ? void 0 : h5._$AO) == null ? void 0 : _b3.call(h5, false), void 0 === o7 ? h5 = void 0 : (h5 = new o7(t5), h5._$AT(t5, s6, e7)), void 0 !== e7 ? ((_c = s6._$Co) != null ? _c : s6._$Co = [])[e7] = h5 : s6._$Cl = h5), void 0 !== h5 && (i7 = N(t5, h5._$AS(t5, i7.values), h5, e7)), i7;
}
var S2 = class {
  constructor(t5, i7) {
    this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i7;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t5) {
    var _a9;
    const { el: { content: i7 }, parts: s6 } = this._$AD, e7 = ((_a9 = t5 == null ? void 0 : t5.creationScope) != null ? _a9 : r3).importNode(i7, true);
    E.currentNode = e7;
    let h5 = E.nextNode(), o7 = 0, n7 = 0, l5 = s6[0];
    for (; void 0 !== l5; ) {
      if (o7 === l5.index) {
        let i8;
        2 === l5.type ? i8 = new M(h5, h5.nextSibling, this, t5) : 1 === l5.type ? i8 = new l5.ctor(h5, l5.name, l5.strings, this, t5) : 6 === l5.type && (i8 = new L(h5, this, t5)), this._$AV.push(i8), l5 = s6[++n7];
      }
      o7 !== (l5 == null ? void 0 : l5.index) && (h5 = E.nextNode(), o7++);
    }
    return E.currentNode = r3, e7;
  }
  p(t5) {
    let i7 = 0;
    for (const s6 of this._$AV)
      void 0 !== s6 && (void 0 !== s6.strings ? (s6._$AI(t5, s6, i7), i7 += s6.strings.length - 2) : s6._$AI(t5[i7])), i7++;
  }
};
var M = class _M {
  get _$AU() {
    var _a9, _b3;
    return (_b3 = (_a9 = this._$AM) == null ? void 0 : _a9._$AU) != null ? _b3 : this._$Cv;
  }
  constructor(t5, i7, s6, e7) {
    var _a9;
    this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t5, this._$AB = i7, this._$AM = s6, this.options = e7, this._$Cv = (_a9 = e7 == null ? void 0 : e7.isConnected) != null ? _a9 : true;
  }
  get parentNode() {
    let t5 = this._$AA.parentNode;
    const i7 = this._$AM;
    return void 0 !== i7 && 11 === (t5 == null ? void 0 : t5.nodeType) && (t5 = i7.parentNode), t5;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t5, i7 = this) {
    t5 = N(this, t5, i7), c3(t5) ? t5 === T || null == t5 || "" === t5 ? (this._$AH !== T && this._$AR(), this._$AH = T) : t5 !== this._$AH && t5 !== w && this._(t5) : void 0 !== t5._$litType$ ? this.g(t5) : void 0 !== t5.nodeType ? this.$(t5) : u2(t5) ? this.T(t5) : this._(t5);
  }
  k(t5) {
    return this._$AA.parentNode.insertBefore(t5, this._$AB);
  }
  $(t5) {
    this._$AH !== t5 && (this._$AR(), this._$AH = this.k(t5));
  }
  _(t5) {
    this._$AH !== T && c3(this._$AH) ? this._$AA.nextSibling.data = t5 : this.$(r3.createTextNode(t5)), this._$AH = t5;
  }
  g(t5) {
    var _a9;
    const { values: i7, _$litType$: s6 } = t5, e7 = "number" == typeof s6 ? this._$AC(t5) : (void 0 === s6.el && (s6.el = V.createElement(C(s6.h, s6.h[0]), this.options)), s6);
    if (((_a9 = this._$AH) == null ? void 0 : _a9._$AD) === e7)
      this._$AH.p(i7);
    else {
      const t6 = new S2(e7, this), s7 = t6.u(this.options);
      t6.p(i7), this.$(s7), this._$AH = t6;
    }
  }
  _$AC(t5) {
    let i7 = A.get(t5.strings);
    return void 0 === i7 && A.set(t5.strings, i7 = new V(t5)), i7;
  }
  T(t5) {
    a2(this._$AH) || (this._$AH = [], this._$AR());
    const i7 = this._$AH;
    let s6, e7 = 0;
    for (const h5 of t5)
      e7 === i7.length ? i7.push(s6 = new _M(this.k(l2()), this.k(l2()), this, this.options)) : s6 = i7[e7], s6._$AI(h5), e7++;
    e7 < i7.length && (this._$AR(s6 && s6._$AB.nextSibling, e7), i7.length = e7);
  }
  _$AR(t5 = this._$AA.nextSibling, i7) {
    var _a9;
    for ((_a9 = this._$AP) == null ? void 0 : _a9.call(this, false, true, i7); t5 && t5 !== this._$AB; ) {
      const i8 = t5.nextSibling;
      t5.remove(), t5 = i8;
    }
  }
  setConnected(t5) {
    var _a9;
    void 0 === this._$AM && (this._$Cv = t5, (_a9 = this._$AP) == null ? void 0 : _a9.call(this, t5));
  }
};
var R = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t5, i7, s6, e7, h5) {
    this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t5, this.name = i7, this._$AM = e7, this.options = h5, s6.length > 2 || "" !== s6[0] || "" !== s6[1] ? (this._$AH = Array(s6.length - 1).fill(new String()), this.strings = s6) : this._$AH = T;
  }
  _$AI(t5, i7 = this, s6, e7) {
    const h5 = this.strings;
    let o7 = false;
    if (void 0 === h5)
      t5 = N(this, t5, i7, 0), o7 = !c3(t5) || t5 !== this._$AH && t5 !== w, o7 && (this._$AH = t5);
    else {
      const e8 = t5;
      let n7, r8;
      for (t5 = h5[0], n7 = 0; n7 < h5.length - 1; n7++)
        r8 = N(this, e8[s6 + n7], i7, n7), r8 === w && (r8 = this._$AH[n7]), o7 || (o7 = !c3(r8) || r8 !== this._$AH[n7]), r8 === T ? t5 = T : t5 !== T && (t5 += (r8 != null ? r8 : "") + h5[n7 + 1]), this._$AH[n7] = r8;
    }
    o7 && !e7 && this.j(t5);
  }
  j(t5) {
    t5 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 != null ? t5 : "");
  }
};
var k = class extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t5) {
    this.element[this.name] = t5 === T ? void 0 : t5;
  }
};
var H = class extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t5) {
    this.element.toggleAttribute(this.name, !!t5 && t5 !== T);
  }
};
var I = class extends R {
  constructor(t5, i7, s6, e7, h5) {
    super(t5, i7, s6, e7, h5), this.type = 5;
  }
  _$AI(t5, i7 = this) {
    var _a9;
    if ((t5 = (_a9 = N(this, t5, i7, 0)) != null ? _a9 : T) === w)
      return;
    const s6 = this._$AH, e7 = t5 === T && s6 !== T || t5.capture !== s6.capture || t5.once !== s6.once || t5.passive !== s6.passive, h5 = t5 !== T && (s6 === T || e7);
    e7 && this.element.removeEventListener(this.name, this, s6), h5 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
  }
  handleEvent(t5) {
    var _a9, _b3;
    "function" == typeof this._$AH ? this._$AH.call((_b3 = (_a9 = this.options) == null ? void 0 : _a9.host) != null ? _b3 : this.element, t5) : this._$AH.handleEvent(t5);
  }
};
var L = class {
  constructor(t5, i7, s6) {
    this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s6;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    N(this, t5);
  }
};
var Z = t2.litHtmlPolyfillSupport;
var _a3;
Z == null ? void 0 : Z(V, M), ((_a3 = t2.litHtmlVersions) != null ? _a3 : t2.litHtmlVersions = []).push("3.0.0");
var j = (t5, i7, s6) => {
  var _a9, _b3;
  const e7 = (_a9 = s6 == null ? void 0 : s6.renderBefore) != null ? _a9 : i7;
  let h5 = e7._$litPart$;
  if (void 0 === h5) {
    const t6 = (_b3 = s6 == null ? void 0 : s6.renderBefore) != null ? _b3 : null;
    e7._$litPart$ = h5 = new M(i7.insertBefore(l2(), t6), t6, void 0, s6 != null ? s6 : {});
  }
  return h5._$AI(t5), h5;
};

// node_modules/lit/node_modules/@lit/reactive-element/css-tag.js
var t3 = globalThis;
var e4 = t3.ShadowRoot && (void 0 === t3.ShadyCSS || t3.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s3 = Symbol();
var o4 = /* @__PURE__ */ new WeakMap();
var n4 = class {
  constructor(t5, e7, o7) {
    if (this._$cssResult$ = true, o7 !== s3)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5, this.t = e7;
  }
  get styleSheet() {
    let t5 = this.o;
    const s6 = this.t;
    if (e4 && void 0 === t5) {
      const e7 = void 0 !== s6 && 1 === s6.length;
      e7 && (t5 = o4.get(s6)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e7 && o4.set(s6, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r4 = (t5) => new n4("string" == typeof t5 ? t5 : t5 + "", void 0, s3);
var S3 = (s6, o7) => {
  if (e4)
    s6.adoptedStyleSheets = o7.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
  else
    for (const e7 of o7) {
      const o8 = document.createElement("style"), n7 = t3.litNonce;
      void 0 !== n7 && o8.setAttribute("nonce", n7), o8.textContent = e7.cssText, s6.appendChild(o8);
    }
};
var c4 = e4 ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e7 = "";
  for (const s6 of t6.cssRules)
    e7 += s6.cssText;
  return r4(e7);
})(t5) : t5;

// node_modules/lit/node_modules/@lit/reactive-element/reactive-element.js
var { is: i5, defineProperty: e5, getOwnPropertyDescriptor: r5, getOwnPropertyNames: h3, getOwnPropertySymbols: o5, getPrototypeOf: n5 } = Object;
var a3 = globalThis;
var c5 = a3.trustedTypes;
var l3 = c5 ? c5.emptyScript : "";
var p3 = a3.reactiveElementPolyfillSupport;
var d3 = (t5, s6) => t5;
var u3 = { toAttribute(t5, s6) {
  switch (s6) {
    case Boolean:
      t5 = t5 ? l3 : null;
      break;
    case Object:
    case Array:
      t5 = null == t5 ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, s6) {
  let i7 = t5;
  switch (s6) {
    case Boolean:
      i7 = null !== t5;
      break;
    case Number:
      i7 = null === t5 ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        i7 = JSON.parse(t5);
      } catch (t6) {
        i7 = null;
      }
  }
  return i7;
} };
var f3 = (t5, s6) => !i5(t5, s6);
var y3 = { attribute: true, type: String, converter: u3, reflect: false, hasChanged: f3 };
var _a4, _b2;
(_a4 = Symbol.metadata) != null ? _a4 : Symbol.metadata = Symbol("metadata"), (_b2 = a3.litPropertyMetadata) != null ? _b2 : a3.litPropertyMetadata = /* @__PURE__ */ new WeakMap();
var b3 = class extends HTMLElement {
  static addInitializer(t5) {
    var _a9;
    this._$Ei(), ((_a9 = this.l) != null ? _a9 : this.l = []).push(t5);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t5, s6 = y3) {
    if (s6.state && (s6.attribute = false), this._$Ei(), this.elementProperties.set(t5, s6), !s6.noAccessor) {
      const i7 = Symbol(), r8 = this.getPropertyDescriptor(t5, i7, s6);
      void 0 !== r8 && e5(this.prototype, t5, r8);
    }
  }
  static getPropertyDescriptor(t5, s6, i7) {
    var _a9;
    const { get: e7, set: h5 } = (_a9 = r5(this.prototype, t5)) != null ? _a9 : { get() {
      return this[s6];
    }, set(t6) {
      this[s6] = t6;
    } };
    return { get() {
      return e7 == null ? void 0 : e7.call(this);
    }, set(s7) {
      const r8 = e7 == null ? void 0 : e7.call(this);
      h5.call(this, s7), this.requestUpdate(t5, r8, i7);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    var _a9;
    return (_a9 = this.elementProperties.get(t5)) != null ? _a9 : y3;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d3("elementProperties")))
      return;
    const t5 = n5(this);
    t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d3("finalized")))
      return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d3("properties"))) {
      const t6 = this.properties, s6 = [...h3(t6), ...o5(t6)];
      for (const i7 of s6)
        this.createProperty(i7, t6[i7]);
    }
    const t5 = this[Symbol.metadata];
    if (null !== t5) {
      const s6 = litPropertyMetadata.get(t5);
      if (void 0 !== s6)
        for (const [t6, i7] of s6)
          this.elementProperties.set(t6, i7);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t6, s6] of this.elementProperties) {
      const i7 = this._$Eu(t6, s6);
      void 0 !== i7 && this._$Eh.set(i7, t6);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s6) {
    const i7 = [];
    if (Array.isArray(s6)) {
      const e7 = new Set(s6.flat(1 / 0).reverse());
      for (const s7 of e7)
        i7.unshift(c4(s7));
    } else
      void 0 !== s6 && i7.push(c4(s6));
    return i7;
  }
  static _$Eu(t5, s6) {
    const i7 = s6.attribute;
    return false === i7 ? void 0 : "string" == typeof i7 ? i7 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a9;
    this._$Eg = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a9 = this.constructor.l) == null ? void 0 : _a9.forEach((t5) => t5(this));
  }
  addController(t5) {
    var _a9, _b4;
    ((_a9 = this._$ES) != null ? _a9 : this._$ES = []).push(t5), void 0 !== this.renderRoot && this.isConnected && ((_b4 = t5.hostConnected) == null ? void 0 : _b4.call(t5));
  }
  removeController(t5) {
    var _a9;
    (_a9 = this._$ES) == null ? void 0 : _a9.splice(this._$ES.indexOf(t5) >>> 0, 1);
  }
  _$E_() {
    const t5 = /* @__PURE__ */ new Map(), s6 = this.constructor.elementProperties;
    for (const i7 of s6.keys())
      this.hasOwnProperty(i7) && (t5.set(i7, this[i7]), delete this[i7]);
    t5.size > 0 && (this._$Ep = t5);
  }
  createRenderRoot() {
    var _a9;
    const t5 = (_a9 = this.shadowRoot) != null ? _a9 : this.attachShadow(this.constructor.shadowRootOptions);
    return S3(t5, this.constructor.elementStyles), t5;
  }
  connectedCallback() {
    var _a9, _b4;
    (_a9 = this.renderRoot) != null ? _a9 : this.renderRoot = this.createRenderRoot(), this.enableUpdating(true), (_b4 = this._$ES) == null ? void 0 : _b4.forEach((t5) => {
      var _a10;
      return (_a10 = t5.hostConnected) == null ? void 0 : _a10.call(t5);
    });
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    var _a9;
    (_a9 = this._$ES) == null ? void 0 : _a9.forEach((t5) => {
      var _a10;
      return (_a10 = t5.hostDisconnected) == null ? void 0 : _a10.call(t5);
    });
  }
  attributeChangedCallback(t5, s6, i7) {
    this._$AK(t5, i7);
  }
  _$EO(t5, s6) {
    var _a9;
    const i7 = this.constructor.elementProperties.get(t5), e7 = this.constructor._$Eu(t5, i7);
    if (void 0 !== e7 && true === i7.reflect) {
      const r8 = (void 0 !== ((_a9 = i7.converter) == null ? void 0 : _a9.toAttribute) ? i7.converter : u3).toAttribute(s6, i7.type);
      this._$Em = t5, null == r8 ? this.removeAttribute(e7) : this.setAttribute(e7, r8), this._$Em = null;
    }
  }
  _$AK(t5, s6) {
    var _a9;
    const i7 = this.constructor, e7 = i7._$Eh.get(t5);
    if (void 0 !== e7 && this._$Em !== e7) {
      const t6 = i7.getPropertyOptions(e7), r8 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== ((_a9 = t6.converter) == null ? void 0 : _a9.fromAttribute) ? t6.converter : u3;
      this._$Em = e7, this[e7] = r8.fromAttribute(s6, t6.type), this._$Em = null;
    }
  }
  requestUpdate(t5, s6, i7, e7 = false, r8) {
    var _a9;
    if (void 0 !== t5) {
      if (i7 != null ? i7 : i7 = this.constructor.getPropertyOptions(t5), !((_a9 = i7.hasChanged) != null ? _a9 : f3)(e7 ? r8 : this[t5], s6))
        return;
      this.C(t5, s6, i7);
    }
    false === this.isUpdatePending && (this._$Eg = this._$EP());
  }
  C(t5, s6, i7) {
    var _a9;
    this._$AL.has(t5) || this._$AL.set(t5, s6), true === i7.reflect && this._$Em !== t5 && ((_a9 = this._$Ej) != null ? _a9 : this._$Ej = /* @__PURE__ */ new Set()).add(t5);
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$Eg;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && await t5, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a9;
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this._$Ep) {
        for (const [t7, s7] of this._$Ep)
          this[t7] = s7;
        this._$Ep = void 0;
      }
      const t6 = this.constructor.elementProperties;
      if (t6.size > 0)
        for (const [s7, i7] of t6)
          true !== i7.wrapped || this._$AL.has(s7) || void 0 === this[s7] || this.C(s7, this[s7], i7);
    }
    let t5 = false;
    const s6 = this._$AL;
    try {
      t5 = this.shouldUpdate(s6), t5 ? (this.willUpdate(s6), (_a9 = this._$ES) == null ? void 0 : _a9.forEach((t6) => {
        var _a10;
        return (_a10 = t6.hostUpdate) == null ? void 0 : _a10.call(t6);
      }), this.update(s6)) : this._$ET();
    } catch (s7) {
      throw t5 = false, this._$ET(), s7;
    }
    t5 && this._$AE(s6);
  }
  willUpdate(t5) {
  }
  _$AE(t5) {
    var _a9;
    (_a9 = this._$ES) == null ? void 0 : _a9.forEach((t6) => {
      var _a10;
      return (_a10 = t6.hostUpdated) == null ? void 0 : _a10.call(t6);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
  }
  _$ET() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$Eg;
  }
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((t6) => this._$EO(t6, this[t6]))), this._$ET();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
var _a5;
b3.elementStyles = [], b3.shadowRootOptions = { mode: "open" }, b3[d3("elementProperties")] = /* @__PURE__ */ new Map(), b3[d3("finalized")] = /* @__PURE__ */ new Map(), p3 == null ? void 0 : p3({ ReactiveElement: b3 }), ((_a5 = a3.reactiveElementVersions) != null ? _a5 : a3.reactiveElementVersions = []).push("2.0.0");

// node_modules/lit/node_modules/lit-html/lit-html.js
var t4 = globalThis;
var i6 = t4.trustedTypes;
var s4 = i6 ? i6.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var e6 = "$lit$";
var h4 = `lit$${(Math.random() + "").slice(9)}$`;
var o6 = "?" + h4;
var n6 = `<${o6}>`;
var r6 = document;
var l4 = () => r6.createComment("");
var c6 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var a4 = Array.isArray;
var u4 = (t5) => a4(t5) || "function" == typeof (t5 == null ? void 0 : t5[Symbol.iterator]);
var d4 = "[ 	\n\f\r]";
var f4 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var v2 = /-->/g;
var _2 = />/g;
var m2 = RegExp(`>|${d4}(?:([^\\s"'>=/]+)(${d4}*=${d4}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var p4 = /'/g;
var g2 = /"/g;
var $2 = /^(?:script|style|textarea|title)$/i;
var y4 = (t5) => (i7, ...s6) => ({ _$litType$: t5, strings: i7, values: s6 });
var x2 = y4(1);
var b4 = y4(2);
var w2 = Symbol.for("lit-noChange");
var T2 = Symbol.for("lit-nothing");
var A2 = /* @__PURE__ */ new WeakMap();
var E2 = r6.createTreeWalker(r6, 129);
function C2(t5, i7) {
  if (!Array.isArray(t5) || !t5.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return void 0 !== s4 ? s4.createHTML(i7) : i7;
}
var P2 = (t5, i7) => {
  const s6 = t5.length - 1, o7 = [];
  let r8, l5 = 2 === i7 ? "<svg>" : "", c7 = f4;
  for (let i8 = 0; i8 < s6; i8++) {
    const s7 = t5[i8];
    let a5, u5, d5 = -1, y5 = 0;
    for (; y5 < s7.length && (c7.lastIndex = y5, u5 = c7.exec(s7), null !== u5); )
      y5 = c7.lastIndex, c7 === f4 ? "!--" === u5[1] ? c7 = v2 : void 0 !== u5[1] ? c7 = _2 : void 0 !== u5[2] ? ($2.test(u5[2]) && (r8 = RegExp("</" + u5[2], "g")), c7 = m2) : void 0 !== u5[3] && (c7 = m2) : c7 === m2 ? ">" === u5[0] ? (c7 = r8 != null ? r8 : f4, d5 = -1) : void 0 === u5[1] ? d5 = -2 : (d5 = c7.lastIndex - u5[2].length, a5 = u5[1], c7 = void 0 === u5[3] ? m2 : '"' === u5[3] ? g2 : p4) : c7 === g2 || c7 === p4 ? c7 = m2 : c7 === v2 || c7 === _2 ? c7 = f4 : (c7 = m2, r8 = void 0);
    const x3 = c7 === m2 && t5[i8 + 1].startsWith("/>") ? " " : "";
    l5 += c7 === f4 ? s7 + n6 : d5 >= 0 ? (o7.push(a5), s7.slice(0, d5) + e6 + s7.slice(d5) + h4 + x3) : s7 + h4 + (-2 === d5 ? i8 : x3);
  }
  return [C2(t5, l5 + (t5[s6] || "<?>") + (2 === i7 ? "</svg>" : "")), o7];
};
var V2 = class _V {
  constructor({ strings: t5, _$litType$: s6 }, n7) {
    let r8;
    this.parts = [];
    let c7 = 0, a5 = 0;
    const u5 = t5.length - 1, d5 = this.parts, [f5, v3] = P2(t5, s6);
    if (this.el = _V.createElement(f5, n7), E2.currentNode = this.el.content, 2 === s6) {
      const t6 = this.el.content.firstChild;
      t6.replaceWith(...t6.childNodes);
    }
    for (; null !== (r8 = E2.nextNode()) && d5.length < u5; ) {
      if (1 === r8.nodeType) {
        if (r8.hasAttributes())
          for (const t6 of r8.getAttributeNames())
            if (t6.endsWith(e6)) {
              const i7 = v3[a5++], s7 = r8.getAttribute(t6).split(h4), e7 = /([.?@])?(.*)/.exec(i7);
              d5.push({ type: 1, index: c7, name: e7[2], strings: s7, ctor: "." === e7[1] ? k2 : "?" === e7[1] ? H2 : "@" === e7[1] ? I2 : R2 }), r8.removeAttribute(t6);
            } else
              t6.startsWith(h4) && (d5.push({ type: 6, index: c7 }), r8.removeAttribute(t6));
        if ($2.test(r8.tagName)) {
          const t6 = r8.textContent.split(h4), s7 = t6.length - 1;
          if (s7 > 0) {
            r8.textContent = i6 ? i6.emptyScript : "";
            for (let i7 = 0; i7 < s7; i7++)
              r8.append(t6[i7], l4()), E2.nextNode(), d5.push({ type: 2, index: ++c7 });
            r8.append(t6[s7], l4());
          }
        }
      } else if (8 === r8.nodeType)
        if (r8.data === o6)
          d5.push({ type: 2, index: c7 });
        else {
          let t6 = -1;
          for (; -1 !== (t6 = r8.data.indexOf(h4, t6 + 1)); )
            d5.push({ type: 7, index: c7 }), t6 += h4.length - 1;
        }
      c7++;
    }
  }
  static createElement(t5, i7) {
    const s6 = r6.createElement("template");
    return s6.innerHTML = t5, s6;
  }
};
function N2(t5, i7, s6 = t5, e7) {
  var _a9, _b3, _c;
  if (i7 === w2)
    return i7;
  let h5 = void 0 !== e7 ? (_a9 = s6._$Co) == null ? void 0 : _a9[e7] : s6._$Cl;
  const o7 = c6(i7) ? void 0 : i7._$litDirective$;
  return (h5 == null ? void 0 : h5.constructor) !== o7 && ((_b3 = h5 == null ? void 0 : h5._$AO) == null ? void 0 : _b3.call(h5, false), void 0 === o7 ? h5 = void 0 : (h5 = new o7(t5), h5._$AT(t5, s6, e7)), void 0 !== e7 ? ((_c = s6._$Co) != null ? _c : s6._$Co = [])[e7] = h5 : s6._$Cl = h5), void 0 !== h5 && (i7 = N2(t5, h5._$AS(t5, i7.values), h5, e7)), i7;
}
var S4 = class {
  constructor(t5, i7) {
    this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i7;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t5) {
    var _a9;
    const { el: { content: i7 }, parts: s6 } = this._$AD, e7 = ((_a9 = t5 == null ? void 0 : t5.creationScope) != null ? _a9 : r6).importNode(i7, true);
    E2.currentNode = e7;
    let h5 = E2.nextNode(), o7 = 0, n7 = 0, l5 = s6[0];
    for (; void 0 !== l5; ) {
      if (o7 === l5.index) {
        let i8;
        2 === l5.type ? i8 = new M2(h5, h5.nextSibling, this, t5) : 1 === l5.type ? i8 = new l5.ctor(h5, l5.name, l5.strings, this, t5) : 6 === l5.type && (i8 = new L2(h5, this, t5)), this._$AV.push(i8), l5 = s6[++n7];
      }
      o7 !== (l5 == null ? void 0 : l5.index) && (h5 = E2.nextNode(), o7++);
    }
    return E2.currentNode = r6, e7;
  }
  p(t5) {
    let i7 = 0;
    for (const s6 of this._$AV)
      void 0 !== s6 && (void 0 !== s6.strings ? (s6._$AI(t5, s6, i7), i7 += s6.strings.length - 2) : s6._$AI(t5[i7])), i7++;
  }
};
var M2 = class _M {
  get _$AU() {
    var _a9, _b3;
    return (_b3 = (_a9 = this._$AM) == null ? void 0 : _a9._$AU) != null ? _b3 : this._$Cv;
  }
  constructor(t5, i7, s6, e7) {
    var _a9;
    this.type = 2, this._$AH = T2, this._$AN = void 0, this._$AA = t5, this._$AB = i7, this._$AM = s6, this.options = e7, this._$Cv = (_a9 = e7 == null ? void 0 : e7.isConnected) != null ? _a9 : true;
  }
  get parentNode() {
    let t5 = this._$AA.parentNode;
    const i7 = this._$AM;
    return void 0 !== i7 && 11 === (t5 == null ? void 0 : t5.nodeType) && (t5 = i7.parentNode), t5;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t5, i7 = this) {
    t5 = N2(this, t5, i7), c6(t5) ? t5 === T2 || null == t5 || "" === t5 ? (this._$AH !== T2 && this._$AR(), this._$AH = T2) : t5 !== this._$AH && t5 !== w2 && this._(t5) : void 0 !== t5._$litType$ ? this.g(t5) : void 0 !== t5.nodeType ? this.$(t5) : u4(t5) ? this.T(t5) : this._(t5);
  }
  k(t5) {
    return this._$AA.parentNode.insertBefore(t5, this._$AB);
  }
  $(t5) {
    this._$AH !== t5 && (this._$AR(), this._$AH = this.k(t5));
  }
  _(t5) {
    this._$AH !== T2 && c6(this._$AH) ? this._$AA.nextSibling.data = t5 : this.$(r6.createTextNode(t5)), this._$AH = t5;
  }
  g(t5) {
    var _a9;
    const { values: i7, _$litType$: s6 } = t5, e7 = "number" == typeof s6 ? this._$AC(t5) : (void 0 === s6.el && (s6.el = V2.createElement(C2(s6.h, s6.h[0]), this.options)), s6);
    if (((_a9 = this._$AH) == null ? void 0 : _a9._$AD) === e7)
      this._$AH.p(i7);
    else {
      const t6 = new S4(e7, this), s7 = t6.u(this.options);
      t6.p(i7), this.$(s7), this._$AH = t6;
    }
  }
  _$AC(t5) {
    let i7 = A2.get(t5.strings);
    return void 0 === i7 && A2.set(t5.strings, i7 = new V2(t5)), i7;
  }
  T(t5) {
    a4(this._$AH) || (this._$AH = [], this._$AR());
    const i7 = this._$AH;
    let s6, e7 = 0;
    for (const h5 of t5)
      e7 === i7.length ? i7.push(s6 = new _M(this.k(l4()), this.k(l4()), this, this.options)) : s6 = i7[e7], s6._$AI(h5), e7++;
    e7 < i7.length && (this._$AR(s6 && s6._$AB.nextSibling, e7), i7.length = e7);
  }
  _$AR(t5 = this._$AA.nextSibling, i7) {
    var _a9;
    for ((_a9 = this._$AP) == null ? void 0 : _a9.call(this, false, true, i7); t5 && t5 !== this._$AB; ) {
      const i8 = t5.nextSibling;
      t5.remove(), t5 = i8;
    }
  }
  setConnected(t5) {
    var _a9;
    void 0 === this._$AM && (this._$Cv = t5, (_a9 = this._$AP) == null ? void 0 : _a9.call(this, t5));
  }
};
var R2 = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t5, i7, s6, e7, h5) {
    this.type = 1, this._$AH = T2, this._$AN = void 0, this.element = t5, this.name = i7, this._$AM = e7, this.options = h5, s6.length > 2 || "" !== s6[0] || "" !== s6[1] ? (this._$AH = Array(s6.length - 1).fill(new String()), this.strings = s6) : this._$AH = T2;
  }
  _$AI(t5, i7 = this, s6, e7) {
    const h5 = this.strings;
    let o7 = false;
    if (void 0 === h5)
      t5 = N2(this, t5, i7, 0), o7 = !c6(t5) || t5 !== this._$AH && t5 !== w2, o7 && (this._$AH = t5);
    else {
      const e8 = t5;
      let n7, r8;
      for (t5 = h5[0], n7 = 0; n7 < h5.length - 1; n7++)
        r8 = N2(this, e8[s6 + n7], i7, n7), r8 === w2 && (r8 = this._$AH[n7]), o7 || (o7 = !c6(r8) || r8 !== this._$AH[n7]), r8 === T2 ? t5 = T2 : t5 !== T2 && (t5 += (r8 != null ? r8 : "") + h5[n7 + 1]), this._$AH[n7] = r8;
    }
    o7 && !e7 && this.j(t5);
  }
  j(t5) {
    t5 === T2 ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 != null ? t5 : "");
  }
};
var k2 = class extends R2 {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t5) {
    this.element[this.name] = t5 === T2 ? void 0 : t5;
  }
};
var H2 = class extends R2 {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t5) {
    this.element.toggleAttribute(this.name, !!t5 && t5 !== T2);
  }
};
var I2 = class extends R2 {
  constructor(t5, i7, s6, e7, h5) {
    super(t5, i7, s6, e7, h5), this.type = 5;
  }
  _$AI(t5, i7 = this) {
    var _a9;
    if ((t5 = (_a9 = N2(this, t5, i7, 0)) != null ? _a9 : T2) === w2)
      return;
    const s6 = this._$AH, e7 = t5 === T2 && s6 !== T2 || t5.capture !== s6.capture || t5.once !== s6.once || t5.passive !== s6.passive, h5 = t5 !== T2 && (s6 === T2 || e7);
    e7 && this.element.removeEventListener(this.name, this, s6), h5 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
  }
  handleEvent(t5) {
    var _a9, _b3;
    "function" == typeof this._$AH ? this._$AH.call((_b3 = (_a9 = this.options) == null ? void 0 : _a9.host) != null ? _b3 : this.element, t5) : this._$AH.handleEvent(t5);
  }
};
var L2 = class {
  constructor(t5, i7, s6) {
    this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s6;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    N2(this, t5);
  }
};
var z = { S: e6, A: h4, P: o6, C: 1, M: P2, L: S4, R: u4, V: N2, D: M2, I: R2, H: H2, N: I2, U: k2, B: L2 };
var Z2 = t4.litHtmlPolyfillSupport;
var _a6;
Z2 == null ? void 0 : Z2(V2, M2), ((_a6 = t4.litHtmlVersions) != null ? _a6 : t4.litHtmlVersions = []).push("3.0.0");

// node_modules/lit-element/lit-element.js
var s5 = class extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a9, _b3;
    const t5 = super.createRenderRoot();
    return (_b3 = (_a9 = this.renderOptions).renderBefore) != null ? _b3 : _a9.renderBefore = t5.firstChild, t5;
  }
  update(t5) {
    const i7 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = j(i7, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a9;
    super.connectedCallback(), (_a9 = this._$Do) == null ? void 0 : _a9.setConnected(true);
  }
  disconnectedCallback() {
    var _a9;
    super.disconnectedCallback(), (_a9 = this._$Do) == null ? void 0 : _a9.setConnected(false);
  }
  render() {
    return w;
  }
};
var _a7;
s5._$litElement$ = true, s5["finalized", "finalized"] = true, (_a7 = globalThis.litElementHydrateSupport) == null ? void 0 : _a7.call(globalThis, { LitElement: s5 });
var r7 = globalThis.litElementPolyfillSupport;
r7 == null ? void 0 : r7({ LitElement: s5 });
var _a8;
((_a8 = globalThis.litElementVersions) != null ? _a8 : globalThis.litElementVersions = []).push("4.0.0");

export {
  x2 as x,
  b4 as b,
  w2 as w,
  T2 as T,
  z,
  u3 as u,
  f3 as f,
  i,
  u as u2,
  x as x2,
  s5 as s
};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
