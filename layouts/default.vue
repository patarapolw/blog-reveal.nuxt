<template lang="pug">
div
  b-navbar.is-light(fixed-top)
    template(slot="brand")
      b-navbar-item(tag="nuxt-link" to="/") {{config.title}}
    template(slot="end")
      form.control(style="margin: 10px; margin-right: 2em" @submit.prevent="doSearch(q)")
        input.input.is-pulled-right.is-rounded(type="search" placeholder="Type and Enter to Search" style="width: 300px"
          v-model="q")
  .columns
    .column.is-three-fifths-desktop.is-offset-one-fifth-desktop
      nuxt
</template>

<script>
export default {
  data () {
    return {
      q: ''
    }
  },
  computed: {
    config () {
      return JSON.parse(process.env.config)
    }
  }
}
</script>
