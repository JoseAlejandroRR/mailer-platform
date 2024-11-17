import Exception from './Exception'

export class ProvidersNotFoundException extends Exception {
  constructor(message: string = 'Provider not found') {
    super('ProvidersNotFoundException', message, 404)
  }
}
