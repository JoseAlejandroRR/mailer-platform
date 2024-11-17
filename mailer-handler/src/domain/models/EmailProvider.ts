import { v4 } from 'uuid'
import { CreateProviderDto } from '../dto/CreateProviderDto'
import { ProviderType } from '../enum/ProviderType'
import { ProviderStatus } from '../enum/ProviderStatus'

export class EmailProvider implements ISerializable {
  public id: string
  public name: string
  public priority: number
  public status: ProviderStatus
  public type: ProviderType
  public endpointURL?: string
  public log?: string
  public createdAt?: Date
  public updatedAt?: Date

  constructor(data: Record<string, any>) {
    this.id = data.id
    this.name = data.name
    this.priority = data.priority
    this.status = data.status
    this.type = data.type
    this.log = data.log
    this.endpointURL = data.type === ProviderType.EXTERNAL ? data.endpointURL : undefined
    this.createdAt = data.createdAt ?? undefined
    this.updatedAt = data.updatedAt ?? undefined
  }

  static create(data: CreateProviderDto) {
    const provider = new EmailProvider({
      id: v4(),
      name: data.name,
      priority: data.priority,
      status: data.status ?? ProviderStatus.DISABLED,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    
    return provider
  }

  update(data: Partial<EmailProvider>) {
    if (data.name) this.name = data.name
    if (data.priority) this.priority = data.priority
    if (data.status) this.status = data.status
    if (data.type) this.type = data.type
    if (data.endpointURL) this.endpointURL = data.endpointURL
    if (data.log) this.log = data.log

    this.updatedAt = new Date()
  }

  static fromJSON(data: Record<string, any>) {
    const provider = new EmailProvider({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })

    return provider
  }

  toJSON() {
    
    return {
      id: this.id,
      name: this.name,
      priority: this.priority,
      status: this.status,
      type: this.type,
      log: this.log,
      endpointURL: this.endpointURL,
      createdAt: this.createdAt ? this.createdAt.toISOString() : null,
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null
    }
  }
}
