import { z } from 'zod/v4';
import { DAYS_OF_WEEK } from '@shared/constants';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createScheduleSchema = z.object({
  studentId: z.string().min(1),
  subject: z.string().min(2).max(100),
  classroom: z.string().min(1).max(50),
  teacher: z.string().min(2).max(100),
  startTime: z.string().regex(timeRegex, 'Format: HH:MM'),
  endTime: z.string().regex(timeRegex, 'Format: HH:MM'),
  day: z.enum(DAYS_OF_WEEK),
});

export const updateScheduleSchema = z.object({
  subject: z.string().min(2).max(100).optional(),
  classroom: z.string().min(1).max(50).optional(),
  teacher: z.string().min(2).max(100).optional(),
  startTime: z.string().regex(timeRegex, 'Format: HH:MM').optional(),
  endTime: z.string().regex(timeRegex, 'Format: HH:MM').optional(),
  day: z.enum(DAYS_OF_WEEK).optional(),
});
