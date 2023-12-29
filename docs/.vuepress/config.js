module.exports = {
  title: 'Relaxed-Docs',
  description: 'Just playing around',
  theme: 'reco',
  base: '/relaxed-docs/',
  themeConfig: {
    logo: './img/logo.png',
    activeHeaderLinks: false,
    subSidebar: 'auto',
    //导航栏
    nav: [
      { text: '首页', link: '/' },
      {
        text: '前端项目',
        ariaLabel: 'web',
        items: [
          { text: 'Vue', link: 'https://cn.vuejs.org/guide/introduction.html' },
          { text: 'VuePress', link: 'https://vuepress.vuejs.org/zh/theme/' },
          { text: 'Vuex', link: 'https://vuex.vuejs.org/zh/' },
          { text: 'Pinia', link: 'https://pinia.web3doc.top/introduction.html' },
          { text: 'VueRouter', link: 'https://router.vuejs.org/zh/introduction.html' },
          { text: 'Axios', link: 'http://www.axios-js.com/zh-cn/docs/' },
        ]
      },
      {
        text: '项目地址',
        ariaLabel: 'Language Menu',
        items: [
          { text: '后台项目', link: 'https://github.com/xiaoashuo/relaxed' },
          { text: '贷款项目', link: 'https://github.com/xiaoashuo/relaxed-admin-loan' }
        ]
      },
    ],
    //侧边栏


    sidebar: [
      {
        title: '主题',   // 必要的

        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 2,    // 可选的, 默认值是 1
        children: [
          '/zh/guide/'
        ]
      },
      {
        title: '功能',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 2,    // 可选的, 默认值是 1
        children: [
          './zh/blogs/Download模块',
          './zh/blogs/util模块.md',
          './zh/blogs/Http模块.md',
          './zh/blogs/Excel模块.md',
          './zh/blogs/OSS模块.md',
          './zh/blogs/Sftp模块.md',
          './zh/blogs/Secret模块.md',
          './zh/blogs/多数据源模块.md',
          './zh/blogs/异常通知模块.md',
          './zh/blogs/邮件模块.md',
          './zh/blogs/MybatisPlus模块.md',
          './zh/blogs/Oauth2模块.md',
          './zh/blogs/Cache模块.md',
          './zh/blogs/日志模块.md',

        ]
      },
      {
        title: 'Maven插件',   // 必要的
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 2,    // 可选的, 默认值是 1
        children: [
          './zh/maven/pojo-to-sql.md',

        ]
      },
    ]
  }
}