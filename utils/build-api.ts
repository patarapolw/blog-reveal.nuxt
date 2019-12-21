import path from 'path'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import moment from 'moment'
import fs from 'fs-extra'
// @ts-ignore
import shortHash from 'short-hash'
import stringify from 'es6-json-stable-stringify'
import { scan } from 'dree'
import glob from 'fast-glob'
import MakeHtml from './make-html'

export type DataType = 'posts' | 'slides' | 'resources'

export interface IData {
  teaser?: string
  full: string
}

export default class ApiBuilder {
  private makeHtml = new MakeHtml()

  _hash: Record<DataType, Record<string, string>> = {
    posts: {},
    slides: {},
    resources: {},
  }
  _tag: Record<DataType, Record<string, number>> = {
    posts: {},
    slides: {},
    resources: {},
  }
  _header: Record<DataType, any[]> = {
    posts: [],
    slides: [],
    resources: [],
  }
  _data: Record<DataType, Record<string, IData>> = {
    posts: {},
    slides: {},
    resources: {},
  }

  constructor (public root: string = process.env.ROOT!) {
    if (!root) {
      throw new Error('Root is not defined.')
    }
  }

  get config () {
    const config = yaml.safeLoad(fs.readFileSync(path.join(this.root, 'config.yaml'), 'utf8'))

    return config
  }

  getDirTree (dirName: DataType) {
    return scan(path.join(this.root, dirName), {
      exclude: /.git/,
      extensions: ['md'],
    })
  }

  loadFile (dirName: DataType, fileName: string, asHtml?: boolean) {
    const ROOT = path.join(this.root, dirName)

    const raw = fs.readFileSync(path.join(ROOT, fileName), 'utf8')

    const m = matter(raw)
    const p = path.parse(fileName)
    m.data = {
      ...m.data,
      name: p.name,
      path: fileName,
    }

    if (m.data.date) {
      let mm = moment(m.data.date)
      mm = mm.add(-mm.utcOffset(), 'minute')

      Object.assign(m.data, {
        date: mm.toISOString(),
        y: mm.format('YYYY'),
        mo: mm.format('MM'),
      })
    }

    let data: IData = {
      full: m.content,
    }

    if (asHtml) {
      const contentParts = m.content.split(/\n===\n/)
      data = {
        teaser: this.makeHtml.parse(contentParts[0]),
        full: this.makeHtml.parse(contentParts.join('\n')),
      }
    }

    return {
      header: m.data,
      data,
    }
  }

  loadDir (dirName: DataType, asHtml?: boolean) {
    const ROOT = path.join(this.root, dirName)
    const now = new Date().toISOString()

    glob.sync('**/*.md', {
      cwd: ROOT,
    }).map((f) => {
      const { header, data } = this.loadFile(dirName, f, asHtml)
      this._hash[dirName][f] = shortHash(data.full)

      if (dirName === 'posts' && header.date && header.date < now && header.path.startsWith('blog/')) {
        if (Array.isArray(header.tag)) {
          for (const t of header.tag) {
            this._tag[dirName][t] = (this._tag[dirName][t] || 0) + 1
          }
        }
      }

      this._header[dirName].push(header)
      this._data[dirName][f] = data
    })

    this._header[dirName] = this._header[dirName].sort((h1, h2) => {
      if (typeof h1.date === 'string' && typeof h2.date === 'string') {
        return -h1.date.localeCompare(h2.date)
      }
      return 0
    })

    this._hash[dirName]._header = shortHash(stringify(this._header[dirName]))

    return {
      header: this._header[dirName],
      hash: this._hash[dirName]._header,
      tag: this._tag[dirName],
    }
  }

  emit () {
    const dst = path.join(this.root, 'dist')

    this.loadDir('posts', true)
    this.loadDir('resources')
    this.loadDir('slides')

    /**
     * Emit config, tags
     */
    console.log('Emitting config, tags')
    fs.ensureDirSync(`${dst}/api`)
    fs.writeFileSync(`${dst}/api/config.json`, JSON.stringify(this.config))
    fs.writeFileSync(`${dst}/api/tag/posts.json`, JSON.stringify(this._tag.posts))

    /**
     * Emit favicon
     */
    console.log('Emitting favicon')
    if (fs.existsSync(`${this.root}/favicon.ico`)) {
      fs.copyFileSync(`${this.root}/favicon.ico`, `${dst}/favicon.ico`)
    }

    /**
     * Emit media
     */
    console.log('Emitting media')
    if (fs.existsSync(`${this.root}/media`)) {
      fs.copySync(`${this.root}/media`, `${dst}/media`)
    }

    /**
     * Emit dirTree
     */
    console.log('Emitting dirTree')
    fs.ensureDirSync(`${dst}/api/dir`)
    fs.writeFileSync(`${dst}/api/dir/posts.json`, this.getDirTree('posts'))
    fs.writeFileSync(`${dst}/api/dir/resources.json`, this.getDirTree('resources'))
    fs.writeFileSync(`${dst}/api/dir/slides.json`, this.getDirTree('slides'))

    /**
     * Emit header
     */
    console.log('Emitting header')
    fs.ensureDirSync(`${dst}/api/header`)
    fs.writeFileSync(`${dst}/api/header/posts.json`, JSON.stringify(this._header.posts))
    fs.writeFileSync(`${dst}/api/header/resources.json`, JSON.stringify(this._header.resources))
    fs.writeFileSync(`${dst}/api/header/slides.json`, JSON.stringify(this._header.slides))

    /**
     * Emit tag
     */
    console.log('Emitting tag')
    fs.ensureDirSync(`${dst}/api/tag`)
    fs.writeFileSync(`${dst}/api/tag/posts.json`, JSON.stringify(this._tag.posts))

    /**
     * Emit posts
     */
    console.log('Emitting blog entries')
    fs.ensureDirSync(`${dst}/api/teaser`)
    fs.ensureDirSync(`${dst}/api/full`)
    for (const [p, data] of Object.entries(this._data.posts)) {
      fs.writeFileSync(`${dst}/api/teaser/${p}`, data.teaser)
      fs.writeFileSync(`${dst}/api/full/${p}`, data.full)
    }

    /**
     * Emit slides
     */
    console.log('Emitting slides')
    fs.ensureDirSync(`${dst}/api/slides`)
    for (const [p, data] of Object.entries(this._data.slides)) {
      fs.writeFileSync(`${dst}/api/slides/${p}`, data.full)
    }

    /**
     * Emit resources
     */
    console.log('Emitting resources')
    fs.ensureDirSync(`${dst}/api/resources`)
    for (const [p, data] of Object.entries(this._data.resources)) {
      fs.writeFileSync(`${dst}/api/resources/${p}`, data.full)
    }
  }
}
