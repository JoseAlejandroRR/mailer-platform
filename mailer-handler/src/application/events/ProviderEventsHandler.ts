import { EventHandler } from '@/domain/EventHandler'
import { EventType } from '@/domain/EventType'
import { IEventBus } from '@/domain/IEventBus'
import { ProviderIds } from '@/domain/ProviderIds'
import { IProviderRepository } from '@/domain/repositories/IProviderRepository'
import { inject, injectable } from 'tsyringe'

@injectable()
export class EmailProviderEventHandler extends EventHandler {

  public name: string = 'EmailProviderEventHandler'

  constructor(
    @inject(ProviderIds.EventBus) eventBus: IEventBus,
    @inject(ProviderIds.ProviderRepository) protected providerRepository: IProviderRepository,
  ) {
    super(eventBus)
  }

  public subscribe(eventBus: IEventBus): void {
    eventBus.subscribe(
      EventType.Provider.FAILED,
      async (event) => {
        const { provider, error } = event.payload
        console.info(`[${EventType.Provider.FAILED}] Provider max failed: `, provider)

        await this.providerRepository.updateStatus(provider.id, provider.status, error)

      }
    )
  }

}

export default EmailProviderEventHandler
