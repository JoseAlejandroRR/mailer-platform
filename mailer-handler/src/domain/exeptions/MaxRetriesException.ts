import Exception from './Exception'

export class MaxRetriesException extends Exception {
  constructor(message: string = 'Event reached the max retries setup') {
    super('MaxRetriesException', message)
  }
}
