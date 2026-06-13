import type { APIRoute } from 'astro';
import { notificationController } from '@modules/notifications';
import { authenticate, authorizeRoles } from '@core/middleware';

export const GET: APIRoute = async ({ request }) => {
  try {
    const user = authenticate(request);
    if (user instanceof Response) return user;

    const forbidden = authorizeRoles(user, 'SUPER_ADMIN', 'ADMIN_DELEGATE', 'ACADEMIC_DELEGATE');
    if (forbidden) return forbidden;

    return notificationController.getAll(request);
  } catch (error) {
    console.error('Error en GET /api/notifications:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error al obtener notificaciones', error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  const user = authenticate(request);
  if (user instanceof Response) return user;

  const forbidden = authorizeRoles(user, 'SUPER_ADMIN', 'ADMIN_DELEGATE');
  if (forbidden) return forbidden;

  return notificationController.create(request, user);
};

export const DELETE: APIRoute = async ({ request }) => {
  const user = authenticate(request);
  if (user instanceof Response) return user;

  const forbidden = authorizeRoles(user, 'SUPER_ADMIN', 'ADMIN_DELEGATE');
  if (forbidden) return forbidden;

  return notificationController.delete(request);
};
