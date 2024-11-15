import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { IEmailService } from '@/domain/IEmailService'
import { Email } from '@/domain/models/Email'
import { InvalidArgumentException } from '@/domain/exeptions/InvalidArgumentException'
import { ProviderInvokeException } from '@/domain/exeptions/ProviderInvokeException'

const { AWS_REGION } = process.env

interface BuildEmailCommandProps {
  subject: string
  content: string
  toAddress: string[]
  fromAddress: string
  ccAddress?: string[]
}

class SESEmailService implements IEmailService {

  serviceName: string = 'AWS-SES'

  private sesClient: SESClient

  private sesErrors = ['InvalidParameterValue1', 'InvalidQueryParameter', 'ValidationError']

  constructor() {
    this.sesClient = new SESClient({ region: AWS_REGION })
  }

  private buildEmailCommand(options: BuildEmailCommandProps): SendEmailCommand {
    const { subject, content, toAddress, ccAddress, fromAddress } = options
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
          ...(ccAddress ?? [])
        ],
        ToAddresses: [
          ...toAddress,
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: 'UTF-8',
            Data: content,
          },
          /*Text: {
            Charset: 'UTF-8',
            Data: 'TEXT_FORMAT_BODY',
          },*/
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
      ConfigurationSetName: 'tracking-emails'
    });
  }

  async sendEmail(email: Email): Promise<boolean> {

    try {
      const emailCommand = this.buildEmailCommand({
        subject: email.subject,
        content: email.body,
        toAddress: email.to.map((item) => item.email),
        ccAddress: email.cc.map((item) => item.email),
        fromAddress: email.from.email,
      })

      await this.sesClient.send(emailCommand)
      console.log('[SESEmailService] Email sent: ', email.id)
      return true
    } catch (err) {
      console.error('[SESEmailService] Error: ', err)

      if (this.sesErrors.includes(err.Code)) {
        throw new InvalidArgumentException(err.Code)
      }

      throw new ProviderInvokeException(err.Code)
    }
  }
}

export default SESEmailService
