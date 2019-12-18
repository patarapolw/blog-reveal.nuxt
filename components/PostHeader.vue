<template lang="pug">
.post-meta.mb-sm
  .post-meta-author
    a.mr-md(:href="author.link" style="width: 24px; min-width: 24px"): img(:src="author.avatar" style="border-radius: 50%;")
    a.mr-md(:href="author.link") {{author.login}}
  div(style="flex-grow: 1")
  div {{dateString}}
</template>

<script lang="ts">
import moment, { Moment } from "moment";
import { Vue, Component, Prop } from "nuxt-property-decorator";
import { config } from "@/assets/util";

@Component
export default class PostHeader extends Vue {
  @Prop({required: true}) header!: any;

  author = config.author;

  get moment() {
    return this.header.date ? moment(this.header.date) : null;
  }

  get dateString() {
    return this.moment ? this.moment.format("ddd D MMMM YYYY") : "";
  }
}
</script>

<style lang="scss">
.post-meta {
  display: flex;
  flex-direction: row;
  white-space: nowrap;
  overflow: auto;

  .post-meta-author {
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    justify-content: center;

    a {
      border: none;
      display: block;
    }
  }
}
</style>