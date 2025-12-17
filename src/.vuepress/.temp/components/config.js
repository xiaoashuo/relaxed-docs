import { hasGlobalComponent } from "D:/idea/source/person/relaxed-docs/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_ab99b4bd6825e88056fff4c9dcdf6076/node_modules/@vuepress/helper/lib/client/index.js";
import Badge from "D:/idea/source/person/relaxed-docs/node_modules/.pnpm/vuepress-plugin-components@_ccd6de0af287acf4126823b73b4f2ff0/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import VPCard from "D:/idea/source/person/relaxed-docs/node_modules/.pnpm/vuepress-plugin-components@_ccd6de0af287acf4126823b73b4f2ff0/node_modules/vuepress-plugin-components/lib/client/components/VPCard.js";

import "D:/idea/source/person/relaxed-docs/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_ab99b4bd6825e88056fff4c9dcdf6076/node_modules/@vuepress/helper/lib/client/styles/sr-only.css";

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("Badge")) app.component("Badge", Badge);
    if(!hasGlobalComponent("VPCard")) app.component("VPCard", VPCard);
    
  },
  setup: () => {

  },
  rootComponents: [

  ],
};
