import { zValidator } from '@hono/zod-validator'
import { MiddlewareHandler } from 'hono'
import { z } from 'zod'
import { RequireInteger, RequireString } from '.'

const PostCreateProviderRequest: MiddlewareHandler[] = [
  zValidator('json', z.object({
    name: RequireString(2, 20),
    priority: RequireInteger(1, 100),
    status: RequireString(1,10),
  }))
]

export default PostCreateProviderRequest