import type { APIRoute } from 'astro';
import { scheduleController } from '@modules/schedules';
import { authenticate, authorizeRoles } from '@core/middleware';

export const GET: APIRoute = async ({ params, request }) => {
  const user = authenticate(request);
  if (user instanceof Response) return user;

  const forbidden = authorizeRoles(user, 'SUPER_ADMIN', 'ADMIN_DELEGATE', 'ACADEMIC_DELEGATE');
  if (forbidden) return forbidden;

  return scheduleController.getByStudent(params.id!);
};
