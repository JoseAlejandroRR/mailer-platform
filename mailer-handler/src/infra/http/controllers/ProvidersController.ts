import { inject, injectable } from 'tsyringe'
import { BaseController } from './BaseController'
import { Context } from 'hono'
import { CreateProviderDto } from '@/domain/dto/CreateProviderDto'
import EmailProviderService from '@/application/EmailProviderService'
import { UpdateProviderDto } from '@/domain/dto/UpdateProviderDto'
import EmailProviderViewModel from '@/infra/views/EmailProviderViewModel'
import ViewModel from '@/infra/views/ViewModel'

@injectable()
class ProvidersController extends BaseController {
  constructor(
    @inject(EmailProviderService) private service: EmailProviderService
  ) {
    super()
  }

  async createOne(ctx: Context) {
    const input: CreateProviderDto = await ctx.req.json()

    const provider = await this.service.createOne(input)

    if (!provider) {
      return ctx.json({ success: false, data: null }, 400)
    }

    return ctx.json(ViewModel.createOne(EmailProviderViewModel, provider), 201)
  }

  async updateOne(ctx: Context) {
    const { providerId } = ctx.req.param()
    const input: UpdateProviderDto = await ctx.req.json()

    const provider = await this.service.updateOne(providerId, input)

    if (!provider) {
      return ctx.json({ success: false, data: null }, 400)
    }

    return ctx.json(ViewModel.createOne(EmailProviderViewModel, provider), 200)
  }

  async getById(ctx: Context) {
    const { providerId } = ctx.req.param()

    const provider = await this.service.getProviderById(providerId)

    return ctx.json(ctx.json(ViewModel.createOne(EmailProviderViewModel, provider)))
  }

  async getAll(ctx: Context) {

    const providers = await this.service.getAll()

    return ctx.json(ViewModel.createMany(EmailProviderViewModel, providers))
  }

  async deleteById(ctx: Context) {
    const { providerId } = ctx.req.param()

    const res = await this.service.deleteById(providerId)

    return ctx.json({ success: res}, res ? 200 : 400)
  }
}

export default ProvidersController
