import { EmailProviderStatus } from './EmailProviderStatus'

export class EmailProviderDto {
  id!: string
  name!: string
  priority!: number
  status!: EmailProviderStatus
  createdAt!: Date
  updatedAt!: Date
}
