import { z } from 'zod'

export const COMMENT_SCHEMA = z.object({
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['published', 'blocked'])
})
