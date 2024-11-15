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

const { AWS_SQS_EMAIL_URL } = process.env

@injectable()
export class EmailEventHandler extends EventHandler  {

  constructor(
    @inject(ProviderIds.EventBus) eventBus: IEventBus,
    @inject(ProviderIds.QueueService) private queueService: IQueueService,
    @inject(ProviderIds.EmailRepository) protected emailRepository: IEmailRepository,
    @inject(EmailService) protected emailService: EmailService,
    @inject(EmailSenderManager) private manager: EmailSenderManager
  ) {
    super(eventBus)
  }

  protected subscribe(eventBus: IEventBus): void {

    eventBus.subscribe(
      EventType.Email.CREATED,
      async (event: IEvent) => {
        const { email } = event.payload
        console.info(`[${EventType.Email.CREATED}] Email created: `, email)

        this.queueService.publish({
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
            return;
          }

          console.info(`Message in queue: `, data)
        })
      }
    )

    eventBus.subscribe(
      EventType.Email.QUEUED,
      async (event) => {
        const { email } = event.payload
        console.info(`[${EventType.Email.QUEUED}] Email sending: `, email)

        const [err, success] = await this.manager.process(email)

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

        await this.emailRepository.updateStatus(email.id, EmailStatus.SENT)

        console.info(`[${EventType.Email.QUEUED}] Email sent: `, email.id)
    })
  }
}
