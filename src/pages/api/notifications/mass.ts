import type { APIRoute } from 'astro';
import { notificationController } from '@modules/notifications';
import { authenticate, authorizeRoles } from '@core/middleware';

export const POST: APIRoute = async ({ request }) => {
  const user = authenticate(request);
  if (user instanceof Response) return user;

  const forbidden = authorizeRoles(user, 'SUPER_ADMIN', 'ADMIN_DELEGATE');
  if (forbidden) return forbidden;

  return notificationController.createMass(request, user);
};