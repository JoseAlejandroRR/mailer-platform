import { zValidator } from '@hono/zod-validator'
import { MiddlewareHandler } from 'hono'
import { z } from 'zod'
import { RequireString } from '.'

const GetEmailsRequest: MiddlewareHandler[] = [
  zValidator('query', z.object({
    status: RequireString(2, 50)
  }))
]

export default GetEmailsRequest