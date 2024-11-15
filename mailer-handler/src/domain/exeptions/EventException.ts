import Exception from './Exception'

export class EventException extends Exception {
  constructor(message: string = 'Event execution failed') {
    super('EventException', message, 400)
  }
}
