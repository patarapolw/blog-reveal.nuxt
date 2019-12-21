import { ServerMiddleware } from '@nuxt/types'
import ApiBuilder, { DataType } from '../utils/build-api'

export function fullApi (type: DataType): ServerMiddleware {
  return (req, res) => {
    const builder = new ApiBuilder()
    res.end(builder.loadFile(type, req.url!, type === 'posts').data.full)
  }
}

export function teaserApi (): ServerMiddleware {
  return (req, res) => {
    const builder = new ApiBuilder()
    res.end(builder.loadFile('posts', req.url!, true).data.teaser)
  }
}

export function tagApi (): ServerMiddleware {
  return (req, res) => {
    const builder = new ApiBuilder()
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(builder.loadDir('posts').tag))
  }
}

export function headerApi (): ServerMiddleware {
  return (req, res, next) => {
    const m = /(\S+)\.json$/.exec(req.url!)
    if (m) {
      const builder = new ApiBuilder()
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify(builder.loadDir(m[1] as any).header))
    }
    next()
  }
}

export function hashApi (): ServerMiddleware {
  return (req, res, next) => {
    const m = /(\S+)\.json$/.exec(req.url!)
    if (m) {
      const builder = new ApiBuilder()
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify(builder.loadDir(m[1] as any).hash))
    }
    next()
  }
}
