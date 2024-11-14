import { ProviderStatus } from '../enum/ProviderStatus'

export class UpdateProviderDto {
  name?: string
  priority?: number
  status?: ProviderStatus
}