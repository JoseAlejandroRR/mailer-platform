import { v4 } from 'uuid'
import { CreateEmailDto } from '../dto/CreateEmailDto'
import { EmailAddress, EmailAddressProps } from '../value-object/EmailAddress'
import { EmailStatus } from '../enum/EmailStatus'

export class Email implements ISerializable {

  public id: string
  public subject: string
  public body: string
  public from: EmailAddress
  public to: EmailAddress[]
  public cc: EmailAddress[] = []
  public bcc: EmailAddress[] = []
  public status: EmailStatus
  public createdAt: Date
  public updatedAt: Date

  constructor(
    data: Record<string, any>
  ) {
    this.id = data.id
    this.subject = data.subject
    this.body = data.body
    this.status = data.status ?? EmailStatus.PENDING,
    this.from = new EmailAddress(data.from.name, data.from.email)
    this.to = data.to.map((account: EmailAddressProps) => (new EmailAddress(account.name, account.email)))
    this.cc = data.cc.map((account: EmailAddressProps) => (new EmailAddress(account.name, account.email)))
    this.bcc = data.bcc.map((account: EmailAddressProps) => (new EmailAddress(account.name, account.email)))
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date()
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date()
  }

  static create(data: CreateEmailDto) {
    const email = new Email({
      id: v4(),
      subject: data.subject,
      body: data.body,
      status: EmailStatus.QUEUED,
      from: data.from,
      to: data.to,
      cc: data.cc ?? [],
      bcc: data.bcc ?? [],
    })
    
    return email
  }

  updateStatus(status: EmailStatus) {
    this.status = status
    this.updatedAt = new Date()
  }

  static fromJSON(data: Record<string, any>) {
    const email = new Email({
      id: data.id,
      subject: data.subject,
      body: data.body,
      status: data.status,
      from: new EmailAddress(data.from.name, data.from.email),
      to: data.to.map((addr: any) => new EmailAddress(addr.name, addr.email)),
      cc: data.cc.map((addr: any) => new EmailAddress(addr.name, addr.email)),
      bcc: data.bcc.map((addr: any) => new EmailAddress(addr.name, addr.email)),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
    
    return email
  }

  toJSON() {
    return {
      id: this.id,
      body: this.body,
      status: this.status,
      subject: this.subject,
      from: { email: this.from.email, name: this.from.name },
      to: this.to.map(addr => ({ email: addr.email, name: addr.name })),
      cc: this.cc.map(addr => ({ email: addr.email, name: addr.name })),
      bcc: this.bcc.map(addr => ({ email: addr.email, name: addr.name })),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
