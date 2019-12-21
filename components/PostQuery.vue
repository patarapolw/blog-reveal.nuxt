<template lang="pug">
section
  section.m-lg(v-if="tag")
    h2.title.is-2
      span.mr-sm Tag:
      span(style="font-weight: 400") {{tag}}
  section(v-if="posts && posts.length > 0")
    post-teaser(v-for="p in posts" :header="p" :key="p.name")
    b-pagination.my-lg.mx-sm(:current.sync="page" :total="count" :per-page="perPage"
    icon-prev="caret-left" icon-next="caret-right" size="default" rounded)
  div(v-else-if="posts")
    empty
  div(v-else)
</template>

<script lang="ts">
import QParser from 'q2filter'
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
import PostTeaser from './PostTeaser.vue'
import Empty from './Empty.vue'
import { normalizeArray, searchPosts, config } from '@/assets/util'

@Component({
  components: {
    PostTeaser,
    Empty,
  },
})
export default class PostQuery extends Vue {
  @Prop({ default: '' }) q!: string
  @Prop({ default: '' }) tag!: string
  @Prop({ required: true }) defaults!: {
    count: number
    posts: any[]
  }

  count = this.defaults.count
  posts: any[] = this.defaults.posts
  perPage = 5

  get page () {
    return parseInt(normalizeArray(this.$route.query.page) || '1')
  }

  set page (p) {
    const { page, ...query } = this.$route.query
    if (p === 1) {
      this.$router.push({ query })
    } else {
      this.$router.push({ query: {
        ...query,
        page: p.toString(),
      } })
    }
  }

  mounted () {
    this.updatePosts()
  }

  @Watch('page')
  @Watch('q')
  @Watch('tag')
  async updatePosts () {
    const ps = await Promise.all(searchPosts({
      q: this.tag ? {
        tag: this.tag,
      } : this.q,
      current: true,
      headers: await fetch(`/build/json/headers.json?h=${config.h}`).then(r => r.json()),
    }).map(async (h) => {
      if (!h.teaser) {
        h.teaser = await fetch(`/build/teaser/${h.path}.html`).then(r => r.text())
      }
      return h
    }))

    this.count = ps.length
    this.posts = ps.filter((p, i) => {
      const iPage = i / this.perPage
      return iPage >= this.page - 1 && iPage < this.page
    })
  }
}
</script>
