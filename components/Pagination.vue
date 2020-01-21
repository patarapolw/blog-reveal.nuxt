<template lang="pug">
section
  nav.pagination.is-centered(v-if="count > 1" role="navigation" aria-label="pagination")
    nuxt-link.pagination-previous(v-if="prevCount > 0" :to="formatTo(page - 1)") &lt;
    button.pagination-previous(v-else disabled) &lt;

    nuxt-link.pagination-next(v-if="nextCount > 0" :to="formatTo(count)") &gt;
    button.pagination-next(v-else disabled) &gt;

    ul.pagination-list
      li(v-if="prevCount >= 2")
        nuxt-link.pagination-link(aria-label="Goto page 1" :to="formatTo(1)") 1
      li(v-if="prevCount > 2")
        span.pagination-ellipsis &hellip;
      li(v-if="prevCount >= 1")
        nuxt-link.pagination-link(:aria-label="'Goto page ' + (page - 1)" :to="formatTo(page - 1)") {{page - 1}}
      li
        a.pagination-link.is-current(:aria-label="'Page ' + page" aria-current="page") {{0}}
      li(v-if="nextCount >= 1")
        nuxt-link.pagination-link(:aria-label="'Goto page ' + (page + 1)" :to="formatTo(page + 1)") {{page + 1}}
      li(v-if="nextCount > 2")
        span.pagination-ellipsis &hellip;
      li(v-if="nextCount >= 2")
        nuxt-link.pagination-link(:aria-label="'Goto page ' + count" :to="formatTo(count)") 1
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      required: true
    },
    page: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  },
  computed: {
    prevCount () {
      return this.page - 1
    },
    nextCount () {
      return this.count - this.page
    }
  },
  methods: {
    formatTo (p) {
      const q = typeof location !== 'undefined' ? new URL(location.href).searchParams.get('q') : ''
      if (q) {
        return p !== 1 ? `/${p}?q=${encodeURIComponent(q)}` : `/?q=${encodeURIComponent(q)}`
      } else {
        return p !== 1 ? `${this.base}${p}?q=${encodeURIComponent(q)}` : `${this.base}?q=${encodeURIComponent(q)}`
      }
    }
  }
}
</script>
