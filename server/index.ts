import express, { Router } from 'express'
import cors from 'cors'
import ApiBuilder from '../utils/build-api'
import { fullApi, teaserApi, headerApi, hashApi, tagApi } from './api/file'

export function startServer (port: number) {
  const app = express()

  const apiRouter = Router()
  app.use('/api', apiRouter)

  apiRouter.use(cors())

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

  return app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
}
