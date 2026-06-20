import type { CorsOptions } from 'cors';

const DEFAULT_DEV_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

/**
 * CORS origins from CORS_ORIGINS (comma-separated).
 * Defaults to local Vite dev origins when unset.
 */
export function getCorsOptions(): CorsOptions {
  const configured = process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const origins = configured?.length ? configured : DEFAULT_DEV_ORIGINS;

  return {
    origin: origins,
    methods: ['GET', 'HEAD', 'OPTIONS'],
  };
}
