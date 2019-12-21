import { ServerMiddleware } from '@nuxt/types'
import ApiBuilder from '../utils/build-api'

const configMiddleware: ServerMiddleware = (req, res) => {
  const builder = new ApiBuilder()
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(builder.config))
}

export default configMiddleware
