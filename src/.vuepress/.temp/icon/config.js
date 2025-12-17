import { hasGlobalComponent } from "D:/idea/source/person/relaxed-docs/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_ab99b4bd6825e88056fff4c9dcdf6076/node_modules/@vuepress/helper/lib/client/index.js";
import { useScriptTag } from "D:/idea/source/person/relaxed-docs/node_modules/.pnpm/@vueuse+core@14.1.0_vue@3.5.25/node_modules/@vueuse/core/dist/index.js";
import { h } from "vue";
import { VPIcon } from "D:/idea/source/person/relaxed-docs/node_modules/.pnpm/@vuepress+plugin-icon@2.0.0_5e4b60f83860ecab0f32f985a5a99c7c/node_modules/@vuepress/plugin-icon/lib/client/index.js"

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("VPIcon")) {
      app.component(
        "VPIcon",
        (props) =>
          h(VPIcon, {
            type: "iconify",
            prefix: "fa6-solid:",
            ...props,
          })
      )
    }
  },
  setup: () => {
    useScriptTag(`https://cdn.jsdelivr.net/npm/iconify-icon@2`);
  },
}
