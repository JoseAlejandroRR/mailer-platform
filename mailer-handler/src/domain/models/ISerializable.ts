interface ISerializable {
  id: string | number
  toJSON(): Record<string, any>
}

interface ISerializableConstructor<T extends ISerializable> {
  fromJSON(data: Record<string, any>): T
}
