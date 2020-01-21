<template lang="pug">
post-full(:p="post")
</template>

<script>
import PostFull from '@/components/PostFull'

export default {
  components: {
    PostFull
  },
  async asyncData ({ $axios, $payloadURL, route }) {
    if (process.static && process.client && $payloadURL) { return $axios.$get($payloadURL(route)) }

    const { y, mo, slug } = route.params

    const rPosts = await $axios.post(`/data/search.json`, {
      q: { y, mo, slug },
      sort: { epoch: -1 },
      limit: 1
    })

    return {
      post: rPosts.data[0]
    }
  }
}
</script>
