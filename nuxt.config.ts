import path from 'path'
import htmlToText from 'html-to-text'
import lodashMerge from 'lodash.merge'
import dotProp from 'dot-prop'
import { Configuration } from '@nuxt/types'
import serveStatic from 'serve-static'
import ApiBuilder from './utils/build-api'
import { fullApi, teaserApi, headerApi, hashApi, tagApi } from './api/file'

const apiBuilder = new ApiBuilder()
const config = apiBuilder.config
apiBuilder.loadDir('posts', true)

const h = apiBuilder._header.posts[0]
const metaImage = h ? h.image : config.image
const description = htmlToText.fromString((h
  ? apiBuilder._data.posts[h.path].teaser![h.path]
  : config.description) || '')

const nuxtConfig: Configuration = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: config.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: description },
      { hid: 'keywords', name: 'keywords', content: (config.keywords || []).join(', ') },
      {
        hid: 'og:title',
        property: 'og:title',
        content: config.title,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: description,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: metaImage,
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: config.fullUrl,
      },
      {
        hid: 'twitter:title',
        property: 'twitter:title',
        content: config.title,
      },
      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content: description,
      },
      {
        hid: 'twitter:image',
        property: 'twitter:image',
        content: metaImage,
      },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    script: [
      { src: 'https://platform.twitter.com/widgets.js', async: true, charset: 'utf-8' },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/app.scss',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/disqus',
    '~/plugins/axios-accessor',
    '~/plugins/fontawesome',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    ['@nuxtjs/google-analytics', {
      id: dotProp.get(config, 'external.google.analytics'),
    }],
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    ['nuxt-buefy', {
      materialDesignIcons: false,
      defaultIconPack: 'fas',
      defaultIconComponent: 'fa',
    }],
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    ['nuxt-mq', {
      // Default breakpoint for SSR
      defaultBreakpoint: 'desktop',
      breakpoints: {
        mobile: 600,
        tablet: 1024,
        desktop: Infinity,
      },
    }],
    'nuxt-payload-extractor',
    '@nuxtjs/sitemap',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      config.module!.rules.push(
        {
          test: /\.(html?|md|txt|ya?ml)$/,
          loader: 'raw-loader',
        },
      )
    },
  },
  generate: {
    fallback: true,
    routes: [
      ...apiBuilder._header.posts.map(h => h.url),
      ...Object.keys(apiBuilder._tag.posts).map(t => `/tag/${t}`),
    ],
  },
  hooks: {
    generate: {
      distRemoved () {
        apiBuilder.emit()
      },
    },
  },
  serverMiddleware: [
    { path: '/api/config.json', handler: '~/api/config' },
    { path: '/api/dir', handler: '~/api/dir' },
    { path: '/api/full', handler: fullApi('posts') },
    { path: '/api/teaser', handler: teaserApi() },
    { path: '/api/resources', handler: fullApi('resources') },
    { path: '/api/slides', handler: fullApi('slides') },
    { path: '/api/header', handler: headerApi() },
    { path: '/api/hash', handler: hashApi() },
    { path: '/api/tag/posts.json', handler: tagApi() },
    { path: '/favicon.ico', handler: serveStatic(path.join(apiBuilder.root, 'favicon.ico')) as any },
    { path: '/media', handler: serveStatic(path.join(apiBuilder.root, 'media')) as any },
  ],
}

export default lodashMerge(nuxtConfig, config.nuxt || {})
