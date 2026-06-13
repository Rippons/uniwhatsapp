import twilio from 'twilio';
import { logger } from '@core/logger';
import type {
  IWhatsAppProvider,
  OutgoingWhatsAppMessage,
  IncomingWhatsAppMessage,
} from './types';

export class TwilioWhatsAppProvider implements IWhatsAppProvider {
  private client: ReturnType<typeof twilio>;
  private fromNumber = 'whatsapp:+14155238886';

  constructor() {
    const accountSid = import.meta.env.TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new Error('TWILIO_ACCOUNT_SID y TWILIO_AUTH_TOKEN son requeridos');
    }

    this.client = twilio(accountSid, authToken);
  }

  async sendMessage(message: OutgoingWhatsAppMessage): Promise<void> {
    try {
      await this.client.messages.create({
        from: this.fromNumber,
        to: 'whatsapp:+57' + message.to,
        body: message.body,
      });
      logger.info('[WhatsApp Twilio] Mensaje enviado a ' + message.to);
    } catch (error: unknown) {
      logger.error('[WhatsApp Twilio] Error enviando mensaje a ' + message.to + ':', error);
      throw error;
    }
  }

  parseWebhook(payload: unknown): IncomingWhatsAppMessage[] {
    const data = payload as Record<string, string>;

    if (!data?.Body || !data?.From) return [];

    return [
      {
        from: data.From
          .replace('whatsapp:+57', '')
          .replace('whatsapp:+', '')
          .replace('whatsapp:', ''),
        body: data.Body.trim(),
        timestamp: String(Date.now()),
        messageId: data.MessageSid ?? '',
      },
    ];
  }
}

export const whatsappProvider: IWhatsAppProvider = new TwilioWhatsAppProvider();