<template lang="pug">
section
  .blog-post(v-if="header.path")
    .card.my-lg
      .card-content.content
        post-header(:header="header")
        h1.title {{header.title}}
        .image-full(v-if="header.image")
          img(:src="header.image")
        div(v-html="html")
        div(style="word-break: break-word")
          span.mr-sm Tags:
          span.mr-sm(v-for="t in header.tag || []" :key="t")
            a(:href="$router.resolve('/tag/' + t).href") {{t}}
    .card.my-lg
      .card-content
        vue-disqus(v-if="disqus" :shortname="disqus" :identifier="$route.path")
  empty(v-else)
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
import { highlightBlock, config } from '../assets/util'
import PostHeader from './PostHeader.vue'
import Empty from './Empty.vue'

@Component({
  components: {
    PostHeader,
    Empty,
  },
})
export default class PostFull extends Vue {
  @Prop({ required: true }) header!: any
  @Prop() content?: string

  html = this.content || ''

  disqus = config.external.disqus

  mounted () {
    this.updatePost()
  }

  @Watch('header.path')
  async updatePost () {
    if (!this.html && this.header.path) {
      this.html = await fetch(`/build/teaser/${this.header.path}.html?h=${this.header.h}`).then(r => r.text())
      highlightBlock(this.$el)

      this.html = await fetch(`/build/full/${this.header.path}.html?h=${this.header.h}`).then(r => r.text())
    }

    highlightBlock(this.$el)
  }
}
</script>

<style lang="scss">
.image-full {
  text-align: center;
  margin: 1rem;

  img {
    min-width: 500px;
    width: auto;
  }
}

@media only screen and (max-width: 800px) {
  .image-full {
    margin-left: -1.5rem;
    margin-right: -1.5rem;

    img {
      min-width: unset;
      width: auto;
    }
  }
}
</style>
