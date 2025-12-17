import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/zh/",
  "/zh/portfolio",
  "/zh/guide/",

  {
    text: "前端项目",
    icon: "famicons:open-sharp",
    prefix: "/zh/guide/",
    children: [
      {
        text: "Vue",
        icon: "book",
        link: "https://cn.vuejs.org/guide/introduction",
      },
      {
        text: "Vuepress",
        icon: "book",
        link: "https://vuepress.vuejs.org/zh/",
      },
      {
        text: "Vuex",
        icon: "book",
        link: "https://vuex.vuejs.org/zh/",
      },
      {
        text: "Pinia",
        icon: "book",
        link: "https://pinia.web3doc.top/introduction.html",
      },
      {
        text: "VueRouter",
        icon: "book",
        link: "https://router.vuejs.org/zh/introduction.html",
      },
      {
        text: "Axios",
        icon: "book",
        link: "http://www.axios-js.com/zh-cn/docs/",
      },
      {
        text: "项目模板",
        icon: "lightbulb",
        prefix: "template/",
        children: [
          {
            text: "UI模板市场",
            icon: "book",
            link: "https://www.builtatlightspeed.com/",
          },
          {
            text: "AntdV",
            icon: "book",
            link: "https://pro.antdv.com/docs/getting-started",
          },
          {
            text: "Antd",
            icon: "book",
            link: "https://pro.ant.design/zh-CN/docs/overview/",
          },
          {
            text: "VueElementAdmin",
            icon: "book",
            link: "https://panjiachen.github.io/vue-element-admin-site/zh/guide/",
          },
        ],
      },

    ],
  },
  {
    text: "后端项目",
    icon: "famicons:open-sharp",
    prefix: "/zh/guide/",
    children: [
      {
        text: "Spring",
        icon: "book",
        link: "https://spring.io/",
      },
      {
        text: "后台项目",
        icon: "book",
        link: "https://github.com/xiaoashuo/relaxed",
      },
      {
        text: "贷款项目",
        icon: "book",
        link: "https://github.com/xiaoashuo/relaxed-admin-loan",
      },



    ],
  },
]);
