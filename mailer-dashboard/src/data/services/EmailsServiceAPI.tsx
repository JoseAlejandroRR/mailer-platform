import { CreateEmailDto } from '../models/CreateEmailDto'
import { EmailDto } from '../models/EmailDto'
import { EmailStatus } from '../models/EmailStatus'
import BackendService from './BackendService'

class EmailsServiceAPI extends BackendService {

  constructor() {
    super(import.meta.env.VITE_EMAILS_API)
  }

  async getAll(status: EmailStatus): Promise<EmailDto[]> {
    return this.get<EmailDto[]>('', { params: { status } })
  }

  async getById(id: string): Promise<EmailDto> {
    return this.get<EmailDto>(`/${id}`)
  }

  async sendEmail(input: CreateEmailDto): Promise<EmailDto> {
    return this.post<EmailDto>('', input)
  }

}

export default EmailsServiceAPI
