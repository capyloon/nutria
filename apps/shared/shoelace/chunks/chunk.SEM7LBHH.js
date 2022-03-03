import {
  component_styles_default
} from "./chunk.KNVYX3FQ.js";
import {
  r
} from "./chunk.PEQICPKO.js";

// src/components/responsive-media/responsive-media.styles.ts
var responsive_media_styles_default = r`
  ${component_styles_default}

  :host {
    display: block;
  }

  .responsive-media {
    position: relative;
  }

  .responsive-media ::slotted(*) {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }

  .responsive-media--cover ::slotted(embed),
  .responsive-media--cover ::slotted(iframe),
  .responsive-media--cover ::slotted(img),
  .responsive-media--cover ::slotted(video) {
    object-fit: cover !important;
  }

  .responsive-media--contain ::slotted(embed),
  .responsive-media--contain ::slotted(iframe),
  .responsive-media--contain ::slotted(img),
  .responsive-media--contain ::slotted(video) {
    object-fit: contain !important;
  }
`;

export {
  responsive_media_styles_default
};
