export interface IncomingWhatsAppMessage {
  from: string;
  body: string;
  timestamp: string;
  messageId: string;
}

export interface OutgoingWhatsAppMessage {
  to: string;
  body: string;
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: WhatsAppEntry[];
}

export interface WhatsAppEntry {
  id: string;
  changes: WhatsAppChange[];
}

export interface WhatsAppChange {
  value: {
    messaging_product: string;
    metadata: { display_phone_number: string; phone_number_id: string };
    messages?: WhatsAppRawMessage[];
  };
  field: string;
}

export interface WhatsAppRawMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: { body: string };
  type: string;
}

export interface ParsedCommand {
  command: string;
  args: string[];
  raw: string;
}

export interface IWhatsAppProvider {
  sendMessage(message: OutgoingWhatsAppMessage): Promise<void>;
  parseWebhook(payload: unknown): IncomingWhatsAppMessage[];
}
