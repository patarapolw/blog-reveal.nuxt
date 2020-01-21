import path from 'path'

import fs from 'fs-extra'
import dotenv from 'dotenv'
import matter from 'gray-matter'
import glob from 'fast-glob'
import DataStore from 'nedb-promises'
import yaml from 'js-yaml'
import dayjs from 'dayjs'

dotenv.config()

export function loadDb () {
  const db = new DataStore()

  glob.sync('**/*.md', {
    cwd: path.join(process.env.ROOT, 'data')
  }).map((f) => {
  // eslint-disable-next-line prefer-const
    let { data, content, excerpt } = matter(fs.readFileSync(path.join(process.env.ROOT, 'data', f), 'utf8'), {
      engines: {
        yaml: s => yaml.safeLoad(s, {
          schema: yaml.JSON_SCHEMA
        })
      },
      excerpt_separator: '<!-- excerpt_separator -->'
    })

    const ps = f.split('/')
    let slug = ps[ps.length - 1].replace(/\.md$/, '');
    (() => {
      const m = /^(\d{4}-\d{2}-\d{2})-(.+)$/.exec(slug)
      if (m) {
        data.date = data.date || m[1]
        slug = m[2]
      }
    })()

    const type = data.type || ps[0]

    if (!data.title) {
      const m = /^.*?# ([^\n]+)(.+)$/s.exec(content)
      if (m) {
        data.title = m[1]
        if (!['reveal', 'slides'].includes(type)) {
          content = m[2]
        }
      }
    }

    const epoch = data.date ? customDateStringToEpoch(data.date) : undefined
    const m = epoch ? dayjs(epoch) : undefined

    excerpt = (excerpt || content).replace(/<[^>]+>?/g, '').substr(0, 140)

    db.insert({
      path: f,
      type,
      slug,
      excerpt,
      frontmatter: data,
      epoch,
      content,
      y: m ? m.format('YYYY') : undefined,
      mo: m ? m.format('MM') : undefined
    })
  })

  return db
}

// eslint-disable-next-line import/no-mutable-exports
export let config = {}
if (fs.existsSync(path.join(process.env.ROOT, 'config.json'))) {
  config = require(path.join(process.env.ROOT, 'config.json'))
}

if (fs.existsSync(path.join(process.env.ROOT, 'data/media'))) {
  fs.copySync(
    path.join(process.env.ROOT, 'data/media'),
    'static/media'
  )
}

function customDateStringToEpoch (date) {
  if (!date) {
    return undefined
  }

  /**
   * Moment will default timezone to local if not specified, unlike Date.parse
   *
   * https://momentjs.com/docs/#/parsing/
   *
   * See #please-read
   */
  let m = dayjs(date, [
    'YYYY-MM-DD HH:MM ZZ',
    'YYYY-MM-DD ZZ',
    'YYYY-MM-DD HH:MM',
    'YYYY-MM-DD'
  ])

  if (m.isValid()) {
    /**
     * moment().unix() is in seconds
     */
    return m.unix() * 1000
  }

  m = dayjs(date)

  if (m.isValid()) {
    return m.unix() * 1000
  }

  return undefined
}
