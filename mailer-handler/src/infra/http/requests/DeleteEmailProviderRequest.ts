import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { RequireUUID } from '.'

/**
 * @swagger
 * /providers/{id}:
 *   delete:
 *     summary: Delete an existing Provider
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
 *         description: Provider delete successfully
 *       404:
 *         description: Not found
 */

const DeleteEmailProviderRequest: MiddlewareHandler[] = [
  zValidator('param', z.object({
    providerId: RequireUUID(),
  }))
]

export default DeleteEmailProviderRequest
