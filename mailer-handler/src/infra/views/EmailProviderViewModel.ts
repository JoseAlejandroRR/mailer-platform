import ViewModel from './ViewModel'
import { EmailProvider } from '@/domain/models/EmailProvider'

/**
 * A view model for a EmailProvider Model.
 *
 * @swagger
 * components:
 *   schemas:
 *     EmailProviderViewModel:
 *       description: providerProvider Object Structure
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
 *         log:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *           pattern: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w{1}$'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           pattern: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w{1}$'
 */

class EmailProviderViewModel extends ViewModel<EmailProvider> {
  constructor(provider: EmailProvider) {
    const view: Record<string, any> = {
      id: provider.id,
      name: provider.name,
      priority: provider.priority,
      status: provider.status,
      type: provider.type,
      endpointURL: provider.endpointURL,
      log: provider.log,
      createdAt: provider.createdAt.toISOString(),
      updatedAt: provider.updatedAt.toISOString(),
    }

    super(view)
  }
}

export default EmailProviderViewModel
