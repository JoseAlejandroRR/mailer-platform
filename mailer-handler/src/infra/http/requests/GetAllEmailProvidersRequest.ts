import { MiddlewareHandler } from 'hono'

/**
 * @swagger
 * /providers:
 *   get:
 *     summary: Get All Providers
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
 *     responses:
 *       200:
 *         description: Get all Providers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/EmailProviderViewModel"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

const GetAllEmailProvidersRequest: MiddlewareHandler[] = [
  
]

export default GetAllEmailProvidersRequest