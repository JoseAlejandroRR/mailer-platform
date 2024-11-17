import { injectable } from 'tsyringe'
import { IEvent } from '@/domain/IEvent'
import { IEventBus } from '@/domain/IEventBus'

const { NODE_ENV } = process.env
const isDevelopment = NODE_ENV === 'development'

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

    for (const handler of handlers) {
      try {
          await handler(event);
      } catch(err) {
        console.log(`[EvenBust:${event.name}] Error: `, err)
        if (!isDevelopment) throw err;
      }
    }
    this.pendingEvents--
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
