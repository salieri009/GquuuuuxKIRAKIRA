import cors from 'cors';
import express from 'express';
import type { ApiResponse, HealthResponse } from '@kirakira/contracts';
import { getCorsOptions } from './lib/cors.js';
import { effectsRouter } from './routes/effects.js';

export function createApp() {
  const app = express();

  app.use(cors(getCorsOptions()));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    const payload: ApiResponse<HealthResponse> = {
      success: true,
      data: {
        status: 'ok',
        service: 'kirakira-api',
        version: '0.0.0',
      },
      timestamp: new Date().toISOString(),
    };
    res.json(payload);
  });

  app.use('/api/effects', effectsRouter);

  return app;
}
