import type { Effect } from '@kirakira/contracts';
import effectsJson from '../effects.json';

/** JSON import infers `type` as string; catalog is validated at authoring time. */
export const effects = effectsJson as unknown as Effect[];
export default effects;
