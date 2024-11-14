import { CreateProviderDto } from '@/domain/dto/CreateProviderDto'
import { UpdateProviderDto } from '@/domain/dto/UpdateProviderDto'
import { ProviderStatus } from '@/domain/enum/ProviderStatus'
import EntityNotFoundException from '@/domain/exeptions/EntityNotFoundException'
import { EmailProvider } from '@/domain/models/EmailProvider'
import { ProviderIds } from '@/domain/ProviderIds'
import { IProviderRepository } from '@/domain/repositories/IProviderRepository'
import { inject, injectable } from 'tsyringe'

@injectable()
class EmailProviderService {

  constructor(
    @inject(ProviderIds.ProviderRepository) private providersRepository: IProviderRepository
  ){ }

  async createOne(input: CreateProviderDto): Promise<EmailProvider> {
    const provider = EmailProvider.create(input)

    await this.providersRepository.create(provider)

    return provider
  }

  async updateOne(providerId: string, input: UpdateProviderDto): Promise<EmailProvider> {
    const provider = await this.getProviderById(providerId)

    provider.update(input)

    await this.providersRepository.update(provider)

    return provider
  }

  async getProviderById(providerId: string): Promise<EmailProvider> {
    const provider = await this.providersRepository.getById(providerId)

    if (!provider) {
      throw new EntityNotFoundException(EmailProvider, providerId)
    }

    return provider
  }

  async getAll(): Promise<EmailProvider[]> {
    const providers = await this.providersRepository.getAll()

    return providers
  }

  async deleteById(providerId: string): Promise<boolean> {
    const res = await this.providersRepository.delete(providerId)

    return res
  }

  async updateStatus(providerId: string, status: ProviderStatus): Promise<EmailProvider> {
    const provider = await this.getProviderById(providerId)

    await this.providersRepository.updateStatus(providerId, status)

    return provider
  }
}

export default EmailProviderService
