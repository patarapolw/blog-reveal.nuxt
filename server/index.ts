import express, { Express, Router } from 'express'
import ApiBuilder from '../utils/build-api'
import { fullApi, teaserApi, headerApi, hashApi, tagApi } from './api/file'

let app: Express

export function startServer (port: number) {
  app = express()

  const apiRouter = Router()
  app.use('/api', apiRouter)

  apiRouter.get('/config.json', (req, res) => {
    const builder = new ApiBuilder()
    res.send(builder.config)
  })

  apiRouter.get('/dir/:filename.json', (req, res) => {
    const builder = new ApiBuilder()
    res.send(builder.getDirTree(req.params.filename as any))
  })

  apiRouter.get('/full/*', fullApi('posts'))
  apiRouter.get('/teaser/*', teaserApi())
  apiRouter.get('/resources/*', fullApi('resources'))
  apiRouter.get('/slides/*', fullApi('slides'))
  apiRouter.get('/header/:filename.json', headerApi())
  apiRouter.get('/hash/:filename.json', hashApi())
  apiRouter.get('/tag/posts.json', tagApi())

  app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
}

export async function stopServer () {
  await (app as any).close()
}
