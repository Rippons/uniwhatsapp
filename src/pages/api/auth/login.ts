import type { APIRoute } from 'astro';
import { authController } from '@modules/auth';
import { rateLimit } from '@core/middleware';

export const POST: APIRoute = async ({ request }) => {
  const limited = rateLimit(request, 10, 60_000);
  if (limited) return limited;

  return authController.login(request);
};
