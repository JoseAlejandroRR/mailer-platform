import { IEmailService } from '@/domain/IEmailService'
import { Email } from '@/domain/models/Email'

class MockEmailSenderService implements IEmailService {
  serviceName: string;

  public responses: any[] = []

  public currentAttempt = 0

  constructor(serviceName: string) {
    this.serviceName = serviceName
  }

  setupAttemps(responses: any[]) {
    this.responses = responses
  }

  async sendEmail(email: Email): Promise<boolean> {

    const result = this.responses.shift()

    if (result instanceof Error) {
      throw result
    } 
    
    return result

    /*if (email.subject === 'ReturnFalse') return false;

    if (email.subject === 'InvalidArgumentException') throw new InvalidArgumentException();

    if (email.subject === 'ProviderInvokeException') throw new ProviderInvokeException();

    if (email.subject === 'Exception') throw new Exception('Unexpected', 'GenericError');*/

    return true
  }

}

export default MockEmailSenderService
