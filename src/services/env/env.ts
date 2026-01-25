import { z } from 'zod';
import log from 'loglevel';

export const envSchema = z.object({
  // VITE_ALPHA_VANTAGE_API_KEY: z.string().min(1),
  // VITE_MASSIVE_API_KEY: z.string().min(1),
});

// eslint-disable-next-line no-restricted-syntax
const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
  log.error('Invalid environment variables:', _env.error.message);
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
