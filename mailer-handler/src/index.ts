import 'dotenv/config'
import 'reflect-metadata'
import 'tsconfig-paths/register'

import { handle, LambdaContext, LambdaEvent, } from 'hono/aws-lambda'
import { serve } from '@hono/node-server'
import { SQSEvent } from 'aws-lambda'
import ApplicationContext from './infra/ApplicationContext'
import httpServer from './infra/http/HTTPServer'
import HTTPGateway from './infra/http/HTTPGateway'
import { container } from 'tsyringe'
import { LocalEventBus } from './infra/event-bus/LocalEventBus'
import { ProviderIds } from './domain/ProviderIds'
import { handleSQSEvent } from './application/events'
import { swaggerUI} from '@hono/swagger-ui'
import { Context } from 'hono'
import { swaggerDoc } from './infra/http/swagger'
import { serveStatic } from '@hono/node-server/serve-static'
import { readFile } from 'fs/promises'

const { NODE_ENV, PORT } = process.env

ApplicationContext.initialize()

const gateway: HTTPGateway = container.resolve(HTTPGateway)
gateway.bindRoutes(httpServer)

const eventBus: LocalEventBus = container.resolve(ProviderIds.EventBus)


httpServer.get('/swagger', swaggerUI({ url:'/docs' }))
httpServer.use('/docs', async (ctx: Context) => {
  return ctx.json(swaggerDoc)
})

httpServer.get(
  '/tdd-reports/*',
  serveStatic({
    root: './tdd-reports',
    rewriteRequestPath: (path) => {
      return path.replace(/^\/tdd-reports\//, './')
    }
  })
)

httpServer.get('/tdd-reports/', async (ctx:Context) => {
  const reportsPage = await readFile('./resources/reports.html', { encoding: 'utf-8' })
  return ctx.html(reportsPage)
})


if (PORT && NODE_ENV) {
  serve({
      fetch: httpServer.fetch,
      port: Number(PORT),
    },
    async (info: { address: any; port: any }) => {
      console.log(`Server at: http://${info.address}:${info.port}`)
    }
  )
}

function isSQSEvent(event: LambdaEvent): boolean {
  return (event as unknown as SQSEvent).Records !== undefined
}
  
export const handler = async (event:LambdaEvent, context: LambdaContext) => {
  let response;

  if (isSQSEvent(event)) {
    // Process SQS event
    console.log(`Processing sqs message: `, event)
    const eventSQS: SQSEvent = event as unknown as SQSEvent

    console.log("RECORDS: ", eventSQS)
    for (const record of eventSQS.Records) {
      await handleSQSEvent(record)
    }
    response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'SQS messages processed successfully' }),
    }
  } else {
    // Process HTTP API
    response = await handle(httpServer)(event, context)
  }

  while(eventBus.hasPendingEvents()) {
    console.log('Waiting eventbus..')
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  console.log('Finished eventbus..')

  return response
}