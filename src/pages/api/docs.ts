import type { APIRoute } from 'astro';
import { swaggerDefinition } from '@core/config/swagger';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(swaggerDefinition), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
