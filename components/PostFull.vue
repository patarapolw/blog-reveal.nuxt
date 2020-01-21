<template lang="pug">
.card(style="margin-top: 1em")
  .card-content(v-if="!['reveal', 'slides'].includes(p.type)")
    h1.title {{p.frontmatter.title}}
    div(style="height: 1.5em; margin-bottom: 2em;")
      small.is-pulled-right {{dateString}}

    .media(v-if="p.frontmatter.image")
      figure.image
        img.lazyload(:alt="p.frontmatter.title" :src="p.frontmatter.image")

    .content(v-html="toHtml(p.content)")
  .card-content(v-else)
    iframe.reveal-iframe(frameborder="0" :src="revealUrl")
</template>

<script>
import dayjs from 'dayjs'
import showdown from 'showdown'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(LocalizedFormat)

const mdConverter = new showdown.Converter()
mdConverter.setFlavor('github')

export default {
  props: {
    p: {
      type: Object,
      required: true
    }
  },
  computed: {
    revealUrl () {
      return `${process.env.baseUrl || '/'}reveal/${encodeURIComponent(this.p.path).replace('.', '--')}`
    },
    dateString () {
      const m = this.p.epoch ? dayjs(this.p.epoch) : null
      return m ? m.format('LL') : ''
    }
  },
  methods: {
    toHtml (md) {
      return mdConverter.makeHtml(md.replace(/<[^<>]*?$/s, ''))
    }
  },
  head () {
    const p = this.p

    return {
      title: p.title,
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

<style lang="scss">
.reveal-iframe {
  width: 100%;
  height: 500px;
}
</style>
