import { EmailAddress } from '../value-object/EmailAddress'

export class CreateEmailDto {
  subject!: string
  body!: string
  from?: EmailAddress
  to!: EmailAddress[]
  cc?: EmailAddress[]
  bcc?: EmailAddress[]
}