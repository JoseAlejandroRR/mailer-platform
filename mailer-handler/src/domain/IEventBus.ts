import { IEvent } from './IEvent'

export interface IEventBus {
  publish(event: IEvent): Promise<void>
  subscribe(eventName: string, handler: (event: IEvent) => Promise<void>): void
}
