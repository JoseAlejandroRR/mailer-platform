import SparkPost from 'sparkpost'
import { IEmailSevice } from '@/domain/IEmailService'
import { Email } from '@/domain/models/Email'
import { ProviderInvokeException } from '@/domain/exeptions/ProviderInvokeException'
import { InvalidArgumentException } from '@/domain/exeptions/InvalidArgumentException'

const { SPARKPOST_KEY } = process.env

class SparkPostSevice implements IEmailSevice {

  private client: SparkPost
  private errorCodes = [400, 422]

  constructor() {
    this.client = new SparkPost(String(SPARKPOST_KEY), {
     // endpoint: 'https://dev.sparkpost.com:443'
    })
  }
  
async sendEmail(email: Email): Promise<boolean> {
    try {
      const result = await this.client.transmissions.send({
        options: {
          //sandbox: true
        },
        content: {
          from: email.from.email,
          subject: email.subject,
          html: email.body
        },
        recipients: [
          ...email.to.map((address) => ({ address: address.email }))
        ]
      })

      return true
    } catch (err) {
      console.log('errorCode: ', err.statusCode)
      console.error('[SparkPostSevice] Error: ', err)

      if (this.errorCodes.includes(err.statusCode)) {
        throw new InvalidArgumentException(err.Code)
      }

      throw new ProviderInvokeException(err)
    }
    return false
  }
  
}

export default SparkPostSevice
