import MockRepository from './MockRepository'
import { Email } from '@/domain/models/Email'
import { IEmailRepository } from '@/domain/repositories/IEmailRepository'
import { EmailStatus } from '@/domain/enum/EmailStatus'

class MockEmailRepository extends MockRepository<Email> implements IEmailRepository {

  async updateStatus(id: string, status: EmailStatus): Promise<boolean> {
    return true
  }

  async getEmailsByStatus(status: EmailStatus, order: 'ASC' | 'DESC'): Promise<Email[]> {
    return []
  }

}

export default MockEmailRepository
