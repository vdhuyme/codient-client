import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required' }).max(255, { message: 'Category name cannot exceed 255 characters' }),
  slug: z
    .string()
    .min(1, { message: 'Permalink is required' })
    .max(1000, { message: 'Permalink cannot exceed 1000 characters' })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Permalink can only contain lowercase letters, numbers, and hyphens'
    }),
  parent: z.string().nullable().optional(),
  description: z.string().optional()
})
