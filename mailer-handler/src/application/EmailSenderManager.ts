import { ProviderStatus } from '@/domain/enum/ProviderStatus'
import { IEmailSevice } from '@/domain/IEmailService'
import { Email } from '@/domain/models/Email'
import { ProviderIds } from '@/domain/ProviderIds'
import { EmailServiceFactory } from '@/infra/factories/EmailServiceFactory'
import ProviderRepositoryDynamoDB from '@/infra/repositories/EmailProviderRepositoryDynamo'
import EmailRepositoryDynamoDB from '@/infra/repositories/EmailRepositoryDynamoDB'
import { inject, injectable } from 'tsyringe'
import EmailProviderService from './EmailProviderService'
import { ProviderInvokeException } from '@/domain/exeptions/ProviderInvokeException'
import Exception from '@/domain/exeptions/Exception'
import { MaxRetriesException } from '@/domain/exeptions/MaxRetriesException'

const { MAX_RETRIES_SENDER } = process.env

type SenderProvider = {
  id: string
  name: string
  priority: number
  status: ProviderStatus
  failureCount: number
  lastFailureTime: number
  service: IEmailSevice
}

@injectable()
class EmailSenderManager {

  private isInitialized = false

  protected providers: SenderProvider[] = []

  private failureThreshold = 1

  private failureWindow = 60 * 1000

  private maxRetries = Number(MAX_RETRIES_SENDER)
  
  constructor(
    @inject(ProviderIds.ProviderRepository) private providerRepository: ProviderRepositoryDynamoDB,
    @inject(ProviderIds.EmailRepository) private emailRepository: EmailRepositoryDynamoDB,
    @inject(EmailProviderService) private providerService: EmailProviderService,
  ) {
    
  }
  
  async initialize() {
    if (this.isInitialized) return
    const providers = await this.providerRepository.getAll()

    providers.forEach((provider) => {
      const service = EmailServiceFactory.getInstance(provider.name)
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

  async process(email: Email): Promise<[Exception | null, boolean]> {
    let attempts = 0
    for (const provider of this.providers) {

      if (attempts >= this.maxRetries) {
        return [new MaxRetriesException(), false]
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

          return [null, success]
        }

      } catch (err) {
        console.error('[EmailSenderManager.process] Error sending: ', provider.name, JSON.stringify(email))

        if (err instanceof ProviderInvokeException) {
          console.log('ProviderInvokeException check')
          await this.handleFailure(provider);
          continue;
        }

        return [err, false]
      }
    }

    return [new MaxRetriesException(), false]
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
      await this.providerService.updateStatus(provider.id, provider.status)
    }
    
  }
}

export default EmailSenderManager
