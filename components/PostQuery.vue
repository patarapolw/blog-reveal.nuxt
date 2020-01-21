<template lang="pug">
section(style="margin-top: 1em")
  h1.title(v-if="tag" style="margin-bottom: 0.5em")
    span Tag:&nbsp;
    strong {{tag}}
  post-teaser(v-for="p in posts" :key="p.slug" :p="p")
  pagination(:page="pageNumber" :count="Math.ceil(count / 5)" :base="tag ? '/tag/': '/'")
</template>

<script>
import PostTeaser from './PostTeaser'
import Pagination from './Pagination'

export default {
  components: {
    PostTeaser,
    Pagination
  },
  props: {
    tag: {
      type: String,
      default: ''
    },
    posts: {
      type: Array,
      default: () => []
    },
    count: {
      type: Number,
      default: 0
    },
    pageNumber: {
      type: Number,
      default: 1
    }
  },
  head () {
    const p = this.posts[0] || {}

    return {
      title: this.tag ? `Tag: ${this.tag}` : 'All posts',
      meta: [
        ...(p.excerpt ? [
          { hid: 'description', name: 'description', content: p.excerpt },
          { hid: 'og:description', property: 'og:description', content: p.excerpt },
          { hid: 'twitter:description', property: 'twitter:description', content: p.excerpt }
        ] : []),
        ...(p.image ? [
          { hid: 'og:image', property: 'og:image', content: p.image },
          { hid: 'twitter:image', property: 'twitter:image', content: p.image },
          { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' }
        ] : [])
      ]
    }
  }
}
</script>
