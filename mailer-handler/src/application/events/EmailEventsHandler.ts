import { EventHandler } from '@/domain/EventHandler'
import { IEventBus } from '@/domain/IEventBus'
import { ProviderIds } from '@/domain/ProviderIds'
import { IEmailRepository } from '@/domain/repositories/IEmailRepository'
import { inject, injectable } from 'tsyringe'
import EmailService from '../EmailService'
import { EventType } from '@/domain/EventType'
import { IEvent } from '@/domain/IEvent'
import { IQueueService } from '@/domain/IQueueService'
import EmailSenderManager from '../EmailSenderManager'
import { EmailStatus } from '@/domain/enum/EmailStatus'
import { InvalidArgumentException } from '@/domain/exeptions/InvalidArgumentException'
import { MaxRetriesException } from '@/domain/exeptions/MaxRetriesException'
import { Email } from '@/domain/models/Email'

const { AWS_SQS_EMAIL_URL } = process.env

@injectable()
export class EmailEventHandler extends EventHandler  {

  public name: string = 'EmailEventHandler'

  constructor(
    @inject(ProviderIds.EventBus) eventBus: IEventBus,
    @inject(ProviderIds.QueueService) private queueService: IQueueService,
    @inject(ProviderIds.EmailRepository) protected emailRepository: IEmailRepository,
    @inject(EmailService) protected emailService: EmailService,
    @inject(EmailSenderManager) private manager: EmailSenderManager
  ) {
    super(eventBus)
  }

  public subscribe(eventBus: IEventBus): void {

    eventBus.subscribe(
      EventType.Email.CREATED,
      async (event: IEvent) => {
        const { email } = event.payload
        console.info(`[${EventType.Email.CREATED}] Email created: `, email)

        await this.queueService.publish({
          url: String(AWS_SQS_EMAIL_URL)
        }, {
          data: {
            payload: {
              email
            },
            eventName: EventType.Email.QUEUED,
          },
        }, async (err, data) => {
          if (err) {
            console.log('Message can`t be queued');
            console.log(err)
            return;
          }

          console.info(`Message in queue: `, data.MessageId)
        })
      }
    )

    eventBus.subscribe(
      EventType.Email.QUEUED,
      async (event) => {
        const { email } = event.payload
        console.info(`[${EventType.Email.QUEUED}] Email sending: `, email.id)

        const [err, success, attemps, provider] = await this.manager.process(email)

        if (err) {
          if (err instanceof InvalidArgumentException) {  
            await this.emailRepository.updateStatus(email.id, EmailStatus.FAILED);
            return
          }

          if (err instanceof MaxRetriesException) {
            await this.emailRepository.updateStatus(email.id, EmailStatus.MAX_TRIED);
            return
          }

          console.log('[EventException] Unexpected: ', err)
        }

        eventBus.publish({
          name: EventType.Email.SENT,
          payload: { email, provider },
          timestamp: new Date()
        })

        await this.emailRepository.updateStatus(email.id, EmailStatus.SENT)

        console.info(`[${EventType.Email.QUEUED}] Email processed: `, email.id)
    })

    eventBus.subscribe(
      EventType.Email.SENT,
      async (event) => {
        const { email: emailData, provider } = event.payload
        console.info(`[${EventType.Email.SENT}] Email Sent: `, emailData.id)
        const email = await this.emailRepository.getById(emailData.id)

        if (!email) return;

        email.markAsSent(provider)

        await this.emailRepository.update(email)

        console.log(`[${EventType.Email.SENT}] Email marked as Sent`, email.id)
    })
  }
}
