import { EmailProviderStatus } from './EmailProviderStatus'

export class UpdateEmailProviderDto {
  name!: string
  priority!: number
  status!: EmailProviderStatus
}