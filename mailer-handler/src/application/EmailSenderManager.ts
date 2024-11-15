import { inject, injectable, injectAll } from 'tsyringe'
import { ProviderStatus } from '@/domain/enum/ProviderStatus'
import { IEmailService } from '@/domain/IEmailService'
import { Email } from '@/domain/models/Email'
import { ProviderIds } from '@/domain/ProviderIds'
import { ProviderInvokeException } from '@/domain/exeptions/ProviderInvokeException'
import Exception from '@/domain/exeptions/Exception'
import { MaxRetriesException } from '@/domain/exeptions/MaxRetriesException'
import { IProviderRepository } from '@/domain/repositories/IProviderRepository'
import { IEmailRepository } from '@/domain/repositories/IEmailRepository'
import { IEventBus } from '@/domain/IEventBus'
import { EventType } from '@/domain/EventType'

const { MAX_ATTEMPT_FAILS_PROVIDER, MAX_RETRIES_SENDER } = process.env

type SenderProvider = {
  id: string
  name: string
  priority: number
  status: ProviderStatus
  failureCount: number
  lastFailureTime: number
  service: IEmailService
}

type EmailSendResult = [Exception | null, boolean, number, string?]

@injectable()
class EmailSenderManager {

  private isInitialized = false

  protected providers: SenderProvider[] = []

  private failureThreshold = Number(MAX_ATTEMPT_FAILS_PROVIDER)

  private failureWindow = 60 * 1000

  private maxRetries = Number(MAX_RETRIES_SENDER)
  
  constructor(
    @inject(ProviderIds.EventBus) private eventBus: IEventBus,
    @inject(ProviderIds.ProviderRepository) private providerRepository: IProviderRepository,
    @inject(ProviderIds.EmailRepository) private emailRepository: IEmailRepository,
    @injectAll(ProviderIds.EmailSenderService) private senderProviders: IEmailService[],
  ) { }
  
  async initialize() {
    if (this.isInitialized) return
    const providers = await this.providerRepository.getAll()

    providers.forEach((provider) => {
      const service = this.senderProviders.find((sender) => sender.serviceName === provider.name)

      if (!service) return

      this.providers.push({
        id: provider.id,
        name: provider.name,
        priority: provider.priority,
        status: provider.status,
        failureCount: 0,
        lastFailureTime: 0,
        service,
      })
    })

    this.providers.sort((a, b) => a.priority - b.priority)
    this.isInitialized = true
  }

  async process(email: Email): Promise<EmailSendResult> {
    let attempts = 0
    for (const provider of this.providers) {

      if (attempts >= this.maxRetries) {
        return [new MaxRetriesException(attempts), false, attempts]
      }

      if (!this.checkAvailability(provider)) {
        console.log(`Provider ${provider.name} is currently unavailable.`)
        continue
      }

      console.log(`Attempting to send email with provider ${provider.name}`)

      try {
        attempts++
        const success = await provider.service.sendEmail(email)

        if (success) {
          console.log(`Email sent successfully using provider ${provider.name}`)
          provider.failureCount = provider.failureCount > 0 ?  provider.failureCount - 1 : 0

          return [null, success, attempts, provider.name]
        }

      } catch (err) {
        console.error('[EmailSenderManager.process] Error sending: ', provider.name, JSON.stringify(email))

        if (err instanceof ProviderInvokeException) {
          console.log('ProviderInvokeException check')
          await this.handleFailure(provider);
          continue;
        }

        return [err, false, attempts, provider.name]
      }
    }

    return [new MaxRetriesException(attempts), false, attempts]
  }

  private checkAvailability(provider: SenderProvider): boolean {

    const now = Date.now()
    if (now - provider.lastFailureTime > this.failureWindow) {
      provider.failureCount = 0
    }

    return provider.status === ProviderStatus.ACTIVE
  }

  private async handleFailure(provider: SenderProvider) {
    provider.failureCount++
    provider.lastFailureTime = Date.now()

    if (provider.failureCount >= this.failureThreshold) {
      provider.status = ProviderStatus.FAILED
      console.warn(`Provider ${provider.name} marked as unavailable due to repeated failures.`)

      this.eventBus.publish({
        name: EventType.Provider.FAILED,
        payload: { provider },
        timestamp: new Date()
      })
    }
    
  }

  public setup(options: { maxTries?: number, failureThreshold?: number }) {
    if (options.maxTries) this.maxRetries = options.maxTries;
    if (options.failureThreshold) this.failureThreshold = options.failureThreshold;
  }
}

export default EmailSenderManager
