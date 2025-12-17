import CodeDemo from "D:/idea/source/person/relaxed-docs/node_modules/.pnpm/vuepress-plugin-md-enhance@_40a8e33391929338438d0d58cf50efea/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeDemo.js";
import MdDemo from "D:/idea/source/person/relaxed-docs/node_modules/.pnpm/vuepress-plugin-md-enhance@_40a8e33391929338438d0d58cf50efea/node_modules/vuepress-plugin-md-enhance/lib/client/components/MdDemo.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeDemo", CodeDemo);
    app.component("MdDemo", MdDemo);
  },
};
