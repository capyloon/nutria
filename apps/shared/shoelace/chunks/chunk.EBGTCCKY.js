// node_modules/@shoelace-style/localize/dist/index.js
var connectedElements = /* @__PURE__ */ new Set();
var documentElementObserver = new MutationObserver(update);
var translations = /* @__PURE__ */ new Map();
var documentLanguage = document.documentElement.lang || navigator.language;
var fallback;
documentElementObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["lang"]
});
function registerTranslation(...translation2) {
  translation2.map((t) => {
    const code = t.$code.toLowerCase();
    translations.set(code, t);
    if (!fallback) {
      fallback = t;
    }
  });
  update();
}
function term(lang, key, ...args) {
  const code = lang.toLowerCase().slice(0, 2);
  const subcode = lang.length > 2 ? lang.toLowerCase() : "";
  const primary = translations.get(subcode);
  const secondary = translations.get(code);
  let term2;
  if (primary && primary[key]) {
    term2 = primary[key];
  } else if (secondary && secondary[key]) {
    term2 = secondary[key];
  } else if (fallback && fallback[key]) {
    term2 = fallback[key];
  } else {
    console.error(`No translation found for: ${key}`);
    return key;
  }
  if (typeof term2 === "function") {
    return term2(...args);
  }
  return term2;
}
function date(lang, dateToFormat, options) {
  dateToFormat = new Date(dateToFormat);
  return new Intl.DateTimeFormat(lang, options).format(dateToFormat);
}
function number(lang, numberToFormat, options) {
  numberToFormat = Number(numberToFormat);
  return isNaN(numberToFormat) ? "" : new Intl.NumberFormat(lang, options).format(numberToFormat);
}
function relativeTime(lang, value, unit, options) {
  return new Intl.RelativeTimeFormat(lang, options).format(value, unit);
}
function update() {
  documentLanguage = document.documentElement.lang || navigator.language;
  [...connectedElements.keys()].map((el) => {
    if (typeof el.requestUpdate === "function") {
      el.requestUpdate();
    }
  });
}
var LocalizeController = class {
  constructor(host) {
    this.host = host;
    this.host.addController(this);
  }
  hostConnected() {
    connectedElements.add(this.host);
  }
  hostDisconnected() {
    connectedElements.delete(this.host);
  }
  term(key, ...args) {
    return term(this.host.lang || documentLanguage, key, ...args);
  }
  date(dateToFormat, options) {
    return date(this.host.lang || documentLanguage, dateToFormat, options);
  }
  number(numberToFormat, options) {
    return number(this.host.lang || documentLanguage, numberToFormat, options);
  }
  relativeTime(value, unit, options) {
    return relativeTime(this.host.lang || documentLanguage, value, unit, options);
  }
};

// src/translations/en.ts
var translation = {
  $code: "en",
  $name: "English",
  $dir: "ltr",
  close: "Close",
  copy: "Copy",
  progress: "Progress",
  resize: "Resize",
  scrollToEnd: "Scroll to end",
  scrollToStart: "Scroll to start",
  selectAColorFromTheScreen: "Select a color from the screen",
  toggleColorFormat: "Toggle color format"
};
registerTranslation(translation);
var en_default = translation;

export {
  en_default,
  registerTranslation,
  term,
  date,
  number,
  relativeTime,
  update,
  LocalizeController
};
