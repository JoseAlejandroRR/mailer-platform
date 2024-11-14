import { CreateEmailDto } from '@/domain/dto/CreateEmailDto'
import { Email } from '@/domain/models/Email'
import { IEmailRepository } from '@/domain/EmailRepository'
import { EmailStatus } from '@/domain/enum/EmailStatus'
import { ProviderIds } from '@/domain/ProviderIds'
import { inject, injectable } from 'tsyringe'
import EntityNotFoundException from '@/domain/exeptions/EntityNotFoundException'

interface getEmailByStatusProps {
  status: EmailStatus,
  take?: number,
  skip?: number,
}

@injectable()
class EmailService {

  constructor(
    @inject(ProviderIds.EmailRepository) private emailRepository: IEmailRepository
  ){ }

  async sendEmail(input: CreateEmailDto): Promise<any> {
    const email = Email.create(input)
    const newEmail = await this.emailRepository.create(email)

    return newEmail
  }

  async getById(emailId: string): Promise<Email> {
    const email = await this.emailRepository.getById(emailId)

    if (!email) {
      throw new EntityNotFoundException(Email, emailId)
    }

    return email
  }

  async deleteById(emailId: string): Promise<boolean> {
    const res = await this.emailRepository.delete(emailId)

    return res
  }

  async getEmailByStatus(options: getEmailByStatusProps): Promise<Email[]> {
    const { status } = Object.assign(options, { take: 10, skip: 0 })

    const emails = await this.emailRepository.getEmailsByStatus(status, 'DESC')

    return emails
  }
}

export default EmailService
