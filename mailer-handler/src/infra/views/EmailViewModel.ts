import ViewModel from './ViewModel'
import { Email } from '@/domain/models/Email'

/**
 * A view model for a Email Model.
 *
 * @swagger
 * components:
 *   schemas:
 *     EmailViewModel:
 *       description: Email Object Structure
 *       properties:
 *         id:
 *           type: string
 *           example: a8d56d51-1917-40ca-aa56-38a7acb2321b
 *         subject:
 *           type: string
 *           example: Welcome, User
 *         body:
 *           type: string
 *           example: <h1>Welcome</h1>
 *         provider:
 *           type: string
 *           example: AWS-SES
 *         from:
 *           type: object
 *           $ref: "#/components/schemas/EmailAddressSchema"
 *         to:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/EmailAddressSchema"
 *           required: true
 *         cc:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/EmailAddressSchema"
 *         bcc:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/EmailAddressSchema"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           pattern: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w{1}$'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           pattern: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w{1}$'
 */
class EmailViewModel extends ViewModel<Email> {
  constructor(email: Email) {
    const view: Record<string, any> = {
      id: email.id,
      body: email.body,
      status: email.status,
      subject: email.subject,
      from: { email: email.from.email, name: email.from.name },
      to: email.to.map(addr => ({ email: addr.email, name: addr.name })),
      cc: email.cc.map(addr => ({ email: addr.email, name: addr.name })),
      bcc: email.bcc.map(addr => ({ email: addr.email, name: addr.name })),
      provider: email.provider ?? null,
      createdAt: email.createdAt.toISOString(),
      updatedAt: email.updatedAt.toISOString(),
    }

    super(view)
  }
}

export default EmailViewModel
