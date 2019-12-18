<template lang="pug">
.card.my-lg.blog-post
  .card-content
    post-header(:header="header")
    .post-content
      .image-teaser(v-if="header.image")
        img(:src="header.image")
      h2.title {{header.title}}
      .content(v-html="teaser")  
    div(style="display: flex; justify-content: flex-end")
      b-button(type="is-danger" outlined @click="$router.push(header.url)") Read more
</template>

<script lang="ts">
import { highlightBlock } from "@/assets/util";
import PostHeader from "./PostHeader.vue";
import { Vue, Component, Prop } from "nuxt-property-decorator";

@Component({
  components: {
    PostHeader
  }
})
export default class PostTeaser extends Vue {
  @Prop({ required: true }) header!: any;

  teaser: string = this.header.teaser || "";

  async mounted() {
    highlightBlock(this.$el);

    if (!this.teaser) {
      this.teaser = await fetch(`/build/teaser/${this.header.path}.html?h=${this.header.h}`).then((r) => r.text());
    }
  }

  updated() {
    highlightBlock(this.$el);
  }
}
</script>

<style lang="scss">
.content {
  width: 100%;
  margin: 0;
  max-width: 80vw;
}

.post-content {
  width: 100%;
  overflow: visible;
}

.image-teaser {
  width: calc(100% + 3rem);
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: -1.5rem;
  margin-right: -1.5rem;
}

@media only screen and (min-width: 800px) {
  .image-teaser {
    width: 100%;
    max-width: 300px;
    max-height: 300px;
    float: right;
    margin: 1rem;
  }

  .post-content {
    overflow: auto;
  }
}
</style>