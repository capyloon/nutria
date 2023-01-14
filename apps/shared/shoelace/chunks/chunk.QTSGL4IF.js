import{a as T}from"./chunk.6S67HV2F.js";import{a as g}from"./chunk.FC4RDJJF.js";import{a as m}from"./chunk.N7OOUXHR.js";import{a as j}from"./chunk.P4NGLPZP.js";import{a as O}from"./chunk.3HZVBDU4.js";import{b as U}from"./chunk.7DRWJBWU.js";import{a as _}from"./chunk.NUWDNXKI.js";import{a as A}from"./chunk.RUACWBWF.js";import{c as N}from"./chunk.H6F6UAV4.js";import{a as S}from"./chunk.AR2QSYXF.js";import{a as z,b as d,c as w,d as E,f as q}from"./chunk.JFPKWAAH.js";import{c as b}from"./chunk.SYBSOZNG.js";import{e as l}from"./chunk.I4CX4JT3.js";function u(r,e){et(r)&&(r="100%");var t=rt(r);return r=e===360?r:Math.min(e,Math.max(0,parseFloat(r))),t&&(r=parseInt(String(r*e),10)/100),Math.abs(r-e)<1e-6?1:(e===360?r=(r<0?r%e+e:r%e)/parseFloat(String(e)):r=r%e/parseFloat(String(e)),r)}function k(r){return Math.min(1,Math.max(0,r))}function et(r){return typeof r=="string"&&r.indexOf(".")!==-1&&parseFloat(r)===1}function rt(r){return typeof r=="string"&&r.indexOf("%")!==-1}function D(r){return r=parseFloat(r),(isNaN(r)||r<0||r>1)&&(r=1),r}function H(r){return r<=1?"".concat(Number(r)*100,"%"):r}function M(r){return r.length===1?"0"+r:String(r)}function W(r,e,t){return{r:u(r,255)*255,g:u(e,255)*255,b:u(t,255)*255}}function C(r,e,t){r=u(r,255),e=u(e,255),t=u(t,255);var i=Math.max(r,e,t),a=Math.min(r,e,t),s=0,n=0,o=(i+a)/2;if(i===a)n=0,s=0;else{var p=i-a;switch(n=o>.5?p/(2-i-a):p/(i+a),i){case r:s=(e-t)/p+(e<t?6:0);break;case e:s=(t-r)/p+2;break;case t:s=(r-e)/p+4;break;default:break}s/=6}return{h:s,s:n,l:o}}function R(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*(6*t):t<1/2?e:t<2/3?r+(e-r)*(2/3-t)*6:r}function X(r,e,t){var i,a,s;if(r=u(r,360),e=u(e,100),t=u(t,100),e===0)a=t,s=t,i=t;else{var n=t<.5?t*(1+e):t+e-t*e,o=2*t-n;i=R(o,n,r+1/3),a=R(o,n,r),s=R(o,n,r-1/3)}return{r:i*255,g:a*255,b:s*255}}function F(r,e,t){r=u(r,255),e=u(e,255),t=u(t,255);var i=Math.max(r,e,t),a=Math.min(r,e,t),s=0,n=i,o=i-a,p=i===0?0:o/i;if(i===a)s=0;else{switch(i){case r:s=(e-t)/o+(e<t?6:0);break;case e:s=(t-r)/o+2;break;case t:s=(r-e)/o+4;break;default:break}s/=6}return{h:s,s:p,v:n}}function Y(r,e,t){r=u(r,360)*6,e=u(e,100),t=u(t,100);var i=Math.floor(r),a=r-i,s=t*(1-e),n=t*(1-a*e),o=t*(1-(1-a)*e),p=i%6,x=[t,n,s,s,o,t][p],f=[o,t,t,n,s,s][p],tt=[s,s,o,t,t,n][p];return{r:x*255,g:f*255,b:tt*255}}function I(r,e,t,i){var a=[M(Math.round(r).toString(16)),M(Math.round(e).toString(16)),M(Math.round(t).toString(16))];return i&&a[0].startsWith(a[0].charAt(1))&&a[1].startsWith(a[1].charAt(1))&&a[2].startsWith(a[2].charAt(1))?a[0].charAt(0)+a[1].charAt(0)+a[2].charAt(0):a.join("")}function Z(r,e,t,i,a){var s=[M(Math.round(r).toString(16)),M(Math.round(e).toString(16)),M(Math.round(t).toString(16)),M(it(i))];return a&&s[0].startsWith(s[0].charAt(1))&&s[1].startsWith(s[1].charAt(1))&&s[2].startsWith(s[2].charAt(1))&&s[3].startsWith(s[3].charAt(1))?s[0].charAt(0)+s[1].charAt(0)+s[2].charAt(0)+s[3].charAt(0):s.join("")}function it(r){return Math.round(parseFloat(r)*255).toString(16)}function L(r){return c(r)/255}function c(r){return parseInt(r,16)}function J(r){return{r:r>>16,g:(r&65280)>>8,b:r&255}}var V={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",goldenrod:"#daa520",gold:"#ffd700",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavenderblush:"#fff0f5",lavender:"#e6e6fa",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};function Q(r){var e={r:0,g:0,b:0},t=1,i=null,a=null,s=null,n=!1,o=!1;return typeof r=="string"&&(r=nt(r)),typeof r=="object"&&(y(r.r)&&y(r.g)&&y(r.b)?(e=W(r.r,r.g,r.b),n=!0,o=String(r.r).substr(-1)==="%"?"prgb":"rgb"):y(r.h)&&y(r.s)&&y(r.v)?(i=H(r.s),a=H(r.v),e=Y(r.h,i,a),n=!0,o="hsv"):y(r.h)&&y(r.s)&&y(r.l)&&(i=H(r.s),s=H(r.l),e=X(r.h,i,s),n=!0,o="hsl"),Object.prototype.hasOwnProperty.call(r,"a")&&(t=r.a)),t=D(t),{ok:n,format:r.format||o,r:Math.min(255,Math.max(e.r,0)),g:Math.min(255,Math.max(e.g,0)),b:Math.min(255,Math.max(e.b,0)),a:t}}var at="[-\\+]?\\d+%?",st="[-\\+]?\\d*\\.\\d+%?",$="(?:".concat(st,")|(?:").concat(at,")"),B="[\\s|\\(]+(".concat($,")[,|\\s]+(").concat($,")[,|\\s]+(").concat($,")\\s*\\)?"),G="[\\s|\\(]+(".concat($,")[,|\\s]+(").concat($,")[,|\\s]+(").concat($,")[,|\\s]+(").concat($,")\\s*\\)?"),v={CSS_UNIT:new RegExp($),rgb:new RegExp("rgb"+B),rgba:new RegExp("rgba"+G),hsl:new RegExp("hsl"+B),hsla:new RegExp("hsla"+G),hsv:new RegExp("hsv"+B),hsva:new RegExp("hsva"+G),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/};function nt(r){if(r=r.trim().toLowerCase(),r.length===0)return!1;var e=!1;if(V[r])r=V[r],e=!0;else if(r==="transparent")return{r:0,g:0,b:0,a:0,format:"name"};var t=v.rgb.exec(r);return t?{r:t[1],g:t[2],b:t[3]}:(t=v.rgba.exec(r),t?{r:t[1],g:t[2],b:t[3],a:t[4]}:(t=v.hsl.exec(r),t?{h:t[1],s:t[2],l:t[3]}:(t=v.hsla.exec(r),t?{h:t[1],s:t[2],l:t[3],a:t[4]}:(t=v.hsv.exec(r),t?{h:t[1],s:t[2],v:t[3]}:(t=v.hsva.exec(r),t?{h:t[1],s:t[2],v:t[3],a:t[4]}:(t=v.hex8.exec(r),t?{r:c(t[1]),g:c(t[2]),b:c(t[3]),a:L(t[4]),format:e?"name":"hex8"}:(t=v.hex6.exec(r),t?{r:c(t[1]),g:c(t[2]),b:c(t[3]),format:e?"name":"hex"}:(t=v.hex4.exec(r),t?{r:c(t[1]+t[1]),g:c(t[2]+t[2]),b:c(t[3]+t[3]),a:L(t[4]+t[4]),format:e?"name":"hex8"}:(t=v.hex3.exec(r),t?{r:c(t[1]+t[1]),g:c(t[2]+t[2]),b:c(t[3]+t[3]),format:e?"name":"hex"}:!1)))))))))}function y(r){return Boolean(v.CSS_UNIT.exec(String(r)))}var K=function(){function r(e,t){e===void 0&&(e=""),t===void 0&&(t={});var i;if(e instanceof r)return e;typeof e=="number"&&(e=J(e)),this.originalInput=e;var a=Q(e);this.originalInput=e,this.r=a.r,this.g=a.g,this.b=a.b,this.a=a.a,this.roundA=Math.round(100*this.a)/100,this.format=(i=t.format)!==null&&i!==void 0?i:a.format,this.gradientType=t.gradientType,this.r<1&&(this.r=Math.round(this.r)),this.g<1&&(this.g=Math.round(this.g)),this.b<1&&(this.b=Math.round(this.b)),this.isValid=a.ok}return r.prototype.isDark=function(){return this.getBrightness()<128},r.prototype.isLight=function(){return!this.isDark()},r.prototype.getBrightness=function(){var e=this.toRgb();return(e.r*299+e.g*587+e.b*114)/1e3},r.prototype.getLuminance=function(){var e=this.toRgb(),t,i,a,s=e.r/255,n=e.g/255,o=e.b/255;return s<=.03928?t=s/12.92:t=Math.pow((s+.055)/1.055,2.4),n<=.03928?i=n/12.92:i=Math.pow((n+.055)/1.055,2.4),o<=.03928?a=o/12.92:a=Math.pow((o+.055)/1.055,2.4),.2126*t+.7152*i+.0722*a},r.prototype.getAlpha=function(){return this.a},r.prototype.setAlpha=function(e){return this.a=D(e),this.roundA=Math.round(100*this.a)/100,this},r.prototype.isMonochrome=function(){var e=this.toHsl().s;return e===0},r.prototype.toHsv=function(){var e=F(this.r,this.g,this.b);return{h:e.h*360,s:e.s,v:e.v,a:this.a}},r.prototype.toHsvString=function(){var e=F(this.r,this.g,this.b),t=Math.round(e.h*360),i=Math.round(e.s*100),a=Math.round(e.v*100);return this.a===1?"hsv(".concat(t,", ").concat(i,"%, ").concat(a,"%)"):"hsva(".concat(t,", ").concat(i,"%, ").concat(a,"%, ").concat(this.roundA,")")},r.prototype.toHsl=function(){var e=C(this.r,this.g,this.b);return{h:e.h*360,s:e.s,l:e.l,a:this.a}},r.prototype.toHslString=function(){var e=C(this.r,this.g,this.b),t=Math.round(e.h*360),i=Math.round(e.s*100),a=Math.round(e.l*100);return this.a===1?"hsl(".concat(t,", ").concat(i,"%, ").concat(a,"%)"):"hsla(".concat(t,", ").concat(i,"%, ").concat(a,"%, ").concat(this.roundA,")")},r.prototype.toHex=function(e){return e===void 0&&(e=!1),I(this.r,this.g,this.b,e)},r.prototype.toHexString=function(e){return e===void 0&&(e=!1),"#"+this.toHex(e)},r.prototype.toHex8=function(e){return e===void 0&&(e=!1),Z(this.r,this.g,this.b,this.a,e)},r.prototype.toHex8String=function(e){return e===void 0&&(e=!1),"#"+this.toHex8(e)},r.prototype.toRgb=function(){return{r:Math.round(this.r),g:Math.round(this.g),b:Math.round(this.b),a:this.a}},r.prototype.toRgbString=function(){var e=Math.round(this.r),t=Math.round(this.g),i=Math.round(this.b);return this.a===1?"rgb(".concat(e,", ").concat(t,", ").concat(i,")"):"rgba(".concat(e,", ").concat(t,", ").concat(i,", ").concat(this.roundA,")")},r.prototype.toPercentageRgb=function(){var e=function(t){return"".concat(Math.round(u(t,255)*100),"%")};return{r:e(this.r),g:e(this.g),b:e(this.b),a:this.a}},r.prototype.toPercentageRgbString=function(){var e=function(t){return Math.round(u(t,255)*100)};return this.a===1?"rgb(".concat(e(this.r),"%, ").concat(e(this.g),"%, ").concat(e(this.b),"%)"):"rgba(".concat(e(this.r),"%, ").concat(e(this.g),"%, ").concat(e(this.b),"%, ").concat(this.roundA,")")},r.prototype.toName=function(){if(this.a===0)return"transparent";if(this.a<1)return!1;for(var e="#"+I(this.r,this.g,this.b,!1),t=0,i=Object.entries(V);t<i.length;t++){var a=i[t],s=a[0],n=a[1];if(e===n)return s}return!1},r.prototype.toString=function(e){var t=Boolean(e);e=e!=null?e:this.format;var i=!1,a=this.a<1&&this.a>=0,s=!t&&a&&(e.startsWith("hex")||e==="name");return s?e==="name"&&this.a===0?this.toName():this.toRgbString():(e==="rgb"&&(i=this.toRgbString()),e==="prgb"&&(i=this.toPercentageRgbString()),(e==="hex"||e==="hex6")&&(i=this.toHexString()),e==="hex3"&&(i=this.toHexString(!0)),e==="hex4"&&(i=this.toHex8String(!0)),e==="hex8"&&(i=this.toHex8String()),e==="name"&&(i=this.toName()),e==="hsl"&&(i=this.toHslString()),e==="hsv"&&(i=this.toHsvString()),i||this.toHexString())},r.prototype.toNumber=function(){return(Math.round(this.r)<<16)+(Math.round(this.g)<<8)+Math.round(this.b)},r.prototype.clone=function(){return new r(this.toString())},r.prototype.lighten=function(e){e===void 0&&(e=10);var t=this.toHsl();return t.l+=e/100,t.l=k(t.l),new r(t)},r.prototype.brighten=function(e){e===void 0&&(e=10);var t=this.toRgb();return t.r=Math.max(0,Math.min(255,t.r-Math.round(255*-(e/100)))),t.g=Math.max(0,Math.min(255,t.g-Math.round(255*-(e/100)))),t.b=Math.max(0,Math.min(255,t.b-Math.round(255*-(e/100)))),new r(t)},r.prototype.darken=function(e){e===void 0&&(e=10);var t=this.toHsl();return t.l-=e/100,t.l=k(t.l),new r(t)},r.prototype.tint=function(e){return e===void 0&&(e=10),this.mix("white",e)},r.prototype.shade=function(e){return e===void 0&&(e=10),this.mix("black",e)},r.prototype.desaturate=function(e){e===void 0&&(e=10);var t=this.toHsl();return t.s-=e/100,t.s=k(t.s),new r(t)},r.prototype.saturate=function(e){e===void 0&&(e=10);var t=this.toHsl();return t.s+=e/100,t.s=k(t.s),new r(t)},r.prototype.greyscale=function(){return this.desaturate(100)},r.prototype.spin=function(e){var t=this.toHsl(),i=(t.h+e)%360;return t.h=i<0?360+i:i,new r(t)},r.prototype.mix=function(e,t){t===void 0&&(t=50);var i=this.toRgb(),a=new r(e).toRgb(),s=t/100,n={r:(a.r-i.r)*s+i.r,g:(a.g-i.g)*s+i.g,b:(a.b-i.b)*s+i.b,a:(a.a-i.a)*s+i.a};return new r(n)},r.prototype.analogous=function(e,t){e===void 0&&(e=6),t===void 0&&(t=30);var i=this.toHsl(),a=360/t,s=[this];for(i.h=(i.h-(a*e>>1)+720)%360;--e;)i.h=(i.h+a)%360,s.push(new r(i));return s},r.prototype.complement=function(){var e=this.toHsl();return e.h=(e.h+180)%360,new r(e)},r.prototype.monochromatic=function(e){e===void 0&&(e=6);for(var t=this.toHsv(),i=t.h,a=t.s,s=t.v,n=[],o=1/e;e--;)n.push(new r({h:i,s:a,v:s})),s=(s+o)%1;return n},r.prototype.splitcomplement=function(){var e=this.toHsl(),t=e.h;return[this,new r({h:(t+72)%360,s:e.s,l:e.l}),new r({h:(t+216)%360,s:e.s,l:e.l})]},r.prototype.onBackground=function(e){var t=this.toRgb(),i=new r(e).toRgb();return new r({r:i.r+(t.r-i.r)*t.a,g:i.g+(t.g-i.g)*t.a,b:i.b+(t.b-i.b)*t.a})},r.prototype.triad=function(){return this.polyad(3)},r.prototype.tetrad=function(){return this.polyad(4)},r.prototype.polyad=function(e){for(var t=this.toHsl(),i=t.h,a=[this],s=360/e,n=1;n<e;n++)a.push(new r({h:(i+n*s)%360,s:t.s,l:t.l}));return a},r.prototype.equals=function(e){return this.toRgbString()===new r(e).toRgbString()},r}();var P="EyeDropper"in window,h=class extends q{constructor(){super(...arguments);this.formControlController=new U(this);this.isSafeValue=!1;this.localize=new N(this);this.isDraggingGridHandle=!1;this.isEmpty=!1;this.inputValue="";this.hue=0;this.saturation=100;this.brightness=100;this.alpha=100;this.value="";this.defaultValue="";this.label="";this.format="hex";this.inline=!1;this.size="medium";this.noFormatToggle=!1;this.name="";this.disabled=!1;this.hoist=!1;this.opacity=!1;this.uppercase=!1;this.swatches="";this.form=""}connectedCallback(){super.connectedCallback(),this.value?(this.setColor(this.value),this.inputValue=this.value,this.lastValueEmitted=this.value,this.syncValues()):(this.isEmpty=!0,this.inputValue="",this.lastValueEmitted="")}handleCopy(){this.input.select(),document.execCommand("copy"),this.previewButton.focus(),this.previewButton.classList.add("color-picker__preview-color--copied"),this.previewButton.addEventListener("animationend",()=>{this.previewButton.classList.remove("color-picker__preview-color--copied")})}handleFormatToggle(){let t=["hex","rgb","hsl","hsv"],i=(t.indexOf(this.format)+1)%t.length;this.format=t[i],this.setColor(this.value),this.emit("sl-change"),this.emit("sl-input")}handleAlphaDrag(t){let i=this.shadowRoot.querySelector(".color-picker__slider.color-picker__alpha"),a=i.querySelector(".color-picker__slider-handle"),{width:s}=i.getBoundingClientRect(),n=this.value;a.focus(),t.preventDefault(),T(i,{onMove:o=>{this.alpha=g(o/s*100,0,100),this.syncValues(),this.value!==n&&(n=this.value,this.emit("sl-change"),this.emit("sl-input"))},initialEvent:t})}handleHueDrag(t){let i=this.shadowRoot.querySelector(".color-picker__slider.color-picker__hue"),a=i.querySelector(".color-picker__slider-handle"),{width:s}=i.getBoundingClientRect(),n=this.value;a.focus(),t.preventDefault(),T(i,{onMove:o=>{this.hue=g(o/s*360,0,360),this.syncValues(),this.value!==n&&(n=this.value,this.emit("sl-change"),this.emit("sl-input"))},initialEvent:t})}handleGridDrag(t){let i=this.shadowRoot.querySelector(".color-picker__grid"),a=i.querySelector(".color-picker__grid-handle"),{width:s,height:n}=i.getBoundingClientRect(),o=this.value;a.focus(),t.preventDefault(),this.isDraggingGridHandle=!0,T(i,{onMove:(p,x)=>{this.saturation=g(p/s*100,0,100),this.brightness=g(100-x/n*100,0,100),this.syncValues(),this.value!==o&&(o=this.value,this.emit("sl-change"),this.emit("sl-input"))},onStop:()=>this.isDraggingGridHandle=!1,initialEvent:t})}handleAlphaKeyDown(t){let i=t.shiftKey?10:1,a=this.value;t.key==="ArrowLeft"&&(t.preventDefault(),this.alpha=g(this.alpha-i,0,100),this.syncValues()),t.key==="ArrowRight"&&(t.preventDefault(),this.alpha=g(this.alpha+i,0,100),this.syncValues()),t.key==="Home"&&(t.preventDefault(),this.alpha=0,this.syncValues()),t.key==="End"&&(t.preventDefault(),this.alpha=100,this.syncValues()),this.value!==a&&(this.emit("sl-change"),this.emit("sl-input"))}handleHueKeyDown(t){let i=t.shiftKey?10:1,a=this.value;t.key==="ArrowLeft"&&(t.preventDefault(),this.hue=g(this.hue-i,0,360),this.syncValues()),t.key==="ArrowRight"&&(t.preventDefault(),this.hue=g(this.hue+i,0,360),this.syncValues()),t.key==="Home"&&(t.preventDefault(),this.hue=0,this.syncValues()),t.key==="End"&&(t.preventDefault(),this.hue=360,this.syncValues()),this.value!==a&&(this.emit("sl-change"),this.emit("sl-input"))}handleGridKeyDown(t){let i=t.shiftKey?10:1,a=this.value;t.key==="ArrowLeft"&&(t.preventDefault(),this.saturation=g(this.saturation-i,0,100),this.syncValues()),t.key==="ArrowRight"&&(t.preventDefault(),this.saturation=g(this.saturation+i,0,100),this.syncValues()),t.key==="ArrowUp"&&(t.preventDefault(),this.brightness=g(this.brightness+i,0,100),this.syncValues()),t.key==="ArrowDown"&&(t.preventDefault(),this.brightness=g(this.brightness-i,0,100),this.syncValues()),this.value!==a&&(this.emit("sl-change"),this.emit("sl-input"))}handleInputChange(t){let i=t.target,a=this.value;t.stopPropagation(),this.input.value?(this.setColor(i.value),i.value=this.value):this.value="",this.value!==a&&(this.emit("sl-change"),this.emit("sl-input"))}handleInputInput(t){t.stopPropagation()}handleInputKeyDown(t){if(t.key==="Enter"){let i=this.value;this.input.value?(this.setColor(this.input.value),this.input.value=this.value,this.value!==i&&(this.emit("sl-change"),this.emit("sl-input")),setTimeout(()=>this.input.select())):this.hue=0}}handleTouchMove(t){t.preventDefault()}parseColor(t){let i=new K(t);if(!i.isValid)return null;let a=i.toHsl(),s={h:a.h,s:a.s*100,l:a.l*100,a:a.a},n=i.toRgb(),o=i.toHexString(),p=i.toHex8String(),x=i.toHsv(),f={h:x.h,s:x.s*100,v:x.v*100,a:x.a};return{hsl:{h:s.h,s:s.s,l:s.l,string:this.setLetterCase(`hsl(${Math.round(s.h)}, ${Math.round(s.s)}%, ${Math.round(s.l)}%)`)},hsla:{h:s.h,s:s.s,l:s.l,a:s.a,string:this.setLetterCase(`hsla(${Math.round(s.h)}, ${Math.round(s.s)}%, ${Math.round(s.l)}%, ${s.a.toFixed(2).toString()})`)},hsv:{h:f.h,s:f.s,v:f.v,string:this.setLetterCase(`hsv(${Math.round(f.h)}, ${Math.round(f.s)}%, ${Math.round(f.v)}%)`)},hsva:{h:f.h,s:f.s,v:f.v,a:f.a,string:this.setLetterCase(`hsva(${Math.round(f.h)}, ${Math.round(f.s)}%, ${Math.round(f.v)}%, ${f.a.toFixed(2).toString()})`)},rgb:{r:n.r,g:n.g,b:n.b,string:this.setLetterCase(`rgb(${Math.round(n.r)}, ${Math.round(n.g)}, ${Math.round(n.b)})`)},rgba:{r:n.r,g:n.g,b:n.b,a:n.a,string:this.setLetterCase(`rgba(${Math.round(n.r)}, ${Math.round(n.g)}, ${Math.round(n.b)}, ${n.a.toFixed(2).toString()})`)},hex:this.setLetterCase(o),hexa:this.setLetterCase(p)}}setColor(t){let i=this.parseColor(t);return i===null?!1:(this.hue=i.hsva.h,this.saturation=i.hsva.s,this.brightness=i.hsva.v,this.alpha=this.opacity?i.hsva.a*100:100,this.syncValues(),!0)}setLetterCase(t){return typeof t!="string"?"":this.uppercase?t.toUpperCase():t.toLowerCase()}async syncValues(){let t=this.parseColor(`hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha/100})`);t!==null&&(this.format==="hsl"?this.inputValue=this.opacity?t.hsla.string:t.hsl.string:this.format==="rgb"?this.inputValue=this.opacity?t.rgba.string:t.rgb.string:this.format==="hsv"?this.inputValue=this.opacity?t.hsva.string:t.hsv.string:this.inputValue=this.opacity?t.hexa:t.hex,this.isSafeValue=!0,this.value=this.inputValue,await this.updateComplete,this.isSafeValue=!1)}handleAfterHide(){this.previewButton.classList.remove("color-picker__preview-color--copied")}handleEyeDropper(){if(!P)return;new EyeDropper().open().then(i=>this.setColor(i.sRGBHex)).catch(()=>{})}selectSwatch(t){let i=this.value;this.disabled||(this.setColor(t),this.value!==i&&(this.emit("sl-change"),this.emit("sl-input")))}getHexString(t,i,a,s=100){let n=new K(`hsva(${t}, ${i}, ${a}, ${s/100})`);return n.isValid?n.toHex8String():""}handleFormatChange(){this.syncValues()}handleOpacityChange(){this.alpha=100}handleValueChange(t,i){if(this.isEmpty=!i,i||(this.hue=0,this.saturation=0,this.brightness=100,this.alpha=100),!this.isSafeValue&&t!==void 0){let a=this.parseColor(i);a!==null?(this.inputValue=this.value,this.hue=a.hsva.h,this.saturation=a.hsva.s,this.brightness=a.hsva.v,this.alpha=a.hsva.a*100):this.inputValue=t}this.value!==this.lastValueEmitted&&(this.lastValueEmitted=this.value)}getFormattedValue(t="hex"){let i=this.parseColor(`hsva(${this.hue}, ${this.saturation}%, ${this.brightness}%, ${this.alpha/100})`);if(i===null)return"";switch(t){case"hex":return i.hex;case"hexa":return i.hexa;case"rgb":return i.rgb.string;case"rgba":return i.rgba.string;case"hsl":return i.hsl.string;case"hsla":return i.hsla.string;case"hsv":return i.hsv.string;case"hsva":return i.hsva.string;default:return""}}checkValidity(){return this.input.checkValidity()}reportValidity(){return!this.inline&&!this.checkValidity()?(this.dropdown.show(),this.addEventListener("sl-after-show",()=>this.input.reportValidity(),{once:!0}),this.checkValidity()):this.input.reportValidity()}setCustomValidity(t){this.input.setCustomValidity(t),this.formControlController.updateValidity()}render(){let t=this.saturation,i=100-this.brightness,a=Array.isArray(this.swatches)?this.swatches:this.swatches.split(";").filter(n=>n.trim()!==""),s=b`
      <div
        part="base"
        class=${A({"color-picker":!0,"color-picker--inline":this.inline,"color-picker--disabled":this.disabled})}
        aria-disabled=${this.disabled?"true":"false"}
        aria-labelledby="label"
        tabindex=${this.inline?"0":"-1"}
      >
        ${this.inline?b`
              <sl-visually-hidden id="label">
                <slot name="label">${this.label}</slot>
              </sl-visually-hidden>
            `:null}

        <div
          part="grid"
          class="color-picker__grid"
          style=${m({backgroundColor:this.getHexString(this.hue,100,100)})}
          @pointerdown=${this.handleGridDrag}
          @touchmove=${this.handleTouchMove}
        >
          <span
            part="grid-handle"
            class=${A({"color-picker__grid-handle":!0,"color-picker__grid-handle--dragging":this.isDraggingGridHandle})}
            style=${m({top:`${i}%`,left:`${t}%`,backgroundColor:this.getHexString(this.hue,this.saturation,this.brightness,this.alpha)})}
            role="application"
            aria-label="HSV"
            tabindex=${_(this.disabled?void 0:"0")}
            @keydown=${this.handleGridKeyDown}
          ></span>
        </div>

        <div class="color-picker__controls">
          <div class="color-picker__sliders">
            <div
              part="slider hue-slider"
              class="color-picker__hue color-picker__slider"
              @pointerdown=${this.handleHueDrag}
              @touchmove=${this.handleTouchMove}
            >
              <span
                part="slider-handle"
                class="color-picker__slider-handle"
                style=${m({left:`${this.hue===0?0:100/(360/this.hue)}%`})}
                role="slider"
                aria-label="hue"
                aria-orientation="horizontal"
                aria-valuemin="0"
                aria-valuemax="360"
                aria-valuenow=${`${Math.round(this.hue)}`}
                tabindex=${_(this.disabled?void 0:"0")}
                @keydown=${this.handleHueKeyDown}
              ></span>
            </div>

            ${this.opacity?b`
                  <div
                    part="slider opacity-slider"
                    class="color-picker__alpha color-picker__slider color-picker__transparent-bg"
                    @pointerdown="${this.handleAlphaDrag}"
                    @touchmove=${this.handleTouchMove}
                  >
                    <div
                      class="color-picker__alpha-gradient"
                      style=${m({backgroundImage:`linear-gradient(
                          to right,
                          ${this.getHexString(this.hue,this.saturation,this.brightness,0)} 0%
                          ${this.getHexString(this.hue,this.saturation,this.brightness,100)} 100%
                        )`})}
                    ></div>
                    <span
                      part="slider-handle"
                      class="color-picker__slider-handle"
                      style=${m({left:`${this.alpha}%`})}
                      role="slider"
                      aria-label="alpha"
                      aria-orientation="horizontal"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow=${Math.round(this.alpha)}
                      tabindex=${_(this.disabled?void 0:"0")}
                      @keydown=${this.handleAlphaKeyDown}
                    ></span>
                  </div>
                `:""}
          </div>

          <button
            type="button"
            part="preview"
            class="color-picker__preview color-picker__transparent-bg"
            aria-label=${this.localize.term("copy")}
            style=${m({"--preview-color":this.getHexString(this.hue,this.saturation,this.brightness,this.alpha)})}
            @click=${this.handleCopy}
          ></button>
        </div>

        <div class="color-picker__user-input" aria-live="polite">
          <sl-input
            part="input"
            type="text"
            name=${this.name}
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            value=${this.isEmpty?"":this.inputValue}
            ?disabled=${this.disabled}
            aria-label=${this.localize.term("currentValue")}
            @keydown=${this.handleInputKeyDown}
            @sl-change=${this.handleInputChange}
            @sl-input=${this.handleInputInput}
          ></sl-input>

          <sl-button-group>
            ${this.noFormatToggle?"":b`
                  <sl-button
                    part="format-button"
                    aria-label=${this.localize.term("toggleColorFormat")}
                    exportparts="
                      base:format-button__base,
                      prefix:format-button__prefix,
                      label:format-button__label,
                      suffix:format-button__suffix,
                      caret:format-button__caret
                    "
                    @click=${this.handleFormatToggle}
                  >
                    ${this.setLetterCase(this.format)}
                  </sl-button>
                `}
            ${P?b`
                  <sl-button
                    part="eye-dropper-button"
                    exportparts="
                      base:eye-dropper-button__base,
                      prefix:eye-dropper-button__prefix,
                      label:eye-dropper-button__label,
                      suffix:eye-dropper-button__suffix,
                      caret:eye-dropper-button__caret
                    "
                    @click=${this.handleEyeDropper}
                  >
                    <sl-icon
                      library="system"
                      name="eyedropper"
                      label=${this.localize.term("selectAColorFromTheScreen")}
                    ></sl-icon>
                  </sl-button>
                `:""}
          </sl-button-group>
        </div>

        ${a.length>0?b`
              <div part="swatches" class="color-picker__swatches">
                ${a.map(n=>{let o=this.parseColor(n);return o?b`
                    <div
                      part="swatch"
                      class="color-picker__swatch color-picker__transparent-bg"
                      tabindex=${_(this.disabled?void 0:"0")}
                      role="button"
                      aria-label=${n}
                      @click=${()=>this.selectSwatch(n)}
                      @keydown=${p=>!this.disabled&&p.key==="Enter"&&this.setColor(o.hexa)}
                    >
                      <div
                        class="color-picker__swatch-color"
                        style=${m({backgroundColor:o.hexa})}
                      ></div>
                    </div>
                  `:(console.error(`Unable to parse swatch color: "${n}"`,this),"")})}
              </div>
            `:""}
      </div>
    `;return this.inline?s:b`
      <sl-dropdown
        class="color-dropdown"
        aria-disabled=${this.disabled?"true":"false"}
        .containing-element=${this}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        @sl-after-hide=${this.handleAfterHide}
      >
        <button
          part="trigger"
          slot="trigger"
          class=${A({"color-dropdown__trigger":!0,"color-dropdown__trigger--disabled":this.disabled,"color-dropdown__trigger--small":this.size==="small","color-dropdown__trigger--medium":this.size==="medium","color-dropdown__trigger--large":this.size==="large","color-dropdown__trigger--empty":this.isEmpty,"color-picker__transparent-bg":!0})}
          style=${m({color:this.getHexString(this.hue,this.saturation,this.brightness,this.alpha)})}
          type="button"
        >
          <sl-visually-hidden>
            <slot name="label">${this.label}</slot>
          </sl-visually-hidden>
        </button>
        ${s}
      </sl-dropdown>
    `}};h.styles=j,l([E('[part~="input"]')],h.prototype,"input",2),l([E('[part~="preview"]')],h.prototype,"previewButton",2),l([E(".color-dropdown")],h.prototype,"dropdown",2),l([w()],h.prototype,"isDraggingGridHandle",2),l([w()],h.prototype,"isEmpty",2),l([w()],h.prototype,"inputValue",2),l([w()],h.prototype,"hue",2),l([w()],h.prototype,"saturation",2),l([w()],h.prototype,"brightness",2),l([w()],h.prototype,"alpha",2),l([d()],h.prototype,"value",2),l([O()],h.prototype,"defaultValue",2),l([d()],h.prototype,"label",2),l([d()],h.prototype,"format",2),l([d({type:Boolean,reflect:!0})],h.prototype,"inline",2),l([d()],h.prototype,"size",2),l([d({attribute:"no-format-toggle",type:Boolean})],h.prototype,"noFormatToggle",2),l([d()],h.prototype,"name",2),l([d({type:Boolean,reflect:!0})],h.prototype,"disabled",2),l([d({type:Boolean})],h.prototype,"hoist",2),l([d({type:Boolean})],h.prototype,"opacity",2),l([d({type:Boolean})],h.prototype,"uppercase",2),l([d()],h.prototype,"swatches",2),l([d({reflect:!0})],h.prototype,"form",2),l([S("format",{waitUntilFirstUpdate:!0})],h.prototype,"handleFormatChange",1),l([S("opacity",{waitUntilFirstUpdate:!0})],h.prototype,"handleOpacityChange",1),l([S("value")],h.prototype,"handleValueChange",1),h=l([z("sl-color-picker")],h);export{h as a};
