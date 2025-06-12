import { z } from 'zod'

export const CATEGORY_SCHEMA = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  thumbnail: z.string().nullable().optional(),
  icon: z.string().min(1, 'Icon is required'),
  parentId: z.number().nullable(),
  status: z.enum(['published', 'blocked'], {
    required_error: 'Status is required'
  })
})
