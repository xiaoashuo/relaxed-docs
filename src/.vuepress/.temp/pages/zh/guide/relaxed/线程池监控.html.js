import comp from "D:/idea/source/person/relaxed-docs/src/.vuepress/.temp/pages/zh/guide/relaxed/线程池监控.html.vue"
const data = JSON.parse("{\"path\":\"/zh/guide/relaxed/%E7%BA%BF%E7%A8%8B%E6%B1%A0%E7%9B%91%E6%8E%A7.html\",\"title\":\"线程池监控\",\"lang\":\"zh-CN\",\"frontmatter\":{\"description\":\"线程池监控 背景 系统时不时会出现短暂的响应慢，甚至偶尔超时，但监控面板上的CPU、内存、磁盘IO全都很正常。 排查发现: 订单服务的线程池悄悄\\\"罢工\\\"了 —— 核心线程全被占满，任务队列塞爆，新请求全部被拒绝，这种情况在常规监控中完全无法被发现！ 解决方案: 引入线程池监控工具，支持动态伸缩，异常预警。 链路流程如下: web请求->监控拦截器->线...\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"线程池监控\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[{\\\"@type\\\":\\\"Person\\\",\\\"name\\\":\\\"xiaoashuo\\\",\\\"url\\\":\\\"https://github.com/xiaoashuo/relaxed-docs\\\"}]}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/xiaoashuo/relaxed-docs/zh/guide/relaxed/%E7%BA%BF%E7%A8%8B%E6%B1%A0%E7%9B%91%E6%8E%A7.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Relaxed-Docs\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"线程池监控\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"线程池监控 背景 系统时不时会出现短暂的响应慢，甚至偶尔超时，但监控面板上的CPU、内存、磁盘IO全都很正常。 排查发现: 订单服务的线程池悄悄\\\"罢工\\\"了 —— 核心线程全被占满，任务队列塞爆，新请求全部被拒绝，这种情况在常规监控中完全无法被发现！ 解决方案: 引入线程池监控工具，支持动态伸缩，异常预警。 链路流程如下: web请求->监控拦截器->线...\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"readingTime\":{\"minutes\":2.63,\"words\":789},\"filePathRelative\":\"zh/guide/relaxed/线程池监控.md\",\"autoDesc\":true}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
