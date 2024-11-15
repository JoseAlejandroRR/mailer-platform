import { IEventBus } from '@/domain/IEventBus'
import { IEvent } from '@/domain/IEvent'

export class MockEventBus implements IEventBus {
  private events: { [key: string]: ((event: IEvent) => Promise<void>)[] } = {}

  async publish(event: IEvent): Promise<void> {
    const handlers = this.events[event.name];
    if (handlers) {
      for (const handler of handlers) {
        await handler(event)
      }
    }
  }

  subscribe(eventName: string, handler: (event: IEvent) => Promise<void>): void {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(handler)
  }

  clearSubscriptions(): void {
    this.events = {}
  }

  getSubscribedEvents(): string[] {
    return Object.keys(this.events)
  }
}
