import { Router } from 'express'
import bodyParser from 'body-parser'

import { config, loadDb } from '../../prebuild'

const app = Router()
const db = loadDb()

app.use(bodyParser.json())

app.get('/data/config.json', (req, res) => {
  res.send(config)
})

app.post('/data/search.json', async (req, res, next) => {
  try {
    const { q, proj, sort, skip, limit } = req.body
    let c = db.find(
      q,
      proj
    )
    if (sort) {
      c = c.sort(sort)
    }
    if (skip) {
      c = c.skip(skip)
    }
    if (limit) {
      c = c.limit(limit)
    }

    res.json(await c)
  } catch (e) {
    next(e)
  }
})

module.exports = app
