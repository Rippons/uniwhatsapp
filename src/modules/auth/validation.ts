import { z } from 'zod/v4';
import { ROLES } from '@shared/constants';

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum([ROLES.ADMIN_DELEGATE, ROLES.ACADEMIC_DELEGATE, ROLES.SUPER_ADMIN]),
});
