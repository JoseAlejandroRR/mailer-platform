import { z } from 'zod'

export const RequireString = (minLength: number = 1, maxLength = 200) => z.string().min(minLength).max(maxLength)

export const OptionalString = (minLength: number = 0, maxLength = 200) => z.string().min(minLength).max(maxLength).optional()

export const RequireInteger = (min: number = 0, max: number = 10000000) => z.coerce.number().min(min).max(max)

export const OptionalInteger = (min: number = 0, max: number = 10000000) => z.coerce.number().min(min).max(max).optional()

export const RequireEmail = () => z.string().min(1).email('Invalid Email Address')

export const OptionalEmail = () => z.string().min(1).email('Invalid Email Address').optional()
