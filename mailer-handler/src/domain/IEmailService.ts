import { Email } from './models/Email'

export interface IEmailSevice {

  sendEmail(email: Email): Promise<boolean>
  
}