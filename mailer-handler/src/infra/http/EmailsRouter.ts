import { inject, injectable } from 'tsyringe'
import { GatewayRouter } from './GatewayRouter'
import EmailsController from './controllers/EmailsController'
import PostCreateEmailRequest from './requests/PostCreateEmailRequest'
import GetEmailsRequest from './requests/GetEmailsRequest'

@injectable()
class EmailsRouter extends GatewayRouter {
  
  constructor(
    @inject(EmailsController) protected controller: EmailsController
  ) {
    super()
    this.setup()
  }

  setup(): void {

    this.routes.delete('/:emailId',
      this.controller.deleteById.bind(this.controller)
    )

    this.routes.get('/:emailId',
      this.controller.getById.bind(this.controller)
    )

    this.routes.post('/',
      ...PostCreateEmailRequest,
      this.controller.sendEmail.bind(this.controller)
    )

    this.routes.get('/',
      ...GetEmailsRequest,
      this.controller.getEmailByStatus.bind(this.controller)
    )
  }
}

export default EmailsRouter
