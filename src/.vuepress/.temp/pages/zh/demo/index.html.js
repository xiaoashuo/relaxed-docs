import comp from "D:/idea/source/person/relaxed-docs/src/.vuepress/.temp/pages/zh/demo/index.html.vue"
const data = JSON.parse("{\"path\":\"/zh/demo/\",\"title\":\"功能说明\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"功能说明\",\"index\":false,\"icon\":\"laptop-code\",\"category\":[\"使用指南\"],\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"功能说明\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[{\\\"@type\\\":\\\"Person\\\",\\\"name\\\":\\\"xiaoashuo\\\",\\\"url\\\":\\\"https://github.com/xiaoashuo/relaxed-docs\\\"}]}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/xiaoashuo/relaxed-docs/zh/demo/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Relaxed-Docs\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"功能说明\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"readingTime\":{\"minutes\":0.06,\"words\":17},\"filePathRelative\":\"zh/demo/README.md\"}")
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
