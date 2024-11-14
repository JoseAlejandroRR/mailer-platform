
export interface EmailAddressProps {
  name: string
  email: string
}

export class EmailAddress {
  constructor(
    public readonly name: string,
    public readonly email: string,
  ) {
      if (!this.isValidEmail(email)) {
          throw new Error(`Invalid email address: ${email}`)
      }
  }

  private isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
  }
}
