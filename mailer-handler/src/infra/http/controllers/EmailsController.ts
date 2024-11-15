import { inject, injectable } from 'tsyringe'
import { BaseController } from './BaseController'
import { Context } from 'hono'
import { CreateEmailDto } from '@/domain/dto/CreateEmailDto'
import EmailService from '@/application/EmailService'
import { EmailStatus } from '@/domain/enum/EmailStatus'
import EmailSenderManager from '@/application/EmailSenderManager'

@injectable()
class EmailsController extends BaseController {
  constructor(
    @inject(EmailService) private service: EmailService,
    @inject(EmailSenderManager) private manager: EmailSenderManager
  ) {
    super()
    this.manager.initialize()
  }

  async sendEmail(ctx: Context) {
    const input: CreateEmailDto = await ctx.req.json()

    const email = await this.service.create(input)
    if (!email) {
      return ctx.json({ success: false, data: null }, 400)
    }

    return ctx.json(email)
  }

  async getById(ctx: Context) {
    const { emailId } = ctx.req.param()

    const email = await this.service.getById(emailId)

    return ctx.json(email)
  }

  async deleteById(ctx: Context) {
    const { emailId } = ctx.req.param()

    const res = await this.service.deleteById(emailId)

    return ctx.json({ success: res }, res ? 200 : 400)
  }

  async getEmailByStatus(ctx: Context) {
    const query = ctx.req.query()

    const emails = await this.service.getEmailByStatus({
      status: query.status as EmailStatus
    })

    return ctx.json(emails)
  }
}

export default EmailsController
