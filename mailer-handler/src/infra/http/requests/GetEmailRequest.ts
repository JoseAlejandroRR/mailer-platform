import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { RequireUUID } from '.'

/**
 * @swagger
 * /emails/{id}:
 *   get:
 *     summary: Get an existing Email
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
 *       - in: path
 *         name: id
 *         type: string
 *         example:  4bcdb09e-9f6d-4e18-919a-cbabff31e8b3
 *         required: true
 *     responses:
 *       200:
 *         description: Email Entity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EmailViewModel"
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

const GetEmailRequest: MiddlewareHandler[] = [
  zValidator('param', z.object({
    emailId: RequireUUID(),
  }))
]

export default GetEmailRequest
