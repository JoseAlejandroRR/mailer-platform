import { Hono } from 'hono'
import { inject, injectable } from 'tsyringe'
import { ZodError } from 'zod'
import { HTTPException } from 'hono/http-exception'
import EmailsRouter from './EmailsRouter'
import ProvidersRouter from './ProvidersRouter'
import EntityNotFoundException from '@/domain/exeptions/EntityNotFoundException'

@injectable()
class HTTPGateway {
  constructor(
    @inject(EmailsRouter) private emailsRouter: EmailsRouter,
    @inject(ProvidersRouter) private providersRouter: ProvidersRouter,
  ) {}

  async bindRoutes(server: Hono) {
    const gateway = new Hono()

    server.onError((err, c) => {
      console.log('[Backend Error]:')
      console.log(err)

      if (err instanceof EntityNotFoundException) {
        return c.json({ message: err.message, code: err.code }, 404)
      }

      if (err instanceof ZodError ) {
        console.log('[ZodError]')
        return c.json(err.issues, 400)
      }

      if (err instanceof HTTPException) {
        return c.json({ message: err.message, code: err.name }, err.status)
      }

      // General Exceptions
      return c.json({ message: 'Internal Server Error', code: 'INTERNAL_ERROR' }, 500)
    })

    gateway.route('/emails', this.emailsRouter.routes)
    gateway.route('/providers', this.providersRouter.routes)

    server.route('/api', gateway)
  }
}

export default HTTPGateway
