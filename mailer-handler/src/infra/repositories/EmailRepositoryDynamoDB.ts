import { Email } from '@/domain/models/Email'
import BaseRepositoryDynamoDB from './BaseRepositoryDynamoDB'
import { CursorId, IEmailRepository } from '@/domain/repositories/IEmailRepository'
import { EmailStatus } from '@/domain/enum/EmailStatus'
import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { injectable } from 'tsyringe'

const { EMAILS_TABLE_NAME } = process.env

@injectable()
class EmailRepositoryDynamoDB extends BaseRepositoryDynamoDB<Email>
  implements IEmailRepository {

  constructor() {
    super(Email, String(EMAILS_TABLE_NAME))
  }
  
  async updateStatus(emailId: string, status: EmailStatus): Promise<boolean> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { id: emailId },
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: {
            ':status': status,
            ':updatedAt': new Date().toISOString(),
        },
      }

      await this.dynamoDbClient.send(new UpdateCommand(params))

      return true
    } catch (err) {
      console.log(`[updateStatus]: Error for id: '${emailId}', `, err)
    } finally {
      return false
    }
  }

  async getEmailsByStatus(
    status: EmailStatus,
    order: 'ASC' | 'DESC' = 'DESC',
    limit: number = 20,
    startKey?: { status: EmailStatus; createdAt: string }
  ): Promise<Email[]> {

    try {
      const params = {
        TableName: this.tableName,
        IndexName: 'StatusCreatedAtIndex',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
        },
        ScanIndexForward: order === 'DESC',
        Limit: limit,
        ...(startKey ? { ExclusiveStartKey: { ...startKey } } : {}),
      }

      const result = await this.dynamoDbClient.send(new QueryCommand(params))

      const emails = (result.Items || []).map((item) => Email.fromJSON(item))

      return emails
    } catch (err) {
      console.log('[getEmailsByStatus]: Error:', err)
    }
    return []
  }
    
}

export default EmailRepositoryDynamoDB
