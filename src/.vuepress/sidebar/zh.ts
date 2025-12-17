import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/zh/": [


    {
      text: "开发文档",
      icon: "book",
      prefix: "guide/",
      children: "structure",
    },
    {
      text: "Maven插件",
      icon: "laptop-code",
      prefix: "maven/",
      link: "maven/",
      children: "structure",
    },
    {
      text: "常见问题",
      icon: "circle-question",
      prefix: "questions/",
      link: "questions/",
      children: "structure",
    },

  ],
});
