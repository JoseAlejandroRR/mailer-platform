import { IEmailService } from '@/domain/IEmailService'
import { Email } from '@/domain/models/Email'
import Exception from '@/domain/exeptions/Exception'
import { InvalidArgumentException } from '@/domain/exeptions/InvalidArgumentException'
import { ProviderInvokeException } from '@/domain/exeptions/ProviderInvokeException'

class MailerSenderSandbox implements IEmailService {

  public serviceName: string = 'MailerSenderSandbox'

  async sendEmail(email: Email): Promise<boolean> {

    if (email.subject.includes('false')) return false;

    if (email.subject.includes('InvalidArgumentException')) throw new InvalidArgumentException();

    if (email.subject.includes('ProviderInvokeException')) throw new ProviderInvokeException();

    if (email.subject.includes('Exception')) throw new Exception('Unexpected', 'GenericError');

    return true
  }

}

export default MailerSenderSandbox
