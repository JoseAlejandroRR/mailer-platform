import { zValidator } from '@hono/zod-validator'
import { MiddlewareHandler } from 'hono'
import { z } from 'zod'
import { OptionalInteger, OptionalString, RequireEnumValue } from '.'
import { ProviderStatus } from '@/domain/enum/ProviderStatus'

/**
 * Request Schema for Updating Provider.
 *
 * @swagger
 * components:
 *   schemas:
 *     PutCreateEmailProviderInput:
 *       description: Request Schema for Update a Provider.
 *       properties:
 *         name:
 *           type: string
 *           example: AWS-SES
 *         priority:
 *           type: number
 *           example: 1
 *         status:
 *           type: string
 *           enum: [ACTIVE, DISABLED, FAILED]
 */

/**
 * @swagger
 * /providers/{id}:
 *   put:
 *     summary: Update Provider
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PutCreateEmailProviderInput'
 *     responses:
 *       200:
 *         description: Update EmailProvider
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: "#/components/schemas/EmailProviderViewModel"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 */

const PutUpdateProviderRequest: MiddlewareHandler[] = [
  zValidator('json', z.object({
    name: OptionalString(2, 20),
    priority: OptionalInteger(1, 100),
    status: RequireEnumValue(ProviderStatus)
  }))
]

export default PutUpdateProviderRequest