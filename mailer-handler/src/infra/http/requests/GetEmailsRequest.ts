import { zValidator } from '@hono/zod-validator'
import { MiddlewareHandler } from 'hono'
import { z } from 'zod'
import { RequireEnumValue, RequireString } from '.'
import { EmailStatus } from '@/domain/enum/EmailStatus'


/**
 * @swagger
 * /emails:
 *   get:
 *     summary: Get Emails by Status
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
 *       - name: status
 *         in: query
 *         type: string
 *         example: SENT
 *         required: true
 *       - name: cursorId
 *         in: query
 *         type: string
 *         example: 4bcdb09e-9f6d-4e18-919a-cbabff31e8b3
 *       - name: createdAt
 *         in: query
 *         type: string
 *     responses:
 *       200:
 *         description: Get Emails by Status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/EmailViewModel"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

const GetEmailsRequest: MiddlewareHandler[] = [
  zValidator('query', z.object({
    status: RequireEnumValue(EmailStatus)
  }))
]

export default GetEmailsRequest