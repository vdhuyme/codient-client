import { z } from 'zod'

export const FORGOT_PASSWORD_SCHEMA = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email')
})
