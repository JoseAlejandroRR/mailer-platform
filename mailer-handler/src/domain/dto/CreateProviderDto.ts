import { ProviderStatus } from '../enum/ProviderStatus'

export class CreateProviderDto {
  name!: string
  priority!: number
  status!: ProviderStatus
}