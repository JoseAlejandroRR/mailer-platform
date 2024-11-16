import { EmailAddressDto } from './EmailAddressDto'
import { EmailStatus } from './EmailStatus'

export class EmailDto {
  id!: number
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
