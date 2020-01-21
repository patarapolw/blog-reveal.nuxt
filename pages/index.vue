<template lang="pug">
post-query(:posts="posts" :count="count")
</template>

<script>
import PostQuery from '@/components/PostQuery'

export default {
  components: {
    PostQuery
  },
  async asyncData ({ $axios, $payloadURL, route }) {
    if (process.static && process.client && $payloadURL) { return $axios.$get($payloadURL(route)) }

    const rPosts = await $axios.post(`/data/search.json`, {
      q: { epoch: { $lt: +new Date() } },
      sort: { epoch: -1 },
      limit: 5
    })

    const rAll = await $axios.post(`/data/search.json`, {
      q: { epoch: { $lt: +new Date() } },
      proj: { path: 1 }
    })

    return {
      posts: rPosts.data,
      count: rAll.data.length
    }
  }
}
</script>
