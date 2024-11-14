import Exception from './Exception'

export class InvalidArgumentException extends Exception {
  constructor(message: string = 'Argument set as NULL') {
    super('InvalidArgumentException', message, 400)
  }
}
