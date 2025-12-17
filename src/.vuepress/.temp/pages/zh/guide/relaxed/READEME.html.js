import comp from "D:/360Downloads/docs/relaxed-docs/src/.vuepress/.temp/pages/zh/guide/relaxed/READEME.html.vue"
const data = JSON.parse("{\"path\":\"/zh/guide/relaxed/READEME.html\",\"title\":\"Foo 功能\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"Foo 功能\",\"icon\":\"lightbulb\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Foo 功能\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[{\\\"@type\\\":\\\"Person\\\",\\\"name\\\":\\\"xiaoashuo\\\",\\\"url\\\":\\\"https://github.com/xiaoashuo/relaxed-docs\\\"}]}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/xiaoashuo/relaxed-docs/zh/guide/relaxed/READEME.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Relaxed-Docs\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Foo 功能\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"readingTime\":{\"minutes\":0.02,\"words\":6},\"filePathRelative\":\"zh/guide/relaxed/README.md\"}")
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
