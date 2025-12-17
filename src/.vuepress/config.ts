import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/relaxed-docs/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Relaxed-Docs",
      description: "A docs demo for relaxed-docs",
    },

    "/zh/": {
      lang: "zh-CN",
      title: "Relaxed-Docs",
      description: "relaxed-docs 的文档演示",
    },

  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
