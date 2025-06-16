import { z } from 'zod'

export const REGISTER_SCHEMA = z.object({
  name: z.string().min(3, 'Name min 3 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(8, 'Password at least 8 characters')
})
