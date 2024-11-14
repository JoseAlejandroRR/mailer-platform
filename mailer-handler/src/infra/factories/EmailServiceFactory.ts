import { IEmailSevice } from '@/domain/IEmailService'
import SESEmailService from '@/infra/providers/aws-ses/SESEmailService'
import SparkPostSevice from '@/infra/providers/SparkPostService/SparkPostSevice'

export class EmailServiceFactory {
  
  static getInstance(name: string): IEmailSevice | null {
    switch (name) {
      case 'AWS-SES':
        return new SESEmailService()

      case 'SparkPost':
        return new SparkPostSevice()

      default:
        console.warn(`No provider found with the name: ${name}`)
        return null
    }
  }
}
