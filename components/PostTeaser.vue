<template lang="pug">
section.card(style="margin-bottom: 1em")
  .card-content
    h2.title
      nuxt-link.hoverable(:to="url") {{p.frontmatter.title}}
    div(style="height: 1.5em; margin-bottom: 2em;")
      small.is-pulled-right {{dateString}}

    .columns(v-if="p.frontmatter.image" style="flex-direction: row-reverse;")
      .column.is-two-fifths
        figure.image
          img.lazyload(:alt="p.frontmatter.title" :data-src="p.frontmatter.image")
      .column
        .content(v-html="toHtml(p.excerpt)")
    .content(v-else v-html="toHtml(p.excerpt)")

    div(style="height: 20px")
      nuxt-link.button.is-outlined.is-danger.is-pulled-right(:to="url") Read more
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
    url () {
      const m = this.p.epoch ? dayjs(this.p.epoch) : null
      return m ? `/posts/${m.format('YYYY')}/${m.format('MM')}/${this.p.slug}` : `/posts/${this.p.slug}`
    },
    dateString () {
      const m = this.p.epoch ? dayjs(this.p.epoch) : null
      return m ? m.format('LL') : ''
    }
  },
  methods: {
    toHtml (md) {
      return mdConverter.makeHtml(md.replace(/<[^<]*?$/s, ''))
    }
  }
}
</script>

<style lang="scss" scoped>
a.hoverable:hover {
  color: blue;
}
</style>
