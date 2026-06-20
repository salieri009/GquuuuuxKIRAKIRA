import { describe, expect, it } from 'vitest';
import { getCorsOptions } from './cors.js';

describe('getCorsOptions', () => {
  it('defaults to local Vite origins when CORS_ORIGINS is unset', () => {
    const previous = process.env.CORS_ORIGINS;
    delete process.env.CORS_ORIGINS;

    expect(getCorsOptions().origin).toEqual([
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ]);

    if (previous === undefined) {
      delete process.env.CORS_ORIGINS;
    } else {
      process.env.CORS_ORIGINS = previous;
    }
  });

  it('parses comma-separated CORS_ORIGINS', () => {
    const previous = process.env.CORS_ORIGINS;
    process.env.CORS_ORIGINS = 'https://app.example.com, https://staging.example.com ';

    expect(getCorsOptions().origin).toEqual([
      'https://app.example.com',
      'https://staging.example.com',
    ]);

    if (previous === undefined) {
      delete process.env.CORS_ORIGINS;
    } else {
      process.env.CORS_ORIGINS = previous;
    }
  });
});
