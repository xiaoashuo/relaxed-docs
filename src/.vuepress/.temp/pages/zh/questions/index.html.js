import comp from "D:/idea/source/person/relaxed-docs/src/.vuepress/.temp/pages/zh/questions/index.html.vue"
const data = JSON.parse("{\"path\":\"/zh/questions/\",\"title\":\"Questions\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"Questions\",\"article\":false,\"feed\":false,\"sitemap\":false,\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"Questions\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/xiaoashuo/relaxed-docs/zh/questions/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Relaxed-Docs\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Questions\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"en-US\"}]]},\"readingTime\":{\"minutes\":0,\"words\":1},\"filePathRelative\":null}")
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
