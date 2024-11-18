import { CreateEmailDto } from '../models/CreateEmailDto'
import { EmailDto } from '../models/EmailDto'
import { EmailStatus } from '../models/EmailStatus'
import BackendService from './BackendService'

export interface EmailCursor {
  status: EmailStatus,
  cursorId: string,
  createdAt: Date
}

class EmailsServiceAPI extends BackendService {

  constructor() {
    super(import.meta.env.VITE_EMAILS_API)
  }

  protected buildModel(data: Record<string, any>): EmailDto {
    const email = new EmailDto()

    Object.assign(email, {
      id: data.id,
      subject: data.subject,
      body: data.body,
      status: data.status,
      from: data.from,
      to: data.to,
      cc: data.cc,
      bcc: data.bcc,
      log: data.log,
      provider: data.provider,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })

    return email
  }

  async getAll(status: EmailStatus, limit: number = 10, cursor?: EmailCursor): Promise<EmailDto[]> {
    const data = await this.get<Record<string, any>[]>('', { params: { status, limit, ...(cursor ? { ...cursor }: {}) } })

    return data.map((email) => this.buildModel(email))
  }

  async getById(id: string): Promise<EmailDto> {
    const email = await this.get<EmailDto>(`/${id}`)

    return this.buildModel(email)
  }

  async sendEmail(input: CreateEmailDto): Promise<EmailDto> {
    return this.post<EmailDto>('', input)
  }

}

export default EmailsServiceAPI
