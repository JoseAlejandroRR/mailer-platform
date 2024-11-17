import { EmailProviderStatus } from './EmailProviderStatus'

export class CreateEmailProviderDto {
  name!: string
  priority!: number
  status!: EmailProviderStatus
}