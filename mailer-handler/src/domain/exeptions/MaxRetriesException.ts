import Exception from './Exception'

export class MaxRetriesException extends Exception {
  constructor(
    public attempts: number,
    public message: string = 'Event reached the max retries setup',
  ) {
    super('MaxRetriesException', message, attempts)
  }
}
