import { injectable } from 'tsyringe'
import { IEvent } from '@/domain/IEvent'
import { IEventBus } from '@/domain/IEventBus'

@injectable()
export class LocalEventBus implements IEventBus {
  private handlers: Map<string, Array<(event: IEvent) => Promise<void>>>
  private pendingEvents: number

  constructor() {
    this.handlers = new Map();
    this.pendingEvents = 0
  }

  async publish(event: IEvent): Promise<void> {
    const handlers = this.handlers.get(event.name) || [];
    this.pendingEvents += handlers.length;

    await Promise.allSettled(
      handlers.map(async (handler) => {
        try {
          await handler(event);
        } finally {
          this.pendingEvents--
        }
      })
    )
  }

  subscribe(eventName: string, handler: (event: IEvent) => Promise<void>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, [])
    }
    this.handlers.get(eventName)?.push(handler)
  }

  hasPendingEvents(): boolean {
    return this.pendingEvents > 0;
  }
}
