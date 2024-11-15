import { z } from 'zod'
import { RequireEmail, RequireString } from '.'

/**
 * Request Schema for EmailAddress.
 *
 * @swagger
 * components:
 *   schemas:
 *     EmailAddressSchema:
 *       description: Request Schema for Create Employee.
 *       properties:
 *         name:
 *           type: string
 *           example: Jose Realza
 *           required: true
 *         email:
 *           type: string
 *           example: josealejandror28@gmail.com
 *           required: true
 */
export const EmailAddressValidator = z.object({
  name: RequireString(),
  email: RequireEmail(), 
})
