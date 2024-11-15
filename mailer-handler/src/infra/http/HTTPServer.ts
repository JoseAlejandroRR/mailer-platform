import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { swaggerUI} from '@hono/swagger-ui'
import { Context } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { readFile } from 'fs/promises'
import { swaggerDoc } from './swagger'

const { GATEWAY_PATH_PREFIX, SERVICE_NAME, SERVER_ORIGINS, SERVER_CORS_ORIGIN_ACTIVE } = process.env

const serverAddress = SERVER_ORIGINS ? String(SERVER_ORIGINS).split(',') : ['*']

const serverRoot = GATEWAY_PATH_PREFIX ?? ''

const httpServer = new Hono().basePath(serverRoot)

if (Boolean(SERVER_CORS_ORIGIN_ACTIVE) === true) {
  // Middleware for CORS
  httpServer.use('*', cors({
    origin: serverAddress,
  }))
}

httpServer.use(logger())

// Healtcheck
httpServer.get('/health', (c) => {
  return c.json({ currentTime: new Date(), name: SERVICE_NAME })
})

httpServer.get('/swagger', swaggerUI({ url:`${serverRoot}/docs` }))
httpServer.use('/docs', async (ctx: Context) => {
  return ctx.json(swaggerDoc)
})

httpServer.get(
  '/tdd-reports/*',
  serveStatic({
    root: './tdd-reports',
    rewriteRequestPath: (path) => {
        if (process.env.NODE_ENV === 'dev') {
          return path.replace(/^\/dev\/manager\/tdd-reports\//, './')
        }
      return path.replace(/^\/tdd-reports\//, './')
    }
  })
)

httpServer.get('/tdd-reports/', async (ctx:Context) => {
  const reportsPage = await readFile('./resources/reports.html', { encoding: 'utf-8' })
  return ctx.html(reportsPage)
})

httpServer.get('/', (c) => {
    return c.text(`${SERVICE_NAME} working!`)
})

export default httpServer
