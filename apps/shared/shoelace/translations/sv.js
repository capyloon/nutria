import "../chunks/chunk.BWLRNN6E.js";
import {
  registerTranslation
} from "../chunks/chunk.BDQVKHPN.js";
import "../chunks/chunk.LKA3TPUC.js";

// src/translations/sv.ts
var translation = {
  $code: "sv",
  $name: "Svenska",
  $dir: "ltr",
  carousel: "Karusell",
  clearEntry: "\xC5terst\xE4ll val",
  close: "St\xE4ng",
  copy: "Kopiera",
  currentValue: "Nuvarande v\xE4rde",
  goToSlide: (slide, count) => `G\xE5 till bild ${slide} av ${count}`,
  hidePassword: "D\xF6lj l\xF6senord",
  loading: "L\xE4ser in",
  nextSlide: "N\xE4sta bild",
  numOptionsSelected: (num) => {
    if (num === 0)
      return "Inga alternativ har valts";
    if (num === 1)
      return "1 alternativ valt";
    return `${num} alternativ valda`;
  },
  previousSlide: "F\xF6reg\xE5ende bild",
  progress: "Framsteg",
  remove: "Ta bort",
  resize: "\xC4ndra storlek",
  scrollToEnd: "Skrolla till slutet",
  scrollToStart: "Skrolla till b\xF6rjan",
  selectAColorFromTheScreen: "V\xE4lj en f\xE4rg fr\xE5n sk\xE4rmen",
  showPassword: "Visa l\xF6senord",
  slideNum: (slide) => `Bild ${slide}`,
  toggleColorFormat: "V\xE4xla f\xE4rgformat"
};
registerTranslation(translation);
var sv_default = translation;
export {
  sv_default as default
};
