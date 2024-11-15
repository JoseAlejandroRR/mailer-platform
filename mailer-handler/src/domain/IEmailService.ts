import { Email } from './models/Email'

export interface IEmailService {

  serviceName: string

  sendEmail(email: Email): Promise<boolean>
  
}