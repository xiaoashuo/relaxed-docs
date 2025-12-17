import { CodeTabs } from "D:/idea/source/person/relaxed-docs/node_modules/.pnpm/@vuepress+plugin-markdown-t_7bcfbe2d7a88f91ff53104f6d2da59bc/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "D:/idea/source/person/relaxed-docs/node_modules/.pnpm/@vuepress+plugin-markdown-t_7bcfbe2d7a88f91ff53104f6d2da59bc/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "D:/idea/source/person/relaxed-docs/node_modules/.pnpm/@vuepress+plugin-markdown-t_7bcfbe2d7a88f91ff53104f6d2da59bc/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
