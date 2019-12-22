import { RequestHandler } from 'express'
import ApiBuilder, { DataType } from '../../utils/build-api'

export function fullApi (type: DataType): RequestHandler {
  return (req, res) => {
    const builder = new ApiBuilder()
    res.send(builder.loadFile(type, req.params[0], type === 'posts').data.full)
  }
}

export function teaserApi (): RequestHandler {
  return (req, res) => {
    const builder = new ApiBuilder()
    res.send(builder.loadFile('posts', req.params[0], true).data.teaser)
  }
}

export function tagApi (): RequestHandler {
  return (req, res) => {
    const builder = new ApiBuilder()
    res.send(builder.loadDir('posts').tag)
  }
}

export function headerApi (): RequestHandler {
  return (req, res) => {
    const builder = new ApiBuilder()
    res.send(builder.loadDir(req.params.filename as any).header)
  }
}

export function hashApi (): RequestHandler {
  return (req, res) => {
    const builder = new ApiBuilder()
    res.send(builder.loadDir(req.params.filename as any).hash)
  }
}
