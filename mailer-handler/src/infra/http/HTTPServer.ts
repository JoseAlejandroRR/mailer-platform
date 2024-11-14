import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const { GATEWAY_PATH_PREFIX, SERVICE_NAME, SERVER_ORIGINS, SERVER_CORS_ORIGIN_ACTIVE } = process.env

const serverAddress = SERVER_ORIGINS ? String(SERVER_ORIGINS).split(',') : ['*']

const httpServer = new Hono().basePath(GATEWAY_PATH_PREFIX ?? '/')

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

httpServer.get('/', (c) => {
    return c.text(`${SERVICE_NAME} working!`)
})

export default httpServer
