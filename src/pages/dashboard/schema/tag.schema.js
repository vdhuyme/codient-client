import { z } from 'zod'

export const TAG_SCHEMA = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  status: z.enum(['published', 'blocked'], {
    required_error: 'Status is required'
  })
})
