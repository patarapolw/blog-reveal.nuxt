<template lang="pug">
post-query(:q="q" :defaults="defaults")
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { teaserStore } from '../store'
import PostQuery from '@/components/PostQuery.vue'
import { normalizeArray, searchPosts, axiosOrImport, config } from '@/assets/util'

@Component({
  components: {
    PostQuery,
  },
})
export default class Index extends Vue {
  q = ''

  async asyncData ({ $axios, $payloadURL, route }: any) {
    if (process.static && process.client && $payloadURL) {
      return await $axios.$get($payloadURL(route))
    }

    const ps = searchPosts({
      current: true,
      headers: await axiosOrImport(`/build/json/headers.json?h=${config.h}`),
    })
    const posts = await Promise.all(ps.slice(0, config.posts.perPage).map(async (p) => {
      p.teaser = await teaserStore.get(p.path, p.h)
      return p
    }))

    return {
      defaults: {
        posts,
        count: ps.length,
      },
    }
  }

  mounted () {
    this.q = normalizeArray(this.$route.query.q) || ''
  }

  @Watch('$route.query.q')
  onQChanged (q: string) {
    this.q = q
  }
}
</script>
