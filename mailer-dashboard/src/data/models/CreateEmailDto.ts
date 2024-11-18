import { EmailAddressDto } from './EmailAddressDto'
import { EmailStatus } from './EmailStatus'

export class CreateEmailDto {
  subject!: string
  body!: string
  status?: EmailStatus.DRAFT
  from!: EmailAddressDto
  to!: EmailAddressDto[]
  cc?: EmailAddressDto[]
  bcc?: EmailAddressDto[]
}
