import hljs from 'highlight.js'
import hljsDefineVue from 'highlightjs-vue'
import QParser from 'q2filter'
import { $axios } from '../utils/api'

export function escapeRegExp (s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function normalizeArray<T> (it: T | T[]): T | undefined {
  if (Array.isArray(it)) {
    return it[0]
  }

  return it
}

hljsDefineVue(hljs)

export function highlightBlock (parent: Element) {
  Array.from(parent.querySelectorAll('pre code:not(.hljs)')).forEach((el) => {
    hljs.highlightBlock(el)
  })
}

export function searchPosts (options: {
  q?: any
  current?: boolean
  headers: any[]
}) {
  let posts: any[] = options.headers

  if (options.current) {
    const now = new Date().toISOString()
    posts = posts.filter(h => h.date && h.date <= now)
  }

  const parser = new QParser(options.q || {}, {
    isString: ['title', 'author', 'tag'],
    isDate: ['date'],
    filters: {
      'is:reversed': (items) => {
        return items.reverse()
      },
    },
    sortBy: {
      key: 'date',
      desc: true,
    },
  })

  return parser.parse(posts)
}

export async function axiosOrImport (url: string) {
  if (process.env.NODE_ENV === 'production') {
    try {
      return (await import(`@/static${url.replace(/\?.*$/, '')}`)).default
    } catch (e) {
      console.error(e)
    }
  }

  return await $axios.$get(url)
}

export const config = JSON.parse(process.env.CONFIG!)
