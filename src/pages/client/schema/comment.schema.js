import { z } from 'zod'

export const COMMENT_SCHEMA = z.object({
  content: z.string().min(3, 'Content at least 3 characters')
})
