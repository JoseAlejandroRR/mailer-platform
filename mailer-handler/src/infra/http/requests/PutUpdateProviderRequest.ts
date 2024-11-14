import { zValidator } from '@hono/zod-validator'
import { MiddlewareHandler } from 'hono'
import { z } from 'zod'
import { OptionalInteger, OptionalString } from '.'

const PutUpdateProviderRequest: MiddlewareHandler[] = [
  zValidator('json', z.object({
    name: OptionalString(2, 20),
    priority: OptionalInteger(1, 100),
    status: OptionalString(1,10),
  }))
]

export default PutUpdateProviderRequest