import { Email } from '@/domain/models/Email';
import BaseRepositoryDynamoDB from './BaseRepositoryDynamoDB'
import { IEmailRepository } from '@/domain/repositories/EmailRepository';
import { EmailStatus } from '@/domain/enum/EmailStatus';
import { EmailAddress } from '@/domain/value-object/EmailAddress';
import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const { EMAILS_TABLE_NAME } = process.env

class EmailRepositoryDynamoDB extends BaseRepositoryDynamoDB<Email>
  implements IEmailRepository {

  constructor() {
    super(Email, String(EMAILS_TABLE_NAME))
  }
  
  async updateStatus(emailId: string, status: EmailStatus): Promise<boolean> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { emailId },
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
      console.log('[updateStatus]: Error:', err)
    } finally {
      return false
    }
  }
  
  async getEmailsByStatus(
    status: EmailStatus,
    order: 'ASC' | 'DESC' = 'ASC',
    limit: number = 20,
    startKey?: string
  ): Promise<Email[]> {
    try {
      const params = {
        TableName: this.tableName,
        IndexName: 'StatusCreatedAtIndex', // Nombre del índice secundario
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':status': status,
        },
        ScanIndexForward: order === 'ASC', // true para ASC, false para DESC
        Limit: limit,
        ...(startKey ? { ExclusiveStartKey: { id: startKey } } : {} ),
      }
      const result = await this.dynamoDbClient.send(new QueryCommand(params))
      console.log("REUSLTS: ", result)

      const emails = (result.Items || []).map((item) => Email.fromJSON(item))
      console.log(emails)
    return emails
    } catch(err) {
      console.log('[getEmailsByStatus]: Error:', err)
    }
    return []
  }
    
}

export default EmailRepositoryDynamoDB
