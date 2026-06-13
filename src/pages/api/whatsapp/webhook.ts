import type { APIRoute } from 'astro';
import { whatsappController } from '@modules/whatsapp';

export const GET: APIRoute = async ({ request }) => {
  return whatsappController.verifyWebhook(request);
};

export const POST: APIRoute = async ({ request }) => {
  return whatsappController.handleWebhook(request);
};
