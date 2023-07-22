import {
  component_styles_default
} from "./chunk.BCEYT3RT.js";
import {
  i
} from "./chunk.DUT32TWM.js";

// src/components/tab-panel/tab-panel.styles.ts
var tab_panel_styles_default = i`
  ${component_styles_default}

  :host {
    --padding: 0;

    display: none;
  }

  :host([active]) {
    display: block;
  }

  .tab-panel {
    display: block;
    padding: var(--padding);
  }
`;

export {
  tab_panel_styles_default
};
