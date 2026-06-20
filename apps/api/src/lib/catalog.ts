import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Effect } from '@kirakira/contracts';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../..'
);
const effectsPath = path.join(repoRoot, 'packages', 'catalog', 'effects.json');

export async function loadEffects(): Promise<Effect[]> {
  const raw = await fs.readFile(effectsPath, 'utf-8');
  return JSON.parse(raw) as Effect[];
}
