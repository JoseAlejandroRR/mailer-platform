import { zValidator } from '@hono/zod-validator'
import { MiddlewareHandler } from 'hono'
import { z } from 'zod'
import { RequireString } from '.'
import { EmailAddressValidator } from './EmailAddressValidator'

/**
 * Request Schema for Create Email.
 *
 * @swagger
 * components:
 *   schemas:
 *     PostCreateEmailInput:
 *       description: Request Schema for Create Email.
 *       properties:
 *         subject:
 *           type: string
 *           example: Hello, user
 *           required: true
 *         body:
 *           type: string
 *           example: <h1>Welcome!</h1>
 *           required: true
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
 */

/**
 * @swagger
 * /emails:
 *   post:
 *     summary: Create Email
 *     security:
 *       - bearerAuth: []
 *     tags:
 *      - emails
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         example: Bearer xxxxx.yyyyy.zzzzz
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostCreateEmailInput'
 *     responses:
 *       201:
 *         description: Create Email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: "#/components/schemas/EmailViewModel"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

const PostCreateEmailRequest: MiddlewareHandler[] = [
  zValidator('json', z.object({
    subject: RequireString(2, 50),
    body: RequireString(0, 2000),
    to: z.array(EmailAddressValidator).min(1),
    cc: z.array(EmailAddressValidator),
    bcc: z.array(EmailAddressValidator).min(1),
    from: EmailAddressValidator
  }))
]

export default PostCreateEmailRequest