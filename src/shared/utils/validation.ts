import type { z } from 'zod/v4';
import { ValidationError } from '@shared/errors';

export function validateSchema<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join('.') || '_root';
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    }
    throw new ValidationError(errors);
  }
  return result.data;
}
