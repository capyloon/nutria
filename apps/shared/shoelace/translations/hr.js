import {
  registerTranslation
} from "../chunks/chunk.O27EHOBW.js";
import "../chunks/chunk.YZETUBD6.js";

// src/translations/hr.ts
var translation = {
  $code: "hr",
  $name: "Hrvatski",
  $dir: "ltr",
  carousel: "Vrtuljak",
  clearEntry: "O\u010Disti unos",
  close: "Zatvori",
  copied: "Kopirano",
  copy: "Kopiraj",
  currentValue: "Trenutna vrijednost",
  error: "Gre\u0161ka",
  goToSlide: (slide, count) => `Idi na slajd ${slide} od ${count}`,
  hidePassword: "Sakrij lozinku",
  loading: "U\u010Ditavanje",
  nextSlide: "Sljede\u0107i slajd",
  numOptionsSelected: (num) => {
    if (num === 0)
      return "Nije odabrana nijedna opcija";
    if (num === 1)
      return "1 opcija je odabrana";
    return `${num} odabranih opcija`;
  },
  previousSlide: "Prethodni slajd",
  progress: "Napredak",
  remove: "Makni",
  resize: "Promijeni veli\u010Dinu",
  scrollToEnd: "Skrolaj do kraja",
  scrollToStart: "Skrolaj na po\u010Detak",
  selectAColorFromTheScreen: "Odaberi boju sa ekrana",
  showPassword: "Poka\u017Ei lozinku",
  slideNum: (slide) => `Slajd ${slide}`,
  toggleColorFormat: "Zamijeni format boje"
};
registerTranslation(translation);
var hr_default = translation;
export {
  hr_default as default
};
