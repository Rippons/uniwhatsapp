import { z } from 'zod/v4';

const envSchema = z.object({
  PORT: z.coerce.number().default(4321),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('24h'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  WHATSAPP_VERIFY_TOKEN: z.string().default(''),
  WHATSAPP_API_TOKEN: z.string().default(''),
  WHATSAPP_PHONE_NUMBER_ID: z.string().default(''),
  TWILIO_ACCOUNT_SID: z.string().default(''),
  TWILIO_AUTH_TOKEN: z.string().default(''),
});

export type EnvConfig = z.infer<typeof envSchema>;

let _env: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (!_env) {
    const result = envSchema.safeParse(import.meta.env);
    if (!result.success) {
      const formatted = z.prettifyError(result.error);
      console.error('Invalid environment variables:', formatted);
      throw new Error('Invalid environment configuration');
    }
    _env = result.data;
  }
  return _env;
}