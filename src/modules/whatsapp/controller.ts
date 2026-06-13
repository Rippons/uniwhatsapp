import { whatsappService } from './service';
import { successResponse } from '@shared/responses';
import { handleError } from '@core/middleware';
import { getEnv } from '@core/config';
import { logger } from '@core/logger';

export class WhatsAppController {
  async verifyWebhook(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      const { WHATSAPP_VERIFY_TOKEN } = getEnv();

      if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
      }

      return new Response('Forbidden', { status: 403 });
    } catch (error) {
      return handleError(error);
    }
  }

  async handleWebhook(request: Request): Promise<Response> {
    try {
      // Twilio envía form-urlencoded, no JSON
      const contentType = request.headers.get('content-type') || '';
      let payload: Record<string, string> = {};

      if (contentType.includes('application/json')) {
        payload = await request.json();
      } else {
        // form-urlencoded (formato de Twilio sandbox)
        const text = await request.text();
        const params = new URLSearchParams(text);
        params.forEach((value, key) => { payload[key] = value; });
      }

      logger.info('[Webhook] Payload recibido: ' + JSON.stringify(payload));
      await whatsappService.handleWebhook(payload);
      return successResponse(null, 'Webhook processed');
    } catch (error) {
      logger.error('[Webhook] Error procesando webhook:', error);
      return handleError(error);
    }
  }
}

export const whatsappController = new WhatsAppController();