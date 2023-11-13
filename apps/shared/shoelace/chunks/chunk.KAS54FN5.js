import {
  spinner_styles_default
} from "./chunk.3GITBIC4.js";
import {
  LocalizeController
} from "./chunk.NH3SRVOC.js";
import {
  ShoelaceElement
} from "./chunk.URBIOJXY.js";
import {
  x2 as x
} from "./chunk.27ILGUWR.js";

// src/components/spinner/spinner.component.ts
var SlSpinner = class extends ShoelaceElement {
  constructor() {
    super(...arguments);
    this.localize = new LocalizeController(this);
  }
  render() {
    return x`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `;
  }
};
SlSpinner.styles = spinner_styles_default;

export {
  SlSpinner
};
