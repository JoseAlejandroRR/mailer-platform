import { EmailAddressDto } from './EmailAddressDto'

export class CreateEmailDto {
  subject!: string
  body!: string
  from!: EmailAddressDto
  to!: EmailAddressDto[]
  cc?: EmailAddressDto[]
  bcc?: EmailAddressDto[]
}
