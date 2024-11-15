import { zValidator } from '@hono/zod-validator'
import { MiddlewareHandler } from 'hono'
import { z } from 'zod'
import { RequireEnumValue, RequireInteger, RequireString } from '.'
import { ProviderStatus } from '@/domain/enum/ProviderStatus'

/**
 * Request Schema for Register EmailProvider.
 *
 * @swagger
 * components:
 *   schemas:
 *     PostCreateEmailProviderInput:
 *       description: Request Schema for Register EmailProvider.
 *       properties:
 *         name:
 *           type: string
 *           example: AWS-SES
 *           required: true
 *         priority:
 *           type: number
 *           example: 1
 *           required: true
 *         status:
 *           type: string
 *           enum: [ACTIVE, DISABLED, FAILED]
 */

/**
 * @swagger
 * /providers:
 *   post:
 *     summary: Register Provider
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostCreateEmailProviderInput'
 *     responses:
 *       201:
 *         description: Register Provider
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: "#/components/schemas/EmailProviderViewModel"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

const PostCreateProviderRequest: MiddlewareHandler[] = [
  zValidator('json', z.object({
    name: RequireString(2, 20),
    priority: RequireInteger(1, 100),
    status: RequireEnumValue(ProviderStatus)
  }))
]

export default PostCreateProviderRequest