import { z } from 'zod'

export const PROFILE_SCHEMA = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z
    .string()
    .regex(/^[0-9]+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits')
    .optional()
    .nullable(),
  dob: z.union([z.string(), z.date()]).optional().nullable(),
  avatar: z.string().optional().nullable()
})

export const PASSWORD_SCHEMA = z
  .object({
    oldPassword: z.string().min(6, 'Password must be at least 6 characters'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmationPassword: z.string().min(6, 'Password must be at least 6 characters')
  })
  .refine((data) => data.newPassword === data.confirmationPassword, {
    message: "Passwords don't match",
    path: ['confirmationPassword']
  })
