import "../chunks/chunk.NH3SRVOC.js";
import "../chunks/chunk.QPSNFEB2.js";
import {
  registerTranslation
} from "../chunks/chunk.O27EHOBW.js";
import "../chunks/chunk.YZETUBD6.js";

// src/translations/zh-cn.ts
var translation = {
  $code: "zh-cn",
  $name: "\u7B80\u4F53\u4E2D\u6587",
  $dir: "ltr",
  carousel: "\u8DD1\u9A6C\u706F",
  clearEntry: "\u6E05\u7A7A",
  close: "\u5173\u95ED",
  copied: "\u5DF2\u590D\u5236",
  copy: "\u590D\u5236",
  currentValue: "\u5F53\u524D\u503C",
  error: "\u9519\u8BEF",
  goToSlide: (slide, count) => `\u8F6C\u5230\u7B2C ${slide} \u5F20\u5E7B\u706F\u7247\uFF0C\u5171 ${count} \u5F20`,
  hidePassword: "\u9690\u85CF\u5BC6\u7801",
  loading: "\u52A0\u8F7D\u4E2D",
  nextSlide: "\u4E0B\u4E00\u5F20\u5E7B\u706F\u7247",
  numOptionsSelected: (num) => {
    if (num === 0)
      return "\u672A\u9009\u62E9\u4EFB\u4F55\u9879\u76EE";
    if (num === 1)
      return "\u5DF2\u9009\u62E9 1 \u4E2A\u9879\u76EE";
    return `${num} \u9009\u62E9\u9879\u76EE`;
  },
  previousSlide: "\u4E0A\u4E00\u5F20\u5E7B\u706F\u7247",
  progress: "\u8FDB\u5EA6",
  remove: "\u5220\u9664",
  resize: "\u8C03\u6574\u5927\u5C0F",
  scrollToEnd: "\u6EDA\u52A8\u81F3\u9875\u5C3E",
  scrollToStart: "\u6EDA\u52A8\u81F3\u9875\u9996",
  selectAColorFromTheScreen: "\u4ECE\u5C4F\u5E55\u4E2D\u9009\u62E9\u4E00\u79CD\u989C\u8272",
  showPassword: "\u663E\u793A\u5BC6\u7801",
  slideNum: (slide) => `\u5E7B\u706F\u7247 ${slide}`,
  toggleColorFormat: "\u5207\u6362\u989C\u8272\u6A21\u5F0F"
};
registerTranslation(translation);
var zh_cn_default = translation;
export {
  zh_cn_default as default
};
