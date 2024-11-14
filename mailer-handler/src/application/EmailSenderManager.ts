import { ProviderStatus } from '@/domain/enum/ProviderStatus'
import { IEmailSevice } from '@/domain/IEmailService'
import { Email } from '@/domain/models/Email'
import { ProviderIds } from '@/domain/ProviderIds'
import { EmailServiceFactory } from '@/infra/factories/EmailServiceFactory'
import ProviderRepositoryDynamoDB from '@/infra/repositories/EmailProviderRepositoryDynamo'
import EmailRepositoryDynamoDB from '@/infra/repositories/EmailRepositoryDynamoDB'
import { inject, injectable } from 'tsyringe'
import EmailProviderService from './EmailProviderService'
import { InvalidArgumentException } from '@/domain/exeptions/InvalidArgumentException'
import { ProviderInvokeException } from '@/domain/exeptions/ProviderInvokeException'
import { EmailStatus } from '@/domain/enum/EmailStatus'

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

  async sendEmail(email: Email, provider: SenderProvider): Promise<boolean> {
    try {
      const success = await provider.service.sendEmail(email)
      
      return success
    } catch (err) {
      console.error('[EmailSenderManager.sendEmail] Error sending: ', JSON.stringify(email))

      if (err instanceof InvalidArgumentException) {  
        console.log('InvalidArgumentException check')
        await this.emailRepository.updateStatus(email.id, EmailStatus.FAILED)
      }
      
      if (err instanceof ProviderInvokeException) {
        console.log('ProviderInvokeException check')
        await this.handleFailure(provider)
      }
      
    }
    return false
  }

  async process(email: Email): Promise<void> {
    for (const provider of this.providers) {

      if (!this.checkAvailability(provider)) {
        console.log(`Provider ${provider.name} is currently unavailable.`)
        continue
      }

      console.log(`Attempting to send email with provider ${provider.name}`)
      const success = await this.sendEmail(email, provider)

      if (success) {
        console.log(`Email sent successfully using provider ${provider.name}`)
        provider.failureCount = 0
        await this.emailRepository.updateStatus(email.id, EmailStatus.SENT)

        return
      }
    }

    console.error('All providers failed to send the email')
    await this.emailRepository.updateStatus(email.id, EmailStatus.MAX_TRIED)
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
