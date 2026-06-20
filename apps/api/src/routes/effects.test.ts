import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('GET /api/health', () => {
  it('returns ok status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(response.body.data.service).toBe('kirakira-api');
  });
});

describe('GET /api/effects', () => {
  it('returns effect catalog', async () => {
    const response = await request(app).get('/api/effects');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.some((effect: { id: string }) => effect.id === 'gn-particles')).toBe(
      true
    );
  });
});

describe('GET /api/effects/:id', () => {
  it('returns a single effect', async () => {
    const response = await request(app).get('/api/effects/gn-particles');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe('gn-particles');
  });

  it('returns 404 for unknown effect', async () => {
    const response = await request(app).get('/api/effects/not-exist');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
