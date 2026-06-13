import { z } from 'zod/v4';

export const createNotificationSchema = z.object({
  title: z.string().min(3).max(200),
  message: z.string().min(5).max(2000),
  targetStudents: z.array(z.string()).min(1),
  scheduledAt: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: 'scheduledAt debe ser una fecha válida',
    }),
});
