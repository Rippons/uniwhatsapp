import type { APIRoute } from 'astro';
import { authController } from '@modules/auth';
import { authenticate, authorizeRoles } from '@core/middleware';

export const POST: APIRoute = async ({ request }) => {
  const user = authenticate(request);
  if (user instanceof Response) return user;

  const forbidden = authorizeRoles(user, 'SUPER_ADMIN');
  if (forbidden) return forbidden;

  return authController.register(request);
};
