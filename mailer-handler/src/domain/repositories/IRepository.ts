export interface IRepository<T extends ISerializable> {
  
  create(item: T): Promise<T | null>

  update(item: T): Promise<T | null>

  delete(providerId: string): Promise<boolean>

  getById(providerId: string): Promise<T | null>

  getAll(): Promise<T[]>

}