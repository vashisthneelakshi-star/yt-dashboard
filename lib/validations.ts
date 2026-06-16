import { z } from 'zod'
export const loginSchema = z.object({ username: z.string().min(1), password: z.string().min(1) })
export const createUserSchema = z.object({
  employeeId: z.string().optional(), name: z.string().min(2),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email().optional().or(z.literal('')),
  mobile: z.string().optional(), password: z.string().min(6),
  role: z.enum(['ADMIN','INCHARGE','PRODUCER','VIDEO_EDITOR','GRAPHIC_DESIGNER']),
  status: z.enum(['ACTIVE','INACTIVE','SUSPENDED']).default('ACTIVE'),
  stateId: z.string().optional(), branchId: z.string().optional(),
  editionId: z.string().optional(), departmentId: z.string().optional(),
  inchargeId: z.string().optional(), joiningDate: z.string().optional(),
  mustChangePassword: z.boolean().default(false),
})
export const updateUserSchema = createUserSchema.partial().omit({ password: true })
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(6) })
export const resetPasswordSchema = z.object({ newPassword: z.string().min(6), forceChange: z.boolean().optional() })
export const videoEntrySchema = z.object({
  date: z.string().min(1), videoTitle: z.string().min(1),
  youtubeUrl: z.string().url(), format: z.enum(['SHORT','LONG']),
  category: z.enum(['VO','BYTE','AI','INTERVIEW','GROUND_REPORT','SPECIAL','OTHER']),
  contributionRole: z.enum(['PRODUCER','VIDEO_EDITOR','GRAPHIC_DESIGNER']),
  remarks: z.string().optional(),
})
export const bulkUserRowSchema = z.object({
  employee_id: z.string().optional(), name: z.string().min(2),
  username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(6),
  role: z.enum(['ADMIN','INCHARGE','PRODUCER','VIDEO_EDITOR','GRAPHIC_DESIGNER']),
  state: z.string().optional(), branch: z.string().optional(),
  edition: z.string().optional(), email: z.string().email().optional().or(z.literal('')),
  mobile: z.string().optional(),
})
