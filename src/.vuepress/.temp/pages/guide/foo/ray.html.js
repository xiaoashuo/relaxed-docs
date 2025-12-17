import comp from "D:/360Downloads/docs/relaxed-docs/src/.vuepress/.temp/pages/guide/foo/ray.html.vue"
const data = JSON.parse("{\"path\":\"/guide/foo/ray.html\",\"title\":\"Ray\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"Ray\",\"icon\":\"circle-info\",\"description\":\"Feature details here.\"},\"readingTime\":{\"minutes\":0.03,\"words\":8},\"filePathRelative\":\"guide/foo/ray.md\",\"autoDesc\":true}")
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
