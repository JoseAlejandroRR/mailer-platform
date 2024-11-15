import { IEventBus } from './IEventBus'

export abstract class EventHandler {
  constructor(protected eventBus: IEventBus) {
    this.subscribe(eventBus);
  }

  protected abstract subscribe(eventBus: IEventBus): void;
}
