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

  async updateStatus(providerId: string, status: ProviderStatus): Promise<boolean> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { id: providerId },
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':updatedAt': new Date().toISOString()
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
/*
export class ProviderRepositoryDynamoDB implements IProviderRepository {
  private tableName: string = String(PROVIDERS_TABLE_NAME)
  private dynamoDbClient: DynamoDBDocumentClient

  constructor() {
    this.dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
  }

  private buildEntity(item: Record<string, any>): EmailProvider {
    const provider = new EmailProvider({
      id: item.id,
      name: item.name,
      priority: item.priority,
      status: item.status,
      type: item.type,
      endpointURL: item.endpointURL,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    })

    return provider
  }

  async create(provider: EmailProvider): Promise<boolean> {
    const providerData = {
      providerId: uuidv4(),
      name: provider.name,
      priority: provider.priority,
      status: provider.status,
      type: provider.type,
      endpointURL: provider.type === ProviderType.EXTERNAL ? provider.endpointURL : undefined,
      createdAt: provider.createdAt ? new Date(provider.createdAt) : new Date(),
      updatedAt: provider.updatedAt ? new Date(provider.updatedAt) : new Date()
    }

   try {
    await this.dynamoDbClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: provider.toJSON()
      })
    )

    return true
   } catch (err) {
    console.log('[ProviderRepositoryDynamoDB.create] Error : ', err)
   }

   return false
  }

  async update(provider: EmailProvider): Promise<boolean> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { id: provider.id },
        UpdateExpression: 'SET #name = :name, priority = :priority, #status = :status, #type = :type, endpointURL = :endpointURL, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#type': 'type',
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':name': provider.name,
          ':priority': provider.priority,
          ':status': provider.status,
          ':type': provider.type ?? ProviderType.INTERNAL,
          ':endpointURL': provider.type === ProviderType.EXTERNAL ? provider.endpointURL : null,
          ':updatedAt': provider.updatedAt ? provider.updatedAt.toISOString() : null
        }
      }
  
      await this.dynamoDbClient.send(new UpdateCommand(params))

      return true
    } catch (err) {
      console.log('[ProviderRepositoryDynamoDB.update] Error : ', err)
    }

    return false
  }

  async delete(providerId: string): Promise<boolean> {
   try {
    await this.dynamoDbClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { id: providerId }
      })
    )

    return true
   } catch (err) {
    console.log('[ProviderRepositoryDynamoDB.delete] Error : ', err)
   }

   return false
  }

  async getById(providerId: string): Promise<EmailProvider|null> {
    try {
      const result = await this.dynamoDbClient.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { id: providerId }
        })
      )
  
      if (result.Item) {
        return this.buildEntity(result.Item)
      }

    } catch (err) {
      console.log('[ProviderRepositoryDynamoDB.getById] Error : ', err)
    }

    return null
  }

  async getAll(): Promise<EmailProvider[]> {
    try {
      const result = await this.dynamoDbClient.send(
        new ScanCommand({
          TableName: this.tableName
        })
      )
  
      return (result.Items || []).map(item => this.buildEntity(item))

    } catch (err) {
      console.log('[ProviderRepositoryDynamoDB.getAll] Error : ', err)
    }

    return []
  }

  async updateStatus(providerId: string, status: ProviderStatus): Promise<boolean> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { id: providerId },
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':updatedAt': new Date().toISOString()
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
*/

export default ProviderRepositoryDynamoDB
