import { z } from 'zod'

export const POST_SCHEMA = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters').max(200, 'Title must not exceed 200 characters'),
  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .min(10, 'Excerpt must be at least 10 characters')
    .max(500, 'Excerpt must not exceed 500 characters'),
  content: z.string().min(1, 'Content is required').min(50, 'Content must be at least 50 characters'),
  thumbnail: z.any().optional(),
  readTime: z
    .string()
    .min(1, 'Read time is required')
    .refine((val) => {
      const num = parseInt(val)
      return !isNaN(num) && num > 0 && num <= 999
    }, 'Read time must be a positive number between 1 and 999'),
  categoryId: z.union([z.string().min(1, 'Category is required'), z.number()]),
  tagIds: z.array(z.coerce.string()).min(1, 'At least one tag is required'),
  status: z.enum(['published', 'blocked'], {
    required_error: 'Status is required'
  })
})
