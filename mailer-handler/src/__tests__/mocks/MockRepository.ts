import { IRepository } from '@/domain/repositories/IRepository'
import { v4 as uuidv4 } from 'uuid'

class MockRepository<T extends ISerializable>
  implements IRepository<T> {

  private items: T[] = []

  constructor(items?: T[]) {
    this.items = items ?? []
  }

  async create(entity: T): Promise<T> {

    const now = new Date()

    Object.assign(entity, {
        id: uuidv4(), 
        createdAt: now, 
        updatedAt: now,
    })

    this.items.push(entity)

    return entity
  }

  async update(entity: T): Promise<T> {
    const index = this.items.findIndex(item => (item as any).id === (entity as any).id)
    if (index !== -1) {
      const now = new Date()
      const updatedEntity = { 
        ...entity, 
        updatedAt: now 
      } as T

      this.items[index] = updatedEntity

      return updatedEntity
    }
    return entity
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex(item => item.id === id)
    if (index !== -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }

  async getById(id: string): Promise<T | null> {
    const entity = this.items.find(item => item.id === id)

    return entity ?? null
  }

  async getAll(): Promise<T[]> {
    return this.items
  }

}


export default MockRepository
