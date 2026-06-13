/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly MONGODB_URI: string;
  readonly JWT_SECRET: string;
  readonly JWT_EXPIRES_IN: string;
  readonly NODE_ENV: string;
  readonly WHATSAPP_VERIFY_TOKEN: string;
  readonly WHATSAPP_API_TOKEN: string;
  readonly WHATSAPP_PHONE_NUMBER_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
