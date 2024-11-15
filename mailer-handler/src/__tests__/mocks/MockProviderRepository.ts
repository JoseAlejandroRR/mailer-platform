import { IProviderRepository } from '@/domain/repositories/IProviderRepository'
import { EmailProvider } from '@/domain/models/EmailProvider'
import { ProviderStatus } from '@/domain/enum/ProviderStatus'
import MockRepository from './MockRepository'

class MockProviderRepository extends MockRepository<EmailProvider> implements IProviderRepository {
  
  async updateStatus(providerId: string, status: ProviderStatus): Promise<boolean> {
    return true
  }

}

export default MockProviderRepository
