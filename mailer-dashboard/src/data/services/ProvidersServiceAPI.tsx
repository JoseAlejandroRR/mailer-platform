import BackendService from './BackendService'
import { EmailProviderDto } from '../models/ProviderEmailDto'
import { CreateEmailProviderDto } from '../models/CreateEmailProviderDto'
import { UpdateEmailProviderDto } from '../models/UpdateEmailProviderDto'

class ProvidersServiceAPI extends BackendService {

  constructor() {
    super(import.meta.env.VITE_PROVIDERS_API)
  }

  async getAll(): Promise<EmailProviderDto[]> {
    const providers: EmailProviderDto[] = []
    const data = await this.get<Record<string, any>[]>('')

    data.forEach((item) => {
      const provider = new EmailProviderDto()
      Object.assign(provider, {
        id: item.id,
        name: item.name,
        priority: item.priority,
        status: item.status,
        log: item.log,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })
      providers.push(provider)
    })

    return providers
  }

  async getById(id: string): Promise<EmailProviderDto> {
    return this.get<EmailProviderDto>(`/${id}`)
  }

  async createOne(input: CreateEmailProviderDto): Promise<EmailProviderDto> {
    const data =  await this.post<EmailProviderDto>('', input)

    const provider = new EmailProviderDto()
    Object.assign(provider, {
      id: data.id,
      name: data.name,
      priority: data.priority,
      status: data.status,
      log: data.log,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })

    return provider
  }

  async updateOne(providerId: string, input: UpdateEmailProviderDto): Promise<EmailProviderDto> {
    const data =  await this.put<EmailProviderDto>(providerId, input)

    const provider = new EmailProviderDto()
    Object.assign(provider, {
      id: data.id,
      name: data.name,
      priority: data.priority,
      status: data.status,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })

    return provider
  }

  async deleteById(id: string): Promise<boolean> {
    const data = await this.delete<Record<string, any>>(id)

    return data.success ?? false
  }

}

export default ProvidersServiceAPI
