import { inject, injectable } from 'tsyringe'
import { BaseController } from './BaseController'
import { Context } from 'hono'
import { CreateEmailDto } from '@/domain/dto/CreateEmailDto'
import EmailService from '@/application/EmailService'
import { EmailStatus } from '@/domain/enum/EmailStatus'
import EmailSenderManager from '@/application/EmailSenderManager'
import ViewModel from '@/infra/views/ViewModel'
import EmailViewModel from '@/infra/views/EmailViewModel'
import { CursorId } from '@/domain/repositories/IEmailRepository'

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

    return ctx.json(ViewModel.createOne(EmailViewModel, email), 201)
  }

  async getById(ctx: Context) {
    const { emailId } = ctx.req.param()

    const email = await this.service.getById(emailId)

    return ctx.json(ViewModel.createOne(EmailViewModel, email))
  }

  async deleteById(ctx: Context) {
    const { emailId } = ctx.req.param()

    const res = await this.service.deleteById(emailId)

    return ctx.json({ success: res }, res ? 200 : 400)
  }

  async getEmailByStatus(ctx: Context) {
    const { status, cursorId, createdAt, limit } = ctx.req.query()
    let cursor: CursorId | undefined;

    if (cursorId && createdAt) {
      cursor = { status: status  as EmailStatus, id: cursorId, createdAt}
    }

    const emails = await this.service.getEmailByStatus({
      status: status as EmailStatus,
      take: Number(limit),
      cursorKey: cursor
    })

    return ctx.json(ViewModel.createMany(EmailViewModel, emails))
  }
}

export default EmailsController
