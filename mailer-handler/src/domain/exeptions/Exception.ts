export class Exception extends Error {
  public readonly code: string
  public readonly statusCode?: number

  constructor(code: string, message: string, statusCode?: number) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.code = code
    this.statusCode = statusCode

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  public toString(): string {
    return `Exception Code: ${this.code} ${this.statusCode ? `, Status Code:${this.statusCode}` : ''},\n ${this.stack}`
  }
}

export default Exception
