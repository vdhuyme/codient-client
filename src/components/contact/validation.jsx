import { z } from 'zod'

export const contactSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be at most 50 characters' }),

  email: z.string({ required_error: 'Email is required' }).email({ message: 'Email must be a valid email address' }),

  message: z
    .string({ required_error: 'Message is required' })
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(1000, { message: 'Message must be at most 1000 characters' })
})
