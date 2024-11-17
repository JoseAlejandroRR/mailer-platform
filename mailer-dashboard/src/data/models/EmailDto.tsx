import { EmailAddressDto } from './EmailAddressDto'
import { EmailStatus } from './EmailStatus'

export class EmailDto {
  id!: string
  subject!: string
  body!: string
  status!: EmailStatus
  from!: EmailAddressDto
  to!: EmailAddressDto[]
  cc!: EmailAddressDto[]
  bcc!: EmailAddressDto[]
  createdAt!: Date
  updatedAt!: Date
}
