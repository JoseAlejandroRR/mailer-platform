import { CreateEmailDto } from '@/domain/dto/CreateEmailDto'
import { Email } from '@/domain/models/Email'
import { CursorId, IEmailRepository } from '@/domain/repositories/IEmailRepository'
import { EmailStatus } from '@/domain/enum/EmailStatus'
import { ProviderIds } from '@/domain/ProviderIds'
import { inject, injectable } from 'tsyringe'
import EntityNotFoundException from '@/domain/exeptions/EntityNotFoundException'
import { IEventBus } from '@/domain/IEventBus'
import { EventType } from '@/domain/EventType'

interface getEmailByStatusProps {
  status: EmailStatus,
  take?: number,
  skip?: number,
  cursorKey?: CursorId,
  order?: 'ASC' | 'DESC',
}

@injectable()
class EmailService {

  constructor(
    @inject(ProviderIds.EmailRepository) private emailRepository: IEmailRepository,
    @inject(ProviderIds.EventBus) private eventBus: IEventBus
  ){ }

  async create(input: CreateEmailDto): Promise<any> {
    const email = Email.create(input)
    const newEmail = await this.emailRepository.create(email)

    this.eventBus.publish({
      name: EventType.Email.CREATED,
      payload: {
        email: newEmail
      },
      timestamp: new Date()
    })

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
    const { status } = Object.assign({ take: 20, skip: 0, order: 'DESC' }, options)

    const emails = await this.emailRepository.getEmailsByStatus(
      status, options.order!, options.take, options.cursorKey
    )

    return emails
  }
}

export default EmailService
