<template lang="pug">
div
</template>

<script>
import scopeCss from 'scope-css'
import h from 'hyperscript'
import showdown from 'showdown'

const mdConverter = new showdown.Converter()
mdConverter.setFlavor('github')

export default {
  layout: 'reveal',
  data () {
    return {
      raw: []
    }
  },
  head () {
    return {
      link: [
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/reveal.js@3.8.0/css/reveal.min.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/reveal.js@3.8.0/css/theme/white.css' }
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/reveal.js@3.8.0/js/reveal.min.js', async: true }
      ]
    }
  },
  async asyncData ({ $axios, $payloadURL, route }) {
    if (process.static && process.client && $payloadURL) { return $axios.$get($payloadURL(route)) }

    const rPosts = await $axios.post(`/data/search.json`, {
      q: { type: 'reveal', path: decodeURIComponent(route.params.path).replace('--', '.') },
      limit: 1,
      proj: { content: 1 }
    })

    return {
      post: rPosts.data[0]
    }
  },
  mounted () {
    this.setMarkdown(this.post.content)
    window.Reveal.initialize({
      dependencies: [
        {
          src: 'https://cdn.jsdelivr.net/npm/reveal.js@3.8.0/plugin/highlight/highlight.js',
          async: true
        }
      ]
    })
  },
  methods: {
    setMarkdown (s) {
      const globalEl = document.getElementById('global')
      Array.from(globalEl.querySelectorAll('style.ref')).map(el => el.remove())

      let xOffset = 0
      s.split(/\r?\n(?:===|---)\r?\n/g).map((el, x) => {
        this.raw[x] = this.raw[x] || []
        const newRawSs = el.split(/\r?\n--\r?\n/g).map(ss => this.parseSlide(ss))
        if (newRawSs.every(ss => !ss.html)) {
          xOffset++
        }

        x -= xOffset

        let yOffset = 0
        return newRawSs.map((thisRaw, y) => {
          if (!thisRaw.html) {
            yOffset++
            return
          }

          y -= yOffset

          let section = this.getSlide(x)
          let subSection = this.getSlide(x, y)

          if (!this.raw[x][y] || (this.raw[x][y] && this.raw[x][y].raw !== thisRaw.raw)) {
            const container = document.createElement('div')
            container.className = 'container'
            container.innerHTML = thisRaw.html

            if (section && subSection) {
              const oldContainers = subSection.getElementsByClassName('container')
              Array.from(oldContainers).forEach(el => el.remove())
              subSection.appendChild(container)
            } else {
              subSection = document.createElement('section')
              subSection.append(container)

              if (section) {
                section.appendChild(subSection)
              } else {
                section = document.createElement('section')
                section.appendChild(subSection)
                document.querySelector('.reveal .slides').appendChild(section)
              }
            }

            Array.from(container.querySelectorAll('pre code:not(.hljs)')).forEach((el) => {
              if (window.hljs) {
                window.hljs.highlightBlock(el)
              }
            })
          }

          return thisRaw
        }).filter(el => el)
      }).filter(el => el && el.length > 0)
    },
    parseSlide (text) {
      const id = this.hash(text)
      const raw = text
      let type = 'regular'
      let html = text
      const [firstLine, ...lines] = html.split('\n')
      const newType = firstLine.substr(3)
      if (newType === 'hidden') {
        type = 'hidden'
        return { html: '', raw, id, type }
      } else if (newType === 'global') {
        type = 'global'
        html = lines.join('\n')
      }

      html = html.replace(/(?:^|\n)\/\/ css=([A-Za-z0-9\-_]+\.css)(?:$|\n)/g, (p0, ref) => {
        const i = raw.indexOf(p0)
        const globalEl = document.getElementById('global')
        const className = `ref${i}`

        let el = globalEl.querySelector(`style.ref.${className}`)
        if (!el) {
          el = document.createElement('style')
          el.classList.add('ref', className)
          globalEl.appendChild(el)
        }

        fetch(ref).then(r => r.text()).then((content) => {
          if (type !== 'global') {
            content = scopeCss(content, `#${id}`)
          }
          el.innerHTML = content
        })

        return ''
      })

      html = html.replace(/(?:^|\n)(\/\/ slide\n)?```(\S+)\n([^]+?)\n```(?:$|\n)/g, (p0, subtype, lang, content) => {
        if (type !== 'global' && !subtype) {
          return p0
        }

        if (lang === 'css') {
          const globalEl = document.getElementById('global')
          if (type !== 'global') {
            content = scopeCss(content, `#${id}`)
          }
          let el = globalEl.querySelector('style.main')
          if (!el) {
            el = document.createElement('style')
            el.className = 'main'
            globalEl.appendChild(el)
          }
          el.innerHTML = content
          return ''
        } else if (lang === 'pre') {
          return h('pre', content).outerHTML
        } else {
          return mdConverter.makeHtml(content, lang)
        }
      })

      if (type === 'global') {
        document.body.insertAdjacentHTML('beforeend', html)
        return { html: '', raw, id, type }
      }

      return {
        html: h(`#${id}`, {
          innerHTML: mdConverter.makeHtml(html)
        }).outerHTML,
        raw,
        id,
        type
      }
    },
    getSlide (x, y) {
      const s = document.querySelectorAll('.slides > section')
      const hSlide = s[x]

      if (typeof y === 'number') {
        if (hSlide) {
          return Array.from(hSlide.children).filter(el => el.tagName.toLocaleUpperCase() === 'SECTION')[y]
        }

        return undefined
      }

      return hSlide
    },
    hash (str) {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i)
        hash = hash & hash
      }
      return 'h' + Math.round(Math.abs(hash)).toString(36)
    }
  }
}
</script>

<style lang="scss">
.container {
  max-height: 90vh;
  overflow: scroll;
}

img, video, iframe {
  max-height: 80vh;
  max-width: 80vw;
}
</style>
