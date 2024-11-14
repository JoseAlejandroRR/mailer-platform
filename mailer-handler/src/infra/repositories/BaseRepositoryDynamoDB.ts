import { IRepository } from '@/domain/repositories/IRepository'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, DeleteCommand, ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb'


class BaseRepositoryDynamoDB<T extends ISerializable> implements IRepository<T> {

  protected tableName: string

  protected dynamoDbClient: DynamoDBDocumentClient

  private EntityClass: ISerializableConstructor<T>

  constructor(EntityClass: ISerializableConstructor<T>, tableName: string) {
    this.EntityClass = EntityClass
    this.tableName = tableName
    this.dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))
  }

  async create(item: T): Promise<T | null> {
    try {
      await this.dynamoDbClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: item.toJSON()
        })
      )

      return item
    } catch (err) {
      console.log('[BaseRepositoryDynamoDB.create] Error : ', err)
    }

    return null
  }

  async update(item: T): Promise<T | null> {
    try {
      const itemData = item.toJSON()
  
      const { id, ...otherAttributes } = itemData
  
      const expressionAttributeNames: Record<string, string> = {}
      const expressionAttributeValues: Record<string, any> = {}
      const updateExpressions: string[] = []
  
      for (const [key, value] of Object.entries(otherAttributes)) {
        if (value === undefined) continue;

        const attributeName = `#${key}`
        const attributeValue = `:${key}`

        expressionAttributeNames[attributeName] = key
        expressionAttributeValues[attributeValue] = value instanceof Date ? value.toISOString() : value

        updateExpressions.push(`${attributeName} = ${attributeValue}`)
      }

      const updateExpression = `SET ${updateExpressions.join(', ')}`

      const params = {
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
      }

      await this.dynamoDbClient.send(new UpdateCommand(params))
  
      return item
    } catch (err) {
      console.log('[BaseRepositoryDynamoDB.update] Error : ', err)
    }

    return null
  }

  async delete(id: string): Promise<boolean> {
    try {
     await this.dynamoDbClient.send(
       new DeleteCommand({
         TableName: this.tableName,
         Key: { id }
       })
     )
 
     return true
    } catch (err) {
     console.log('[BaseRepositoryDynamoDB.delete] Error : ', err)
    }

    return false
  }

  async getById(id: string): Promise<T | null> {
    try {
      const result = await this.dynamoDbClient.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { id }
        })
      )

      if (result.Item) {
        return this.EntityClass.fromJSON(result.Item)
      }

    } catch (err) {
      console.log('[BaseRepositoryDynamoDB.getById] Error : ', err)
    }

    return null
  }

  async getAll(): Promise<T[]> {
    try {
      const result = await this.dynamoDbClient.send(
        new ScanCommand({
          TableName: this.tableName
        })
      )

      return (result.Items || []).map(item => this.EntityClass.fromJSON(item))

    } catch (err) {
      console.log('[ProviderRepositoryDynamoDB.getAll] Error : ', err)
    }

    return []
  }

}

export default BaseRepositoryDynamoDB
