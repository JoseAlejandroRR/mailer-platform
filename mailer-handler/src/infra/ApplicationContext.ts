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

class ApplicationContext {

  static events = [
    EmailEventHandler,
  ]

  static initialize(): void {
    container.registerSingleton<IEmailRepository>(ProviderIds.EmailRepository, EmailRepositoryDynamoDB)
    container.registerSingleton<IProviderRepository>(ProviderIds.ProviderRepository, ProviderRepositoryDynamoDB)

    container.registerSingleton<IEventBus>(ProviderIds.EventBus, LocalEventBus)
    container.registerSingleton<IQueueService>(ProviderIds.QueueService, SQSProvider)

    this.registerEvents()
  }

  private static registerEvents(): void {
    ApplicationContext.events.forEach((handler) => {
      container.resolve(handler)
    })
  }
}

export default ApplicationContext
