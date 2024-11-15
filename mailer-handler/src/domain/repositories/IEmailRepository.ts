import { Email } from '../models/Email'
import { EmailStatus } from '../enum/EmailStatus'
import { IRepository } from './IRepository'

export interface IEmailRepository extends IRepository<Email> {

  updateStatus(id: string, status: EmailStatus): Promise<boolean>

  getEmailsByStatus(status: EmailStatus, order: 'ASC' | 'DESC'): Promise<Email[]>

}