import { zValidator } from '@hono/zod-validator'
import { MiddlewareHandler } from 'hono'
import { z } from 'zod'
import { RequireString } from '.'
import { EmailAddressValidator } from './EmailAddressValidator'


const PostCreateEmailRequest: MiddlewareHandler[] = [
  zValidator('json', z.object({
    subject: RequireString(2, 50),
    body: RequireString(0, 2000),
    to: z.array(EmailAddressValidator).min(1),
    from: EmailAddressValidator
  }))
]

export default PostCreateEmailRequest