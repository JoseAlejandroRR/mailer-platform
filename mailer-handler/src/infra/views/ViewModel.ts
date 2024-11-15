abstract class ViewModel<T> {

  private data: Record<string, any>

  constructor(data: Record<string, any> ) {
    this.data = data
  }

  static createOne<T extends Record<string, any>, U extends ViewModel<T>>(
    clase: new (data: T) => U,
    data: T
  ): U {
    return new clase(data);
  }

  static createMany<T extends Record<string, any>, U extends ViewModel<T>>(
    clase: new (data: T) => U,
    data: T[]
  ): U[] {
    return data.map((item:T) => new clase(item))
  }
  

  public toJSON(): Record<string, any> {
    return this.data
  }
}

export default ViewModel
