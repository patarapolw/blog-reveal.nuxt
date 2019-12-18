<template lang="pug">
div.page-social
  b-navbar-item(v-if="social.twitter" :href="social.twitter" target="_blank")
    fa(:icon="['fab', 'twitter']")
  b-navbar-item(v-if="social.facebook" :href="social.facebook" target="_blank")
    fa(:icon="['fab', 'facebook-f']")
  b-navbar-item(v-if="social.reddit" :href="social.reddit" target="_blank")
    fa(:icon="['fab', 'reddit']")
  b-navbar-item(v-if="social.quora" :href="social.quora" target="_blank")
    fa(:icon="['fab', 'quora']")
  b-navbar-item(v-if="social.github" :href="social.github" target="_blank")
    fa(:icon="['fab', 'github']")
  b-navbar-item(v-if="email" :href="'mailto:' + email" target="_blank")
    fa(:icon="['fa', 'at']")
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";

@Component
export default class PageSocial extends Vue {
  @Prop({default: {}}) social!: any;
  @Prop() email?: string;
}
</script>

<style lang="scss">
.page-social {
  height: 100%;
  display: inline-flex;
  justify-content: center;
}
</style>