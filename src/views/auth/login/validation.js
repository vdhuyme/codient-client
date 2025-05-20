import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).trim().email({ message: 'Email must be a valid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(2, { message: 'Password must be at least 2 characters' })
    .max(50, { message: 'Password must be at most 50 characters' })
})
