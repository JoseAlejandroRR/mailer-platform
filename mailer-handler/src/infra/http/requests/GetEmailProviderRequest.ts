import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { RequireUUID } from '.'

/**
 * @swagger
 * /providers/{id}:
 *   get:
 *     summary: Get an existing Provider
 *     security:
 *       - bearerAuth: []
 *     tags:
 *      - providers
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
 *         description: Provider Entity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EmailProviderViewModel"
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

const GetEmailProviderRequest: MiddlewareHandler[] = [
  zValidator('param', z.object({
    providerId: RequireUUID(),
  }))
]

export default GetEmailProviderRequest
