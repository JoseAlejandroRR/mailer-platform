import ViewModel from './ViewModel'
import { Email } from '@/domain/models/Email'

/**
 * A view model for a EmailProvider Model.
 *
 * @swagger
 * components:
 *   schemas:
 *     EmailProviderViewModel:
 *       description: EmailProvider Object Structure
 *       properties:
 *         id:
 *           type: string
 *           example: a8d56d51-1917-40ca-aa56-38a7acb2321b
 *         name:
 *           type: string
 *           example: AWS-SES
 *         priority:
 *           type: number
 *           example: 1
 *         status:
 *           type: string
 *           enum: [ACTIVE, DISABLED, FAILED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           pattern: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w{1}$'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           pattern: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w{1}$'
 */

class EmailProviderViewModel extends ViewModel<Email> {
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

export default EmailProviderViewModel
