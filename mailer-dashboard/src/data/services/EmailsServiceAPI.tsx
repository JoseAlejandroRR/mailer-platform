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

  async getById(id: number): Promise<EmailDto> {
    return this.get<EmailDto>(`/${id}`)
  }

  /*async createOne(input: CreateEmployeeDto): Promise<EmployeeDto> {
    return this.post<EmployeeDto>('/', input)
  }*/

}

export default EmailsServiceAPI
