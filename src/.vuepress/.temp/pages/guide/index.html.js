import comp from "D:/360Downloads/docs/relaxed-docs/src/.vuepress/.temp/pages/guide/index.html.vue"
const data = JSON.parse("{\"path\":\"/guide/\",\"title\":\"Guide\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"Guide\",\"icon\":\"lightbulb\",\"description\":\"Highlight Features Bar ... Foo ...\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Guide\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[{\\\"@type\\\":\\\"Person\\\",\\\"name\\\":\\\"xiaoashuo\\\",\\\"url\\\":\\\"https://github.com/xiaoashuo/relaxed-docs\\\"}]}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/xiaoashuo/relaxed-docs/guide/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Relaxed-Docs\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Guide\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Highlight Features Bar ... Foo ...\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"en-US\"}],[\"meta\",{\"property\":\"og:locale:alternate\",\"content\":\"zh-CN\"}],[\"link\",{\"rel\":\"alternate\",\"hreflang\":\"zh-cn\",\"href\":\"https://github.com/xiaoashuo/relaxed-docs/zh/guide/\"}]]},\"readingTime\":{\"minutes\":0.05,\"words\":14},\"filePathRelative\":\"guide/README.md\",\"autoDesc\":true}")
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
