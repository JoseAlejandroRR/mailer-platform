import { ProviderStatus } from '@/domain/enum/ProviderStatus'
import { EmailProvider } from '@/domain/models/EmailProvider'
import { IProviderRepository } from '@/domain/repositories/IProviderRepository'
import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import BaseRepositoryDynamoDB from './BaseRepositoryDynamoDB'

const { PROVIDERS_TABLE_NAME } = process.env

class ProviderRepositoryDynamoDB extends BaseRepositoryDynamoDB<EmailProvider>
  implements IProviderRepository {

  constructor() {
    super(EmailProvider, String(PROVIDERS_TABLE_NAME))
  }

  async updateStatus(providerId: string, status: ProviderStatus, log: string = ''): Promise<boolean> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { id: providerId },
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt, #log = :log',
        ExpressionAttributeNames: {
          '#status': 'status',
          '#log': 'log',
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':updatedAt': new Date().toISOString(),
          ':log': log,
        }
      }
  
      await this.dynamoDbClient.send(new UpdateCommand(params))

      return true
    } catch (err) {
      console.log('[ProviderRepositoryDynamoDB.update] Error : ', err)
    }

    return false
  }
    
}

export default ProviderRepositoryDynamoDB
