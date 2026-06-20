import { Router, type Request, type Response } from 'express';
import type { ApiResponse, Effect } from '@kirakira/contracts';
import { loadEffects } from '../lib/catalog.js';

export const effectsRouter = Router();

effectsRouter.get('/', async (_req: Request, res: Response<ApiResponse<Effect[]>>) => {
  try {
    const effects = await loadEffects();
    res.json({
      success: true,
      data: effects,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load effects';
    res.status(500).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    });
  }
});

effectsRouter.get('/:id', async (req: Request, res: Response<ApiResponse<Effect>>) => {
  try {
    const effects = await loadEffects();
    const effect = effects.find((item) => item.id === req.params.id);

    if (!effect) {
      res.status(404).json({
        success: false,
        error: `Effect not found: ${req.params.id}`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json({
      success: true,
      data: effect,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load effect';
    res.status(500).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    });
  }
});
