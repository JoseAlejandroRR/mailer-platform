import { z } from 'zod'
import { RequireEmail, RequireString } from '.'

export const EmailAddressValidator = z.object({
  name: RequireString(),
  email: RequireEmail(), 
})
