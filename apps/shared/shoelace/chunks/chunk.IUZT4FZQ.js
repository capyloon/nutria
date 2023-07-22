import {
  registerTranslation
} from "./chunk.BDQVKHPN.js";

// src/translations/de.ts
var translation = {
  $code: "de",
  $name: "Deutsch",
  $dir: "ltr",
  carousel: "Karussell",
  clearEntry: "Eingabe l\xF6schen",
  close: "Schlie\xDFen",
  copy: "Kopieren",
  currentValue: "Aktueller Wert",
  goToSlide: (slide, count) => `Gehen Sie zu Folie ${slide} von ${count}`,
  hidePassword: "Passwort verbergen",
  loading: "Wird geladen",
  nextSlide: "N\xE4chste Folie",
  numOptionsSelected: (num) => {
    if (num === 0)
      return "Keine Optionen ausgew\xE4hlt";
    if (num === 1)
      return "1 Option ausgew\xE4hlt";
    return `${num} Optionen ausgew\xE4hlt`;
  },
  previousSlide: "Vorherige Folie",
  progress: "Fortschritt",
  remove: "Entfernen",
  resize: "Gr\xF6\xDFe \xE4ndern",
  scrollToEnd: "Zum Ende scrollen",
  scrollToStart: "Zum Anfang scrollen",
  selectAColorFromTheScreen: "W\xE4hle eine Farbe vom Bildschirm",
  showPassword: "Passwort anzeigen",
  slideNum: (slide) => `Folie ${slide}`,
  toggleColorFormat: "Farbformat umschalten"
};
registerTranslation(translation);
var de_default = translation;

export {
  de_default
};
