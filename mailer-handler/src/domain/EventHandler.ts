import { IEventBus } from './IEventBus'

export abstract class EventHandler {

  abstract name: string

  constructor(protected eventBus: IEventBus) {
    this.subscribe(eventBus);
  }

  abstract subscribe(eventBus: IEventBus): void;
}
