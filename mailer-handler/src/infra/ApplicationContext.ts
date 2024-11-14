import { container } from 'tsyringe'
import { IEmailRepository } from '@/domain/EmailRepository'
import { ProviderIds } from '@/domain/ProviderIds'
import EmailRepositoryDynamoDB from './repositories/EmailRepositoryDynamoDB'
import { IProviderRepository } from '@/domain/repositories/IProviderRepository'
import ProviderRepositoryDynamoDB from './repositories/EmailProviderRepositoryDynamo'

class ApplicationContext {

  static initialize(): void {
    container.registerSingleton<IEmailRepository>(ProviderIds.EmailRepository, EmailRepositoryDynamoDB)
    container.registerSingleton<IProviderRepository>(ProviderIds.ProviderRepository, ProviderRepositoryDynamoDB)
  }
}

export default ApplicationContext
