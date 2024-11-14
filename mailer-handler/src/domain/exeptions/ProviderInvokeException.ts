import Exception from './Exception'

export class ProviderInvokeException extends Exception {
  constructor(message: string = 'Provider request failed') {
    super('ProviderInvokeException', message, 400)
  }
}
