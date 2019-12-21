<template lang="pug">
post-full(:header="header" :content="content")
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import htmlToText from 'html-to-text'
import { axiosOrImport, config } from '../../assets/util'
import PostFull from '@/components/PostFull.vue'

@Component({
  components: {
    PostFull,
  },
})
export default class PostPage extends Vue {
  header: any = {}
  title = config.title
  content = ''

  async asyncData ({ $axios, $payloadURL, route, params }: any) {
    if (process.static && process.client && $payloadURL) {
      return await $axios.$get($payloadURL(route))
    }

    const header = (await axiosOrImport(`/build/json/headers.json?h=${config.h}`)).filter((h: any) => {
      if (params.name === h.name) {
        return true
      }
      return false
    })[0]

    const output = {}

    if (header) {
      Object.assign(output, {
        header,
      })
    }
    return output
  }

  head () {
    const h = this.header
    if (h) {
      let { title, teaser } = h
      title = `${title} - ${this.title}`
      const description = htmlToText.fromString(teaser)

      return {
        title,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: description,
          },
          {
            hid: 'keywords',
            name: 'keywords',
            content: (h.keyword || h.tag || []).join(', '),
          },
          {
            hid: 'og:title',
            property: 'og:title',
            content: title,
          },
          {
            hid: `og:description`,
            property: 'og:description',
            content: description,
          },
          {
            hid: 'og:image',
            property: 'og:image',
            content: h.image,
          },
          {
            hid: 'twitter:title',
            property: 'twitter:title',
            content: title,
          },
          {
            hid: 'twitter:description',
            property: 'twitter:description',
            content: description,
          },
          {
            hid: 'twitter:image',
            property: 'twitter:image',
            content: h.image,
          },
        ],
      }
    }
    return {}
  }
}
</script>
