import { container } from 'tsyringe'
import { IEmailRepository } from '@/domain/repositories/IEmailRepository'
import { ProviderIds } from '@/domain/ProviderIds'
import EmailRepositoryDynamoDB from './repositories/EmailRepositoryDynamoDB'
import { IProviderRepository } from '@/domain/repositories/IProviderRepository'
import ProviderRepositoryDynamoDB from './repositories/EmailProviderRepositoryDynamo'
import { LocalEventBus } from './event-bus/LocalEventBus'
import { IEventBus } from '@/domain/IEventBus'
import { EmailEventHandler } from '@/application/events/EmailEventsHandler'
import SQSProvider from './providers/aws-sqs/SQServiceProvider'
import { IQueueService } from '@/domain/IQueueService'
import { IEmailService } from '@/domain/IEmailService'
import SESEmailService from './providers/aws-ses/SESEmailService'
import SparkPostSevice from './providers/SparkPostService/SparkPostSevice'
import EmailSenderManager from '@/application/EmailSenderManager'
import EmailProviderEventHandler from '@/application/events/ProviderEventsHandler'
import { EventHandler } from '@/domain/EventHandler'
import MailerSenderSandbox from './providers/mailer-sender-sanbox/MailerSenderSandbox'

class ApplicationContext {

  static events = [
    EmailEventHandler,
    EmailProviderEventHandler
  ]

  static initialize(): void {
    container.registerSingleton<IEmailRepository>(ProviderIds.EmailRepository, EmailRepositoryDynamoDB)
    container.registerSingleton<IProviderRepository>(ProviderIds.ProviderRepository, ProviderRepositoryDynamoDB)

    container.registerSingleton<IEventBus>(ProviderIds.EventBus, LocalEventBus)
    container.registerSingleton<IQueueService>(ProviderIds.QueueService, SQSProvider)

    container.registerSingleton<EmailSenderManager>(EmailSenderManager)

    container.register<IEmailService>(ProviderIds.EmailSenderService, { useClass: SESEmailService })
    container.register<IEmailService>(ProviderIds.EmailSenderService, { useClass: SparkPostSevice })
    container.register<IEmailService>(ProviderIds.EmailSenderService, { useClass: MailerSenderSandbox })

    this.registerEvents()
  }

  private static registerEvents(): void {
    ApplicationContext.events.forEach((handler) => {
      container.registerSingleton<EventHandler>(handler.name, handler)
      container.resolve(handler.name)
    })
  }
}

export default ApplicationContext
