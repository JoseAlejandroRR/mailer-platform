
import { ProviderStatus } from '../enum/ProviderStatus'
import { EmailProvider } from '../models/EmailProvider'
import { IRepository } from './IRepository'

export interface IProviderRepository extends IRepository<EmailProvider> {

  updateStatus(providerId: string, status: ProviderStatus): Promise<boolean>

}
