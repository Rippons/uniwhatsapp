import { connectDatabase } from '@core/database';
import { logger } from '@core/logger';
import { whatsappProvider } from './provider';
import { parseCommand } from './parser';
import { dispatch } from './dispatcher';
import type { IncomingWhatsAppMessage } from './types';

export class WhatsAppService {
  async handleWebhook(payload: unknown): Promise<void> {
    await connectDatabase();
    const messages = whatsappProvider.parseWebhook(payload);

    for (const message of messages) {
      await this.processMessage(message);
    }
  }

  private async processMessage(message: IncomingWhatsAppMessage): Promise<void> {
    logger.info(`Received message from ${message.from}: ${message.body}`);

    const command = parseCommand(message.body);
    const response = await dispatch(command, message.from);

    await whatsappProvider.sendMessage({
      to: message.from,
      body: response,
    });
  }
}

export const whatsappService = new WhatsAppService();
