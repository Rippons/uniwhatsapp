import type { APIRoute } from 'astro';
import { studentController } from '@modules/students';
import { authenticate, authorizeRoles } from '@core/middleware';

export const GET: APIRoute = async ({ request }) => {
  const user = authenticate(request);
  if (user instanceof Response) return user;

  const forbidden = authorizeRoles(user, 'SUPER_ADMIN', 'ADMIN_DELEGATE', 'ACADEMIC_DELEGATE');
  if (forbidden) return forbidden;

  return studentController.getAll(request);
};

export const POST: APIRoute = async ({ request }) => {
  const user = authenticate(request);
  if (user instanceof Response) return user;

  const forbidden = authorizeRoles(user, 'SUPER_ADMIN', 'ADMIN_DELEGATE');
  if (forbidden) return forbidden;

  return studentController.create(request);
};
