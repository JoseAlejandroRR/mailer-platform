import { IEventBus } from '@/domain/IEventBus'
import { ProviderIds } from '@/domain/ProviderIds'
import { SQSRecord } from 'aws-lambda'
import { container } from 'tsyringe'

export const handleSQSEvent = async (record: SQSRecord) => {
  const { body } = record
  const event = typeof(body) === 'string' ? JSON.parse(body) : body
  const eventBus: IEventBus = container.resolve(ProviderIds.EventBus)

  eventBus.publish({
    name: event.eventName,
    payload: event.payload,
    timestamp: new Date(),
  })
}
