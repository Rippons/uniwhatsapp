import type { APIRoute } from 'astro';
import { studentController } from '@modules/students';
import { authenticate, authorizeRoles } from '@core/middleware';

export const GET: APIRoute = async ({ params, request }) => {
  const user = authenticate(request);
  if (user instanceof Response) return user;

  const forbidden = authorizeRoles(user, 'SUPER_ADMIN', 'ADMIN_DELEGATE', 'ACADEMIC_DELEGATE');
  if (forbidden) return forbidden;

  return studentController.getById(params.id!);
};

export const PUT: APIRoute = async ({ params, request }) => {
  const user = authenticate(request);
  if (user instanceof Response) return user;

  const forbidden = authorizeRoles(user, 'SUPER_ADMIN', 'ADMIN_DELEGATE');
  if (forbidden) return forbidden;

  return studentController.update(params.id!, request);
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const user = authenticate(request);
  if (user instanceof Response) return user;

  const forbidden = authorizeRoles(user, 'SUPER_ADMIN');
  if (forbidden) return forbidden;

  return studentController.delete(params.id!);
};
